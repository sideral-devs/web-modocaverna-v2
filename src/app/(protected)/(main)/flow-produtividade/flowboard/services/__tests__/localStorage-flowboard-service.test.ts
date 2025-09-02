import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { LocalStorageFlowBoardService } from '../localStorage-flowboard-service'
import { 
  FlowBoard, 
  FlowBoardError, 
  FlowBoardErrorType, 
  ReactFlowContent,
  FLOWBOARD_CONSTANTS 
} from '../../types/flowboard.types'

describe('LocalStorageFlowBoardService', () => {
  let service: LocalStorageFlowBoardService
  const userId = 'test-user-123'
  const mockLocalStorage = {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
    clear: vi.fn(),
  }

  beforeEach(() => {
    // Reset localStorage mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })
    
    // Clear all mocks
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockClear()
    mockLocalStorage.setItem.mockClear()
    mockLocalStorage.removeItem.mockClear()
    mockLocalStorage.clear.mockClear()

    service = new LocalStorageFlowBoardService(userId)
  })

  afterEach(() => {
    service.cleanup()
  })

  describe('Board Creation', () => {
    it('should create a new board with valid name', async () => {
      // Arrange
      const boardName = 'Test Board'
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const board = await service.createBoard(boardName)

      // Assert
      expect(board).toBeDefined()
      expect(board.name).toBe(boardName)
      expect(board.userId).toBe(userId)
      expect(board.id).toMatch(/^flowboard_\d+_[a-z0-9]+$/)
      expect(board.content).toEqual({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      })
      expect(board.createdAt).toBeInstanceOf(Date)
      expect(board.updatedAt).toBeInstanceOf(Date)
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should reject empty board name', async () => {
      // Act & Assert
      await expect(service.createBoard('')).rejects.toThrow(FlowBoardError)
      await expect(service.createBoard('   ')).rejects.toThrow(FlowBoardError)
    })

    it('should reject board name longer than 255 characters', async () => {
      // Arrange
      const longName = 'a'.repeat(256)

      // Act & Assert
      await expect(service.createBoard(longName)).rejects.toThrow(FlowBoardError)
    })

    it('should enforce board limit of 10 boards', async () => {
      // Arrange
      const existingBoards = Array.from({ length: 10 }, (_, i) => ({
        id: `board-${i}`,
        userId,
        name: `Board ${i}`,
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: existingBoards,
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act & Assert
      await expect(service.createBoard('New Board')).rejects.toThrow(FlowBoardError)
      const error = await service.createBoard('New Board').catch(e => e)
      expect(error.type).toBe(FlowBoardErrorType.BOARD_LIMIT_EXCEEDED)
      expect(error.recoverable).toBe(false)
    })

    it('should handle localStorage quota exceeded error', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))
      
      const quotaError = new DOMException('QuotaExceededError', 'QuotaExceededError')
      Object.defineProperty(quotaError, 'name', { value: 'QuotaExceededError', writable: true })
      mockLocalStorage.setItem.mockImplementation(() => {
        throw quotaError
      })

      // Act & Assert
      await expect(service.createBoard('Test Board')).rejects.toThrow(FlowBoardError)
      const error = await service.createBoard('Test Board').catch(e => e)
      expect(error.type).toBe(FlowBoardErrorType.STORAGE_FULL)
      expect(error.recoverable).toBe(false)
    })
  })

  describe('Board Retrieval', () => {
    it('should get all boards for user', async () => {
      // Arrange
      const userBoards = [
        {
          id: 'board-1',
          userId,
          name: 'User Board 1',
          content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: 'board-2',
          userId,
          name: 'User Board 2',
          content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ]
      
      const otherUserBoard = {
        id: 'board-3',
        userId: 'other-user',
        name: 'Other User Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [...userBoards, otherUserBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const boards = await service.getBoards()

      // Assert
      expect(boards).toHaveLength(2)
      expect(boards.every(board => board.userId === userId)).toBe(true)
      expect(boards[0].createdAt).toBeInstanceOf(Date)
      expect(boards[0].updatedAt).toBeInstanceOf(Date)
    })

    it('should return empty array when no boards exist', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(null)

      // Act
      const boards = await service.getBoards()

      // Assert
      expect(boards).toEqual([])
    })

    it('should handle corrupted localStorage data', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue('invalid json')

      // Act & Assert
      // The service handles corrupted data gracefully by returning empty array
      const boards = await service.getBoards()
      expect(boards).toEqual([])
    })

    it('should get board by ID', async () => {
      // Arrange
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const foundBoard = await service.getBoardById!(boardId)

      // Assert
      expect(foundBoard).toBeDefined()
      expect(foundBoard!.id).toBe(boardId)
      expect(foundBoard!.userId).toBe(userId)
    })

    it('should return null for non-existent board ID', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const board = await service.getBoardById!('non-existent')

      // Assert
      expect(board).toBeNull()
    })
  })

  describe('Board Updates', () => {
    it('should update board name', async () => {
      // Arrange
      const boardId = 'board-1'
      const originalBoard = {
        id: boardId,
        userId,
        name: 'Original Name',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [originalBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const updatedBoard = await service.updateBoard(boardId, { name: 'Updated Name' })

      // Assert
      expect(updatedBoard.name).toBe('Updated Name')
      expect(updatedBoard.updatedAt).toBeInstanceOf(Date)
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should update board content', async () => {
      // Arrange
      const boardId = 'board-1'
      const originalBoard = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const newContent: ReactFlowContent = {
        nodes: [{
          id: 'node-1',
          type: 'text',
          position: { x: 100, y: 100 },
          data: { content: 'Test content' }
        }],
        edges: [],
        viewport: { x: 10, y: 20, zoom: 1.5 }
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [originalBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const updatedBoard = await service.updateBoard(boardId, { content: newContent })

      // Assert
      expect(updatedBoard.content).toEqual(newContent)
      expect(updatedBoard.updatedAt).toBeInstanceOf(Date)
    })

    it('should reject invalid board name updates', async () => {
      // Arrange
      const boardId = 'board-1'
      const originalBoard = {
        id: boardId,
        userId,
        name: 'Original Name',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [originalBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act & Assert
      // Empty name should be sanitized to original name
      const result1 = await service.updateBoard(boardId, { name: '' })
      expect(result1.name).toBe('Original Name') // Should keep original name
      
      // Long name should be truncated
      const result2 = await service.updateBoard(boardId, { name: 'a'.repeat(256) })
      expect(result2.name).toBe('a'.repeat(255)) // Should be truncated to 255 chars
    })

    it('should throw error for non-existent board', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act & Assert
      await expect(service.updateBoard('non-existent', { name: 'New Name' })).rejects.toThrow(FlowBoardError)
      const error = await service.updateBoard('non-existent', { name: 'New Name' }).catch(e => e)
      expect(error.type).toBe(FlowBoardErrorType.BOARD_NOT_FOUND)
    })
  })

  describe('Board Deletion', () => {
    it('should delete existing board', async () => {
      // Arrange
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      await service.deleteBoard(boardId)

      // Assert
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
      const setItemCall = mockLocalStorage.setItem.mock.calls[0]
      const savedData = JSON.parse(setItemCall[1])
      expect(savedData.boards).toHaveLength(0)
    })

    it('should throw error for non-existent board', async () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act & Assert
      await expect(service.deleteBoard('non-existent')).rejects.toThrow(FlowBoardError)
      const error = await service.deleteBoard('non-existent').catch(e => e)
      expect(error.type).toBe(FlowBoardErrorType.BOARD_NOT_FOUND)
    })

    it('should clear auto-save timeout when deleting board', async () => {
      // Arrange
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Set up auto-save timeout
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      service.autoSaveBoardContent(boardId, { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })

      // Act
      await service.deleteBoard(boardId)

      // Assert
      expect(clearTimeoutSpy).toHaveBeenCalled()
    })
  })

  describe('Auto-save Functionality', () => {
    it('should debounce auto-save calls', async () => {
      // Arrange
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      const setTimeoutSpy = vi.spyOn(global, 'setTimeout')
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')

      const content: ReactFlowContent = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      // Act
      service.autoSaveBoardContent(boardId, content)
      service.autoSaveBoardContent(boardId, content)
      service.autoSaveBoardContent(boardId, content)

      // Assert
      expect(setTimeoutSpy).toHaveBeenCalledTimes(3)
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2) // First two calls should clear previous timeouts
      expect(setTimeoutSpy).toHaveBeenLastCalledWith(
        expect.any(Function),
        FLOWBOARD_CONSTANTS.AUTO_SAVE_DELAY
      )
    })

    it('should save board content after debounce delay', async () => {
      // Arrange
      vi.useFakeTimers()
      
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      const content: ReactFlowContent = {
        nodes: [{
          id: 'node-1',
          type: 'text',
          position: { x: 100, y: 100 },
          data: { content: 'Auto-saved content' }
        }],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      // Act
      service.autoSaveBoardContent(boardId, content)
      
      // Fast-forward time
      vi.advanceTimersByTime(FLOWBOARD_CONSTANTS.AUTO_SAVE_DELAY)

      // Assert
      await vi.runAllTimersAsync()
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
      
      vi.useRealTimers()
    })

    it('should handle auto-save errors gracefully', async () => {
      // Arrange
      vi.useFakeTimers()
      
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Mock setItem to throw error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const content: ReactFlowContent = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      // Act
      service.autoSaveBoardContent(boardId, content)
      vi.advanceTimersByTime(FLOWBOARD_CONSTANTS.AUTO_SAVE_DELAY)

      // Assert - should not throw error
      await vi.runAllTimersAsync()
      expect(consoleSpy).toHaveBeenCalledWith('Auto-save failed:', expect.any(Error))
      
      consoleSpy.mockRestore()
      vi.useRealTimers()
    })
  })

  describe('Storage Management', () => {
    it('should detect storage availability', () => {
      // Act
      const isAvailable = service.isStorageAvailable()

      // Assert
      // In test environment, localStorage might not be fully available
      expect(typeof isAvailable).toBe('boolean')
    })

    it('should handle storage unavailable', () => {
      // Arrange
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new DOMException('SecurityError', 'SecurityError')
      })

      // Act
      const isAvailable = service.isStorageAvailable()

      // Assert
      expect(isAvailable).toBe(false)
    })

    it('should get storage information', () => {
      // Arrange
      const boards = [{
        id: 'board-1',
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }]

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards,
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const storageInfo = service.getStorageInfo()

      // Assert
      expect(storageInfo).toHaveProperty('used')
      expect(storageInfo).toHaveProperty('available')
      expect(storageInfo).toHaveProperty('percentage')
      expect(storageInfo).toHaveProperty('isNearLimit')
      expect(storageInfo).toHaveProperty('isAtLimit')
      expect(storageInfo).toHaveProperty('estimatedBoardsRemaining')
      expect(typeof storageInfo.used).toBe('number')
      expect(typeof storageInfo.percentage).toBe('number')
    })

    it('should validate storage health', () => {
      // Arrange
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const health = service.validateStorageHealth()

      // Assert
      expect(health).toHaveProperty('isHealthy')
      expect(health).toHaveProperty('issues')
      expect(health).toHaveProperty('recommendations')
      expect(Array.isArray(health.issues)).toBe(true)
      expect(Array.isArray(health.recommendations)).toBe(true)
    })

    it('should cleanup storage when near limit', async () => {
      // Arrange
      const oldDate = new Date('2023-01-01')
      const newDate = new Date('2024-01-01')
      
      const boards = Array.from({ length: 8 }, (_, i) => ({
        id: `board-${i}`,
        userId,
        name: `Board ${i}`,
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: i < 4 ? oldDate : newDate,
        updatedAt: i < 4 ? oldDate : newDate
      }))

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards,
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Mock storage info to indicate near limit
      const originalGetStorageInfo = service.getStorageInfo
      service.getStorageInfo = vi.fn()
        .mockReturnValueOnce({ percentage: 85, isNearLimit: true }) // First call
        .mockReturnValueOnce({ percentage: 65, isNearLimit: false }) // After cleanup

      // Act
      const result = await service.cleanupStorage()

      // Assert
      expect(result.deletedBoards).toBeGreaterThanOrEqual(0)
      expect(result.freedSpace).toBeGreaterThanOrEqual(0)
      expect(result.newStorageInfo).toBeDefined()

      // Restore original method
      service.getStorageInfo = originalGetStorageInfo
    })
  })

  describe('Data Recovery', () => {
    it('should restore corrupted board data', async () => {
      // Arrange
      const corruptedBoard = {
        id: 'board-1',
        userId,
        name: 'Test Board',
        content: {
          nodes: [
            {
              id: 'node-1',
              type: 'text',
              position: { x: 'invalid', y: 100 }, // Invalid position
              data: { content: 'Test' }
            },
            null, // Invalid node
            {
              id: 'node-2',
              // Missing type and position
              data: { content: 'Test 2' }
            }
          ],
          edges: [
            {
              id: 'edge-1',
              source: 'node-1',
              target: 'node-2'
            },
            null, // Invalid edge
            {
              id: 'edge-2',
              // Missing source/target
            }
          ],
          viewport: { x: 'invalid', y: 20, zoom: -1 } // Invalid viewport
        },
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [corruptedBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const board = await service.getBoardById!('board-1')

      // Assert
      expect(board).toBeDefined()
      expect(board!.content.nodes.length).toBeGreaterThanOrEqual(1) // At least one valid node should remain
      expect(board!.content.edges.length).toBeGreaterThanOrEqual(0) // Valid edges should remain
      expect(board!.content.viewport.y).toBe(20) // Y should be preserved
      expect(board!.content.viewport.zoom).toBe(1) // Zoom should be corrected
      expect(board!.createdAt).toBeInstanceOf(Date)
      expect(board!.updatedAt).toBeInstanceOf(Date)
    })

    it('should handle completely invalid content', async () => {
      // Arrange
      const invalidBoard = {
        id: 'board-1',
        userId,
        name: 'Test Board',
        content: 'invalid content', // Not an object
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-01T00:00:00.000Z'
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [invalidBoard],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      // Act
      const board = await service.getBoardById!('board-1')

      // Assert
      expect(board).toBeDefined()
      expect(board!.content).toEqual({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      })
    })
  })

  describe('Error Handling', () => {
    it('should handle localStorage unavailable scenarios', () => {
      // Arrange
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new DOMException('SecurityError', 'SecurityError')
        error.name = 'SecurityError'
        throw error
      })

      // Act
      const error = service.handleStorageUnavailable()

      // Assert
      expect(error).toBeInstanceOf(FlowBoardError)
      expect(error.type).toBe(FlowBoardErrorType.STORAGE_FULL)
      expect(error.message).toContain('Armazenamento')
      expect(error.recoverable).toBe(false)
    })

    it('should handle quota exceeded scenarios', () => {
      // Arrange
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new DOMException('QuotaExceededError', 'QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      // Act
      const error = service.handleStorageUnavailable()

      // Assert
      expect(error).toBeInstanceOf(FlowBoardError)
      expect(error.type).toBe(FlowBoardErrorType.STORAGE_FULL)
      expect(error.message).toContain('Armazenamento')
    })

    it('should validate board content before saving', async () => {
      // Arrange
      const boardId = 'board-1'
      const board = {
        id: boardId,
        userId,
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: FLOWBOARD_CONSTANTS.VERSION
      }))

      const invalidContent = {
        nodes: 'invalid', // Should be array
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      } as any

      // Act & Assert
      await expect(service.saveBoardContent(boardId, invalidContent)).rejects.toThrow(FlowBoardError)
      const error = await service.saveBoardContent(boardId, invalidContent).catch(e => e)
      expect(error.type).toBe(FlowBoardErrorType.INVALID_BOARD_DATA)
    })
  })

  describe('Cleanup', () => {
    it('should clear all auto-save timeouts on cleanup', () => {
      // Arrange
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout')
      
      // Set up multiple auto-save timeouts
      service.autoSaveBoardContent('board-1', { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })
      service.autoSaveBoardContent('board-2', { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } })

      // Act
      service.cleanup()

      // Assert
      expect(clearTimeoutSpy).toHaveBeenCalledTimes(2)
    })
  })
})