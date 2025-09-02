import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { LocalStorageFlowBoardService } from '../../services/localStorage-flowboard-service'
import { FlowBoard, ReactFlowContent, FlowBoardError, FlowBoardErrorType } from '../../types/flowboard.types'

describe('Service Integration Tests', () => {
  let service: LocalStorageFlowBoardService
  let mockLocalStorage: any
  const userId = 'test-user-123'

  beforeEach(() => {
    // Mock localStorage
    mockLocalStorage = {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
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

  describe('Complete CRUD Workflow', () => {
    it('should handle complete board lifecycle: create, read, update, delete', async () => {
      // Start with empty storage
      mockLocalStorage.getItem.mockReturnValue(null)

      // 1. Create a board
      const boardName = 'Integration Test Board'
      const createdBoard = await service.createBoard(boardName)

      expect(createdBoard).toBeDefined()
      expect(createdBoard.name).toBe(boardName)
      expect(createdBoard.userId).toBe(userId)
      expect(createdBoard.content).toEqual({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      })
      expect(mockLocalStorage.setItem).toHaveBeenCalled()

      // Mock localStorage to return the created board
      const storageData = {
        boards: [createdBoard],
        lastModified: Date.now(),
        version: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storageData))

      // 2. Read boards
      const boards = await service.getBoards()
      expect(boards).toHaveLength(1)
      expect(boards[0].id).toBe(createdBoard.id)
      expect(boards[0].name).toBe(boardName)

      // 3. Update board name
      const updatedName = 'Updated Board Name'
      const updatedBoard = await service.updateBoard(createdBoard.id, { name: updatedName })
      
      expect(updatedBoard.name).toBe(updatedName)
      expect(updatedBoard.id).toBe(createdBoard.id)
      expect(updatedBoard.updatedAt.getTime()).toBeGreaterThan(createdBoard.updatedAt.getTime())

      // 4. Update board content
      const newContent: ReactFlowContent = {
        nodes: [
          {
            id: 'node-1',
            type: 'text',
            position: { x: 100, y: 100 },
            data: { content: 'Test content' }
          }
        ],
        edges: [],
        viewport: { x: 10, y: 20, zoom: 1.5 }
      }

      await service.saveBoardContent(createdBoard.id, newContent)
      expect(mockLocalStorage.setItem).toHaveBeenCalled()

      // Mock updated storage data
      const updatedStorageData = {
        boards: [{
          ...updatedBoard,
          name: updatedName,
          content: newContent,
          updatedAt: new Date()
        }],
        lastModified: Date.now(),
        version: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(updatedStorageData))

      // Verify content was saved
      const boardWithContent = await service.getBoardById!(createdBoard.id)
      expect(boardWithContent).toBeDefined()
      expect(boardWithContent!.content.nodes).toHaveLength(1)
      expect(boardWithContent!.content.nodes[0].data.content).toBe('Test content')
      expect(boardWithContent!.content.viewport).toEqual({ x: 10, y: 20, zoom: 1.5 })

      // 5. Delete board
      await service.deleteBoard(createdBoard.id)
      expect(mockLocalStorage.setItem).toHaveBeenCalled()

      // Mock empty storage after deletion
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Verify board was deleted
      const boardsAfterDeletion = await service.getBoards()
      expect(boardsAfterDeletion).toHaveLength(0)

      const deletedBoard = await service.getBoardById!(createdBoard.id)
      expect(deletedBoard).toBeNull()
    })

    it('should handle multiple boards with different users', async () => {
      const otherUserId = 'other-user-456'
      const otherService = new LocalStorageFlowBoardService(otherUserId)

      // Create boards for different users
      const user1Board = await service.createBoard('User 1 Board')
      const user2Board = await otherService.createBoard('User 2 Board')

      // Mock storage with both boards
      const storageData = {
        boards: [user1Board, user2Board],
        lastModified: Date.now(),
        version: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storageData))

      // Each service should only see their own boards
      const user1Boards = await service.getBoards()
      const user2Boards = await otherService.getBoards()

      expect(user1Boards).toHaveLength(1)
      expect(user1Boards[0].userId).toBe(userId)
      expect(user1Boards[0].name).toBe('User 1 Board')

      expect(user2Boards).toHaveLength(1)
      expect(user2Boards[0].userId).toBe(otherUserId)
      expect(user2Boards[0].name).toBe('User 2 Board')

      // User 1 should not be able to access User 2's board
      const user2BoardFromUser1 = await service.getBoardById!(user2Board.id)
      expect(user2BoardFromUser1).toBeNull()

      otherService.cleanup()
    })
  })

  describe('Auto-save Integration', () => {
    it('should handle auto-save with debouncing correctly', async () => {
      vi.useFakeTimers()

      // Create a board first
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      const board = await service.createBoard('Auto-save Test Board')
      
      // Mock storage with the created board
      const storageData = {
        boards: [board],
        lastModified: Date.now(),
        version: '1.0.0'
      }
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(storageData))

      // Clear previous setItem calls
      mockLocalStorage.setItem.mockClear()

      const content1: ReactFlowContent = {
        nodes: [{ id: 'node-1', type: 'text', position: { x: 0, y: 0 }, data: { content: 'First' } }],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      const content2: ReactFlowContent = {
        nodes: [{ id: 'node-1', type: 'text', position: { x: 0, y: 0 }, data: { content: 'Second' } }],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      const content3: ReactFlowContent = {
        nodes: [{ id: 'node-1', type: 'text', position: { x: 0, y: 0 }, data: { content: 'Third' } }],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      // Trigger multiple auto-saves rapidly
      service.autoSaveBoardContent(board.id, content1)
      service.autoSaveBoardContent(board.id, content2)
      service.autoSaveBoardContent(board.id, content3)

      // Should not have saved yet (debounced)
      expect(mockLocalStorage.setItem).not.toHaveBeenCalled()

      // Fast-forward time to trigger auto-save
      vi.advanceTimersByTime(2000)

      // Should have saved only once (debounced)
      await vi.runAllTimersAsync()
      expect(mockLocalStorage.setItem).toHaveBeenCalledTimes(1)

      vi.useRealTimers()
    })

    it('should handle auto-save errors gracefully', async () => {
      vi.useFakeTimers()

      // Create a board
      const board = await service.createBoard('Error Test Board')
      
      // Mock storage error
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})

      const content: ReactFlowContent = {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      // Trigger auto-save
      service.autoSaveBoardContent(board.id, content)

      // Fast-forward time
      vi.advanceTimersByTime(2000)

      // Should log error but not throw
      await vi.runAllTimersAsync()
      expect(consoleSpy).toHaveBeenCalledWith('Auto-save failed:', expect.any(Error))

      consoleSpy.mockRestore()
      vi.useRealTimers()
    })
  })

  describe('Storage Management Integration', () => {
    it('should handle storage quota and cleanup workflow', async () => {
      // Create multiple boards
      const boards: FlowBoard[] = []
      for (let i = 0; i < 8; i++) {
        const board = await service.createBoard(`Board ${i}`)
        // Set different update times
        board.updatedAt = new Date(Date.now() - (8 - i) * 24 * 60 * 60 * 1000) // i days ago
        boards.push(board)
      }

      // Mock storage with all boards
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards,
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Mock storage info to indicate near limit
      const originalGetStorageInfo = service.getStorageInfo
      service.getStorageInfo = vi.fn()
        .mockReturnValueOnce({ 
          percentage: 85, 
          isNearLimit: true,
          used: 4 * 1024 * 1024,
          available: 1 * 1024 * 1024,
          isAtLimit: false,
          estimatedBoardsRemaining: 2
        })
        .mockReturnValueOnce({ 
          percentage: 65, 
          isNearLimit: false,
          used: 3 * 1024 * 1024,
          available: 2 * 1024 * 1024,
          isAtLimit: false,
          estimatedBoardsRemaining: 5
        })

      // Perform cleanup
      const cleanupResult = await service.cleanupStorage()

      expect(cleanupResult.deletedBoards).toBeGreaterThan(0)
      expect(cleanupResult.freedSpace).toBeGreaterThan(0)
      expect(cleanupResult.newStorageInfo.percentage).toBeLessThan(85)

      // Restore original method
      service.getStorageInfo = originalGetStorageInfo
    })

    it('should validate storage health and provide recommendations', () => {
      // Test healthy storage
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      let health = service.validateStorageHealth()
      expect(health.isHealthy).toBe(true)
      expect(health.issues).toHaveLength(0)
      expect(health.recommendations).toHaveLength(0)

      // Test storage unavailable
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new Error('Storage error')
      })

      health = service.validateStorageHealth()
      expect(health.isHealthy).toBe(false)
      expect(health.issues.length).toBeGreaterThan(0)
      expect(health.recommendations.length).toBeGreaterThan(0)
    })
  })

  describe('Data Recovery Integration', () => {
    it('should recover from various data corruption scenarios', async () => {
      // Test corrupted board data
      const corruptedData = {
        boards: [
          {
            id: 'board-1',
            userId,
            name: 'Valid Board',
            content: {
              nodes: [
                {
                  id: 'node-1',
                  type: 'text',
                  position: { x: 100, y: 100 },
                  data: { content: 'Valid node' }
                },
                null, // Invalid node
                {
                  id: 'node-2',
                  // Missing type and position
                  data: { content: 'Invalid node' }
                },
                {
                  id: 'node-3',
                  type: 'text',
                  position: { x: 'invalid', y: 200 }, // Invalid position
                  data: { content: 'Another invalid node' }
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
                  id: 'edge-2'
                  // Missing source and target
                }
              ],
              viewport: { x: 'invalid', y: 20, zoom: -1 } // Invalid viewport
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          },
          null, // Invalid board
          {
            id: 'board-2',
            userId,
            name: 'Another Board',
            content: 'invalid content', // Invalid content
            createdAt: '2024-01-02T00:00:00.000Z',
            updatedAt: '2024-01-02T00:00:00.000Z'
          }
        ],
        lastModified: Date.now(),
        version: '1.0.0'
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(corruptedData))

      // Should recover valid data and handle corrupted data gracefully
      const boards = await service.getBoards()
      expect(boards).toHaveLength(2) // Both boards should be recovered

      // Check first board recovery
      const board1 = await service.getBoardById!('board-1')
      expect(board1).toBeDefined()
      expect(board1!.content.nodes).toHaveLength(1) // Only valid node should remain
      expect(board1!.content.nodes[0].id).toBe('node-1')
      expect(board1!.content.edges).toHaveLength(1) // Only valid edge should remain
      expect(board1!.content.viewport).toEqual({ x: 0, y: 20, zoom: 1 }) // Corrected viewport

      // Check second board recovery
      const board2 = await service.getBoardById!('board-2')
      expect(board2).toBeDefined()
      expect(board2!.content).toEqual({
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }) // Default content for invalid content
    })

    it('should handle version migration scenarios', async () => {
      // Simulate old version data
      const oldVersionData = {
        boards: [
          {
            id: 'board-1',
            userId,
            name: 'Old Version Board',
            content: {
              nodes: [],
              edges: [],
              viewport: { x: 0, y: 0, zoom: 1 }
            },
            createdAt: '2024-01-01T00:00:00.000Z',
            updatedAt: '2024-01-01T00:00:00.000Z'
          }
        ],
        lastModified: Date.now(),
        version: '0.9.0' // Old version
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify(oldVersionData))

      // Should handle version migration
      const boards = await service.getBoards()
      
      // For now, migration returns empty data, but should not crash
      expect(boards).toBeDefined()
      expect(Array.isArray(boards)).toBe(true)
    })
  })

  describe('Error Handling Integration', () => {
    it('should handle various localStorage error scenarios', async () => {
      // Test SecurityError (private mode)
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new DOMException('SecurityError', 'SecurityError')
        error.name = 'SecurityError'
        throw error
      })

      await expect(service.createBoard('Test Board')).rejects.toThrow(FlowBoardError)
      
      try {
        await service.createBoard('Test Board')
      } catch (error) {
        expect(error).toBeInstanceOf(FlowBoardError)
        expect((error as FlowBoardError).type).toBe(FlowBoardErrorType.STORAGE_FULL)
        expect((error as FlowBoardError).recoverable).toBe(false)
      }

      // Test QuotaExceededError
      mockLocalStorage.setItem.mockImplementation(() => {
        const error = new DOMException('QuotaExceededError', 'QuotaExceededError')
        error.name = 'QuotaExceededError'
        throw error
      })

      await expect(service.createBoard('Test Board')).rejects.toThrow(FlowBoardError)
    })

    it('should handle board limit enforcement across operations', async () => {
      // Create 10 boards (at limit)
      const boards = Array.from({ length: 10 }, (_, i) => ({
        id: `board-${i}`,
        userId,
        name: `Board ${i}`,
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards,
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Should reject creating 11th board
      await expect(service.createBoard('11th Board')).rejects.toThrow(FlowBoardError)
      
      try {
        await service.createBoard('11th Board')
      } catch (error) {
        expect(error).toBeInstanceOf(FlowBoardError)
        expect((error as FlowBoardError).type).toBe(FlowBoardErrorType.BOARD_LIMIT_EXCEEDED)
        expect((error as FlowBoardError).recoverable).toBe(false)
      }
    })

    it('should handle concurrent operations safely', async () => {
      // Start with empty storage
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Simulate concurrent board creation
      const promises = [
        service.createBoard('Board 1'),
        service.createBoard('Board 2'),
        service.createBoard('Board 3')
      ]

      // All should succeed (though in real localStorage, there might be race conditions)
      const results = await Promise.allSettled(promises)
      
      // At least some should succeed
      const successful = results.filter(result => result.status === 'fulfilled')
      expect(successful.length).toBeGreaterThan(0)
    })
  })

  describe('Performance Integration', () => {
    it('should handle large datasets efficiently', async () => {
      // Create a board with many nodes
      const largeContent: ReactFlowContent = {
        nodes: Array.from({ length: 100 }, (_, i) => ({
          id: `node-${i}`,
          type: 'text' as const,
          position: { x: (i % 10) * 100, y: Math.floor(i / 10) * 100 },
          data: { content: `Node ${i} content` }
        })),
        edges: Array.from({ length: 50 }, (_, i) => ({
          id: `edge-${i}`,
          source: `node-${i}`,
          target: `node-${i + 1}`,
          type: 'default'
        })),
        viewport: { x: 0, y: 0, zoom: 1 }
      }

      const board = await service.createBoard('Large Board')
      
      // Mock storage with the board
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Should handle large content efficiently
      const startTime = Date.now()
      await service.saveBoardContent(board.id, largeContent)
      const endTime = Date.now()

      // Should complete within reasonable time (adjust threshold as needed)
      expect(endTime - startTime).toBeLessThan(1000) // 1 second

      // Verify content was saved
      expect(mockLocalStorage.setItem).toHaveBeenCalled()
    })

    it('should handle rapid successive operations', async () => {
      const board = await service.createBoard('Rapid Test Board')
      
      // Mock storage with the board
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [board],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Perform rapid updates
      const updates = Array.from({ length: 10 }, (_, i) => 
        service.updateBoard(board.id, { name: `Updated Name ${i}` })
      )

      // All updates should complete
      const results = await Promise.allSettled(updates)
      const successful = results.filter(result => result.status === 'fulfilled')
      
      expect(successful.length).toBe(10)
    })
  })
})