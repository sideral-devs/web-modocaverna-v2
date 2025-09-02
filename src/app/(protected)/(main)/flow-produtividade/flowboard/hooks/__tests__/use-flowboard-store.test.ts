import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'

// Mock the service
const mockService = {
  getBoards: vi.fn(),
  createBoard: vi.fn(),
  updateBoard: vi.fn(),
  deleteBoard: vi.fn(),
  saveBoardContent: vi.fn(),
  autoSaveBoardContent: vi.fn(),
  cleanup: vi.fn(),
}

vi.mock('../services/localStorage-flowboard-service', () => ({
  LocalStorageFlowBoardService: vi.fn().mockImplementation(() => mockService)
}))

// Import after mocking
import { useFlowBoardStore } from '../use-flowboard-store'
import { FlowBoard } from '../../types/flowboard.types'

describe('useFlowBoardStore', () => {
  const mockBoard: FlowBoard = {
    id: 'board-1',
    userId: 'user-1',
    name: 'Test Board',
    content: {
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    },
    createdAt: new Date(),
    updatedAt: new Date()
  }

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    useFlowBoardStore.setState({
      boards: [],
      activeBoard: null,
      isLoading: false,
      error: null,
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      selectedTool: 'select',
      isCanvasReady: false,
    })
  })

  describe('Board Management', () => {
    it('should load boards', async () => {
      mockService.getBoards.mockResolvedValue([mockBoard])

      const { result } = renderHook(() => useFlowBoardStore())

      await act(async () => {
        await result.current.loadBoards()
      })

      expect(result.current.boards).toHaveLength(1)
      expect(result.current.boards[0]).toEqual(mockBoard)
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle loading state', async () => {
      mockService.getBoards.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)))

      const { result } = renderHook(() => useFlowBoardStore())

      act(() => {
        result.current.loadBoards()
      })

      expect(result.current.isLoading).toBe(true)
    })

    it('should create a board', async () => {
      mockService.createBoard.mockResolvedValue(mockBoard)
      mockService.getBoards.mockResolvedValue([mockBoard])

      const { result } = renderHook(() => useFlowBoardStore())

      await act(async () => {
        await result.current.createBoard('Test Board')
      })

      expect(mockService.createBoard).toHaveBeenCalledWith('Test Board')
      expect(result.current.boards).toHaveLength(1)
    })

    it('should select a board', () => {
      const { result } = renderHook(() => useFlowBoardStore())

      act(() => {
        result.current.selectBoard(mockBoard)
      })

      expect(result.current.activeBoard).toEqual(mockBoard)
      expect(result.current.nodes).toEqual(mockBoard.content.nodes)
      expect(result.current.edges).toEqual(mockBoard.content.edges)
      expect(result.current.viewport).toEqual(mockBoard.content.viewport)
    })

    it('should update board name', async () => {
      const updatedBoard = { ...mockBoard, name: 'Updated Name' }
      mockService.updateBoard.mockResolvedValue(updatedBoard)
      mockService.getBoards.mockResolvedValue([updatedBoard])

      const { result } = renderHook(() => useFlowBoardStore())

      await act(async () => {
        await result.current.updateBoardName(mockBoard.id, 'Updated Name')
      })

      expect(mockService.updateBoard).toHaveBeenCalledWith(mockBoard.id, { name: 'Updated Name' })
    })

    it('should delete a board', async () => {
      mockService.deleteBoard.mockResolvedValue(undefined)
      mockService.getBoards.mockResolvedValue([])

      const { result } = renderHook(() => useFlowBoardStore())

      // Set initial state with the board
      act(() => {
        result.current.selectBoard(mockBoard)
      })

      await act(async () => {
        await result.current.deleteBoard(mockBoard.id)
      })

      expect(mockService.deleteBoard).toHaveBeenCalledWith(mockBoard.id)
      expect(result.current.activeBoard).toBeNull()
    })
  })

  describe('Canvas State', () => {
    it('should update nodes', () => {
      const { result } = renderHook(() => useFlowBoardStore())
      const newNodes = [{
        id: 'node-1',
        type: 'text' as const,
        position: { x: 100, y: 100 },
        data: { content: 'Test' }
      }]

      act(() => {
        result.current.updateNodes(newNodes)
      })

      expect(result.current.nodes).toEqual(newNodes)
    })

    it('should update edges', () => {
      const { result } = renderHook(() => useFlowBoardStore())
      const newEdges = [{
        id: 'edge-1',
        source: 'node-1',
        target: 'node-2'
      }]

      act(() => {
        result.current.updateEdges(newEdges)
      })

      expect(result.current.edges).toEqual(newEdges)
    })

    it('should update viewport', () => {
      const { result } = renderHook(() => useFlowBoardStore())
      const newViewport = { x: 100, y: 200, zoom: 1.5 }

      act(() => {
        result.current.updateViewport(newViewport)
      })

      expect(result.current.viewport).toEqual(newViewport)
    })
  })

  describe('Auto-save', () => {
    it('should trigger auto-save when active board exists', () => {
      const { result } = renderHook(() => useFlowBoardStore())

      // Set active board
      act(() => {
        result.current.selectBoard(mockBoard)
      })

      // Trigger auto-save
      act(() => {
        result.current.autoSave()
      })

      expect(mockService.autoSaveBoardContent).toHaveBeenCalledWith(
        mockBoard.id,
        expect.objectContaining({
          nodes: expect.any(Array),
          edges: expect.any(Array),
          viewport: expect.any(Object)
        })
      )
    })

    it('should not auto-save when no active board', () => {
      const { result } = renderHook(() => useFlowBoardStore())

      act(() => {
        result.current.autoSave()
      })

      expect(mockService.autoSaveBoardContent).not.toHaveBeenCalled()
    })
  })

  describe('Error Handling', () => {
    it('should handle board creation errors', async () => {
      const error = new Error('Creation failed')
      mockService.createBoard.mockRejectedValue(error)

      const { result } = renderHook(() => useFlowBoardStore())

      await act(async () => {
        await result.current.createBoard('Test Board')
      })

      expect(result.current.error).toBe('Creation failed')
      expect(result.current.isLoading).toBe(false)
    })

    it('should handle board loading errors', async () => {
      const error = new Error('Loading failed')
      mockService.getBoards.mockRejectedValue(error)

      const { result } = renderHook(() => useFlowBoardStore())

      await act(async () => {
        await result.current.loadBoards()
      })

      expect(result.current.error).toBe('Loading failed')
      expect(result.current.isLoading).toBe(false)
    })
  })

  describe('UI State', () => {
    it('should update selected tool', () => {
      const { result } = renderHook(() => useFlowBoardStore())

      act(() => {
        result.current.setSelectedTool('text')
      })

      expect(result.current.selectedTool).toBe('text')
    })

    it('should update canvas ready state', () => {
      const { result } = renderHook(() => useFlowBoardStore())

      act(() => {
        result.current.setCanvasReady(true)
      })

      expect(result.current.isCanvasReady).toBe(true)
    })
  })
})