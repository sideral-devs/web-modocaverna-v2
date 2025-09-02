import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { LocalStorageFlowBoardService } from '../services/localStorage-flowboard-service'
import { FlowBoard, FlowBoardError, FlowBoardErrorType } from '../types/flowboard.types'

describe('FlowBoard Simple Integration Tests', () => {
  let service: LocalStorageFlowBoardService
  let mockLocalStorage: any
  const userId = 'test-user'

  beforeEach(() => {
    // Create a proper localStorage mock
    mockLocalStorage = {
      data: {} as Record<string, string>,
      getItem: vi.fn((key: string) => mockLocalStorage.data[key] || null),
      setItem: vi.fn((key: string, value: string) => {
        mockLocalStorage.data[key] = value
      }),
      removeItem: vi.fn((key: string) => {
        delete mockLocalStorage.data[key]
      }),
      clear: vi.fn(() => {
        mockLocalStorage.data = {}
      }),
    }

    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    })

    service = new LocalStorageFlowBoardService(userId)
    vi.clearAllMocks()
  })

  afterEach(() => {
    service.cleanup()
  })

  describe('Basic CRUD Operations', () => {
    it('should create and retrieve a board', async () => {
      // Create a board
      const boardName = 'Test Board'
      const board = await service.createBoard(boardName)

      expect(board.name).toBe(boardName)
      expect(board.userId).toBe(userId)
      expect(board.id).toBeDefined()

      // Retrieve boards
      const boards = await service.getBoards()
      expect(boards).toHaveLength(1)
      expect(boards[0].id).toBe(board.id)
    })

    it('should update a board', async () => {
      // Create a board
      const board = await service.createBoard('Original Name')
      
      // Update the board
      const updatedBoard = await service.updateBoard(board.id, { name: 'Updated Name' })
      
      expect(updatedBoard.name).toBe('Updated Name')
      expect(updatedBoard.id).toBe(board.id)
    })

    it('should delete a board', async () => {
      // Create a board
      const board = await service.createBoard('Test Board')
      
      // Verify it exists
      let boards = await service.getBoards()
      expect(boards).toHaveLength(1)
      
      // Delete the board
      await service.deleteBoard(board.id)
      
      // Verify it's gone
      boards = await service.getBoards()
      expect(boards).toHaveLength(0)
    })
  })

  describe('Board Limits', () => {
    it('should enforce board limit', async () => {
      // Create 10 boards (the limit)
      for (let i = 0; i < 10; i++) {
        await service.createBoard(`Board ${i}`)
      }

      // Try to create an 11th board
      await expect(service.createBoard('Board 11')).rejects.toThrow(FlowBoardError)
    })
  })

  describe('Data Persistence', () => {
    it('should persist data across service instances', async () => {
      // Create a board with first service instance
      const board = await service.createBoard('Persistent Board')
      
      // Create a new service instance
      const newService = new LocalStorageFlowBoardService(userId)
      
      // Should be able to retrieve the board
      const boards = await newService.getBoards()
      expect(boards).toHaveLength(1)
      expect(boards[0].name).toBe('Persistent Board')
      
      newService.cleanup()
    })

    it('should handle empty localStorage', async () => {
      // Clear localStorage
      mockLocalStorage.clear()
      
      // Should return empty array
      const boards = await service.getBoards()
      expect(boards).toEqual([])
    })
  })

  describe('Error Handling', () => {
    it('should handle invalid board names', async () => {
      await expect(service.createBoard('')).rejects.toThrow(FlowBoardError)
      await expect(service.createBoard('a'.repeat(256))).rejects.toThrow(FlowBoardError)
    })

    it('should handle non-existent board operations', async () => {
      await expect(service.updateBoard('non-existent', { name: 'New Name' })).rejects.toThrow(FlowBoardError)
      await expect(service.deleteBoard('non-existent')).rejects.toThrow(FlowBoardError)
    })
  })

  describe('Board Content', () => {
    it('should save and retrieve board content', async () => {
      // Create a board
      const board = await service.createBoard('Content Board')
      
      // Add content
      const content = {
        nodes: [{
          id: 'node-1',
          type: 'text' as const,
          position: { x: 100, y: 100 },
          data: { content: 'Test content' }
        }],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }
      
      await service.saveBoardContent(board.id, content)
      
      // Retrieve and verify
      const retrievedBoard = await service.getBoardById!(board.id)
      expect(retrievedBoard).toBeDefined()
      expect(retrievedBoard!.content.nodes).toHaveLength(1)
      expect(retrievedBoard!.content.nodes[0].data.content).toBe('Test content')
    })
  })

  describe('Auto-save', () => {
    it('should debounce auto-save calls', async () => {
      vi.useFakeTimers()
      
      const board = await service.createBoard('Auto-save Board')
      const content = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }
      
      // Clear previous setItem calls
      mockLocalStorage.setItem.mockClear()
      
      // Trigger multiple auto-saves
      service.autoSaveBoardContent(board.id, content)
      service.autoSaveBoardContent(board.id, content)
      service.autoSaveBoardContent(board.id, content)
      
      // Should not have saved yet
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()
      
      // Advance time
      vi.advanceTimersByTime(2000)
      
      // Should have saved once
      await vi.runAllTimersAsync()
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1)
      
      vi.useRealTimers()
    })
  })

  describe('Storage Management', () => {
    it('should provide storage information', () => {
      const storageInfo = service.getStorageInfo()
      
      expect(storageInfo).toHaveProperty('used')
      expect(storageInfo).toHaveProperty('available')
      expect(storageInfo).toHaveProperty('percentage')
      expect(storageInfo).toHaveProperty('isNearLimit')
      expect(storageInfo).toHaveProperty('isAtLimit')
      expect(storageInfo).toHaveProperty('estimatedBoardsRemaining')
    })

    it('should validate storage health', () => {
      const health = service.validateStorageHealth()
      
      expect(health).toHaveProperty('isHealthy')
      expect(health).toHaveProperty('issues')
      expect(health).toHaveProperty('recommendations')
      expect(Array.isArray(health.issues)).toBe(true)
      expect(Array.isArray(health.recommendations)).toBe(true)
    })
  })

  describe('User Isolation', () => {
    it('should isolate boards by user', async () => {
      const user1Service = new LocalStorageFlowBoardService('user1')
      const user2Service = new LocalStorageFlowBoardService('user2')
      
      // Create boards for different users
      await user1Service.createBoard('User 1 Board')
      await user2Service.createBoard('User 2 Board')
      
      // Each user should only see their own boards
      const user1Boards = await user1Service.getBoards()
      const user2Boards = await user2Service.getBoards()
      
      expect(user1Boards).toHaveLength(1)
      expect(user1Boards[0].name).toBe('User 1 Board')
      
      expect(user2Boards).toHaveLength(1)
      expect(user2Boards[0].name).toBe('User 2 Board')
      
      user1Service.cleanup()
      user2Service.cleanup()
    })
  })
})