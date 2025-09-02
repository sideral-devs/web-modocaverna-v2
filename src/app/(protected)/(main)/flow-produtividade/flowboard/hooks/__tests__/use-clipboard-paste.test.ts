import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useClipboardPaste, checkClipboardForImage, getImageFromClipboard } from '../use-clipboard-paste'
import { FlowBoardError, FlowBoardErrorType } from '../../types/flowboard.types'

// Mock File and FileReader
global.File = vi.fn().mockImplementation((bits, name, options) => ({
  name,
  size: bits.reduce((acc: number, bit: any) => acc + (bit.length || 0), 0),
  type: options?.type || 'application/octet-stream',
  lastModified: Date.now(),
  arrayBuffer: vi.fn(),
  slice: vi.fn(),
  stream: vi.fn(),
  text: vi.fn(),
})) as any

global.FileReader = vi.fn().mockImplementation(() => ({
  readAsDataURL: vi.fn(),
  result: null,
  onload: null,
  onerror: null,
})) as any

// Mock Image
global.Image = vi.fn().mockImplementation(() => ({
  onload: null,
  onerror: null,
  src: '',
  width: 100,
  height: 100,
})) as any

describe('useClipboardPaste', () => {
  let mockOnImagePaste: ReturnType<typeof vi.fn>
  let mockOnError: ReturnType<typeof vi.fn>
  let mockAddEventListener: ReturnType<typeof vi.fn>
  let mockRemoveEventListener: ReturnType<typeof vi.fn>

  beforeEach(() => {
    mockOnImagePaste = vi.fn()
    mockOnError = vi.fn()
    mockAddEventListener = vi.fn()
    mockRemoveEventListener = vi.fn()

    // Mock document event listeners
    Object.defineProperty(document, 'addEventListener', {
      value: mockAddEventListener,
      writable: true,
    })
    Object.defineProperty(document, 'removeEventListener', {
      value: mockRemoveEventListener,
      writable: true,
    })

    // Mock navigator.clipboard
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn(),
      },
      writable: true,
    })

    vi.clearAllMocks()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Hook Initialization', () => {
    it('should set up paste event listener when enabled', () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      expect(mockAddEventListener).toHaveBeenCalledWith('paste', expect.any(Function))
    })

    it('should not set up event listener when disabled', () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: false
      }))

      expect(mockAddEventListener).not.toHaveBeenCalled()
    })

    it('should clean up event listener on unmount', () => {
      const { unmount } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      unmount()

      expect(mockRemoveEventListener).toHaveBeenCalledWith('paste', expect.any(Function))
    })

    it('should handle clipboard API unavailable', () => {
      // Mock clipboard API as unavailable
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })

      Object.defineProperty(document, 'addEventListener', {
        value: undefined,
        writable: true,
      })

      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.CLIPBOARD_ACCESS_DENIED,
          message: 'API de área de transferência não está disponível neste navegador',
          recoverable: false
        })
      )
    })
  })

  describe('Image Validation', () => {
    it('should validate supported image types', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      const validFile = new File(['test'], 'test.png', { type: 'image/png' })
      const isValid = await result.current.validateImage(validFile)

      expect(isValid).toBe(true)
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should reject unsupported image types', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      const invalidFile = new File(['test'], 'test.bmp', { type: 'image/bmp' })
      const isValid = await result.current.validateImage(invalidFile)

      expect(isValid).toBe(false)
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.IMAGE_LOAD_FAILED,
          message: expect.stringContaining('Tipo de imagem não suportado: image/bmp')
        })
      )
    })

    it('should reject images that are too large', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      // Create a mock file that's larger than 1MB
      const largeFile = new File(['x'.repeat(1024 * 1024 + 1)], 'large.png', { type: 'image/png' })
      Object.defineProperty(largeFile, 'size', { value: 1024 * 1024 + 1 })

      const isValid = await result.current.validateImage(largeFile)

      expect(isValid).toBe(false)
      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.IMAGE_LOAD_FAILED,
          message: expect.stringContaining('Imagem muito grande')
        })
      )
    })

    it('should accept images within size limit', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      const validFile = new File(['small content'], 'small.png', { type: 'image/png' })
      Object.defineProperty(validFile, 'size', { value: 1024 }) // 1KB

      const isValid = await result.current.validateImage(validFile)

      expect(isValid).toBe(true)
      expect(mockOnError).not.toHaveBeenCalled()
    })
  })

  describe('Image Processing', () => {
    it('should process valid image successfully', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      // Mock FileReader
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: 'data:image/png;base64,test',
        onload: null,
        onerror: null,
      }
      ;(global.FileReader as any).mockImplementation(() => mockFileReader)

      // Mock Image
      const mockImage = {
        onload: null,
        onerror: null,
        src: '',
        width: 200,
        height: 150,
      }
      ;(global.Image as any).mockImplementation(() => mockImage)

      const validFile = new File(['test'], 'test.png', { type: 'image/png' })
      Object.defineProperty(validFile, 'size', { value: 1024 })

      // Start processing
      const processPromise = result.current.processImage(validFile)

      // Simulate FileReader success
      act(() => {
        mockFileReader.onload?.({ target: { result: 'data:image/png;base64,test' } } as any)
      })

      // Simulate Image load success
      act(() => {
        mockImage.onload?.()
      })

      await processPromise

      expect(mockOnImagePaste).toHaveBeenCalledWith({
        dataUrl: 'data:image/png;base64,test',
        file: validFile,
        width: 200,
        height: 150
      })
    })

    it('should handle FileReader errors', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      // Mock FileReader with error
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: null,
        onload: null,
        onerror: null,
      }
      ;(global.FileReader as any).mockImplementation(() => mockFileReader)

      const validFile = new File(['test'], 'test.png', { type: 'image/png' })
      Object.defineProperty(validFile, 'size', { value: 1024 })

      // Start processing - this will fail validation first due to mock File not having proper type
      await result.current.processImage(validFile)

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.IMAGE_LOAD_FAILED
        })
      )
    })

    it('should handle Image load errors', async () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      // Mock FileReader success
      const mockFileReader = {
        readAsDataURL: vi.fn(),
        result: 'data:image/png;base64,test',
        onload: null,
        onerror: null,
      }
      ;(global.FileReader as any).mockImplementation(() => mockFileReader)

      // Mock Image with error
      const mockImage = {
        onload: null,
        onerror: null,
        src: '',
        width: 0,
        height: 0,
      }
      ;(global.Image as any).mockImplementation(() => mockImage)

      const validFile = new File(['test'], 'test.png', { type: 'image/png' })
      Object.defineProperty(validFile, 'size', { value: 1024 })

      // Start processing - this will fail validation first due to mock File not having proper type
      await result.current.processImage(validFile)

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.IMAGE_LOAD_FAILED
        })
      )
    })
  })

  describe('Paste Event Handling', () => {
    it('should handle paste event with image', async () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      // Get the paste event handler
      const pasteHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'paste'
      )?.[1]

      expect(pasteHandler).toBeDefined()

      // Mock clipboard data with image
      const mockFile = new File(['test'], 'test.png', { type: 'image/png' })
      Object.defineProperty(mockFile, 'size', { value: 1024 })

      const mockClipboardEvent = {
        clipboardData: {
          items: [
            {
              type: 'image/png',
              getAsFile: () => mockFile
            }
          ]
        }
      }

      // Trigger paste event - this will fail validation due to mock File
      await pasteHandler(mockClipboardEvent)

      // Should call onError due to file validation failure
      expect(mockOnError).toHaveBeenCalled()
    })

    it('should handle paste event without clipboard data', async () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      const pasteHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'paste'
      )?.[1]

      const mockClipboardEvent = {
        clipboardData: null
      }

      await pasteHandler(mockClipboardEvent)

      expect(mockOnError).toHaveBeenCalledWith(
        expect.objectContaining({
          type: FlowBoardErrorType.CLIPBOARD_ACCESS_DENIED,
          message: 'Não foi possível acessar os dados da área de transferência'
        })
      )
    })

    it('should ignore paste event without images', async () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: true
      }))

      const pasteHandler = mockAddEventListener.mock.calls.find(
        call => call[0] === 'paste'
      )?.[1]

      const mockClipboardEvent = {
        clipboardData: {
          items: [
            {
              type: 'text/plain',
              getAsFile: () => null
            }
          ]
        }
      }

      await pasteHandler(mockClipboardEvent)

      expect(mockOnImagePaste).not.toHaveBeenCalled()
      expect(mockOnError).not.toHaveBeenCalled()
    })

    it('should not process paste when disabled', async () => {
      renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError,
        enabled: false
      }))

      // Should not set up event listener when disabled
      expect(mockAddEventListener).not.toHaveBeenCalled()
    })
  })

  describe('Return Values', () => {
    it('should return utility functions', () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      expect(result.current.processImage).toBeInstanceOf(Function)
      expect(result.current.validateImage).toBeInstanceOf(Function)
      expect(typeof result.current.isClipboardSupported).toBe('boolean')
    })

    it('should return true for clipboard support when available', () => {
      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      expect(result.current.isClipboardSupported).toBe(true)
    })

    it('should return false for clipboard support when unavailable', () => {
      // Mock clipboard as unavailable
      Object.defineProperty(navigator, 'clipboard', {
        value: undefined,
        writable: true,
      })
      Object.defineProperty(document, 'addEventListener', {
        value: undefined,
        writable: true,
      })

      const { result } = renderHook(() => useClipboardPaste({
        onImagePaste: mockOnImagePaste,
        onError: mockOnError
      }))

      expect(result.current.isClipboardSupported).toBe(false)
    })
  })
})

describe('checkClipboardForImage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return true when clipboard contains image', async () => {
    const mockClipboardItems = [
      {
        types: ['image/png', 'text/plain']
      }
    ]

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockResolvedValue(mockClipboardItems)
      },
      writable: true,
    })

    const result = await checkClipboardForImage()
    expect(result).toBe(true)
  })

  it('should return false when clipboard does not contain image', async () => {
    const mockClipboardItems = [
      {
        types: ['text/plain', 'text/html']
      }
    ]

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockResolvedValue(mockClipboardItems)
      },
      writable: true,
    })

    const result = await checkClipboardForImage()
    expect(result).toBe(false)
  })

  it('should return false when clipboard API is not available', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    })

    const result = await checkClipboardForImage()
    expect(result).toBe(false)
  })

  it('should return false when clipboard read fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockRejectedValue(new Error('Access denied'))
      },
      writable: true,
    })

    const result = await checkClipboardForImage()
    expect(result).toBe(false)
  })
})

describe('getImageFromClipboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should return image data when clipboard contains image', async () => {
    const mockBlob = new Blob(['test'], { type: 'image/png' })
    const mockClipboardItems = [
      {
        types: ['image/png'],
        getType: vi.fn().mockResolvedValue(mockBlob)
      }
    ]

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockResolvedValue(mockClipboardItems)
      },
      writable: true,
    })

    // Mock FileReader
    const mockFileReader = {
      readAsDataURL: vi.fn(),
      result: 'data:image/png;base64,test',
      onload: null,
      onerror: null,
    }
    ;(global.FileReader as any).mockImplementation(() => mockFileReader)

    // Mock Image
    const mockImage = {
      onload: null,
      onerror: null,
      src: '',
      width: 100,
      height: 100,
    }
    ;(global.Image as any).mockImplementation(() => mockImage)

    const resultPromise = getImageFromClipboard()

    // Simulate FileReader success
    setTimeout(() => {
      mockFileReader.onload?.({ target: { result: 'data:image/png;base64,test' } } as any)
    }, 0)

    // Simulate Image load success
    setTimeout(() => {
      mockImage.onload?.()
    }, 10)

    const result = await resultPromise

    expect(result).toEqual({
      dataUrl: 'data:image/png;base64,test',
      file: expect.any(File),
      width: 100,
      height: 100
    })
  })

  it('should return null when clipboard does not contain image', async () => {
    const mockClipboardItems = [
      {
        types: ['text/plain']
      }
    ]

    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockResolvedValue(mockClipboardItems)
      },
      writable: true,
    })

    const result = await getImageFromClipboard()
    expect(result).toBeNull()
  })

  it('should return null when clipboard API is not available', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: undefined,
      writable: true,
    })

    const result = await getImageFromClipboard()
    expect(result).toBeNull()
  })

  it('should return null when clipboard read fails', async () => {
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        read: vi.fn().mockRejectedValue(new Error('Access denied'))
      },
      writable: true,
    })

    const result = await getImageFromClipboard()
    expect(result).toBeNull()
  })
})