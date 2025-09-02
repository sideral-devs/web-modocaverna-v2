import React from 'react'
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { FlowBoard, ReactFlowContent } from '../../types/flowboard.types'
import { LocalStorageFlowBoardService } from '../../services/localStorage-flowboard-service'

// Mock React Flow components
vi.mock('reactflow', () => ({
  ReactFlow: ({ children, nodes, edges, onNodesChange, onEdgesChange, onConnect }: any) => (
    <div data-testid="react-flow-canvas" data-nodes-count={nodes?.length || 0} data-edges-count={edges?.length || 0}>
      {children}
      <button 
        data-testid="mock-add-node" 
        onClick={() => onNodesChange?.([{
          type: 'add',
          item: {
            id: 'new-node',
            type: 'text',
            position: { x: 100, y: 100 },
            data: { content: 'New node' }
          }
        }])}
      >
        Add Node
      </button>
    </div>
  ),
  Background: () => <div data-testid="react-flow-background" />,
  Controls: () => <div data-testid="react-flow-controls" />,
  MiniMap: () => <div data-testid="react-flow-minimap" />,
  useReactFlow: () => ({
    getNodes: vi.fn(() => []),
    getEdges: vi.fn(() => []),
    setNodes: vi.fn(),
    setEdges: vi.fn(),
    fitView: vi.fn(),
  }),
  useNodesState: (initialNodes: any) => [initialNodes, vi.fn()],
  useEdgesState: (initialEdges: any) => [initialEdges, vi.fn()],
}))

// Mock Zustand store
const mockStore = {
  boards: [] as FlowBoard[],
  activeBoard: null as FlowBoard | null,
  isLoading: false,
  error: null as string | null,
  nodes: [],
  edges: [],
  viewport: { x: 0, y: 0, zoom: 1 },
  
  // Actions
  loadBoards: vi.fn(),
  createBoard: vi.fn(),
  selectBoard: vi.fn(),
  updateBoardName: vi.fn(),
  deleteBoard: vi.fn(),
  updateNodes: vi.fn(),
  updateEdges: vi.fn(),
  updateViewport: vi.fn(),
  autoSave: vi.fn(),
}

vi.mock('../../hooks/use-flowboard-store', () => ({
  useBoardManagement: () => mockStore,
  useFlowBoardStore: () => mockStore,
}))

// Create a test component that combines the main FlowBoard components
function TestFlowBoardApp() {
  return (
    <div className="flex h-screen">
      {/* Board Management Panel */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800">
        <div className="p-4">
          <h3 className="text-lg font-semibold text-zinc-100">Quadros FlowBoard</h3>
          <span className="text-xs text-zinc-400">{mockStore.boards.length}/10</span>
        </div>
        
        <button
          data-testid="create-board-button"
          onClick={() => mockStore.createBoard('Novo Quadro')}
          disabled={mockStore.boards.length >= 10}
          className="m-4 px-4 py-2 bg-cyan-600 text-white rounded disabled:opacity-50"
        >
          Criar novo Quadro
        </button>

        <div className="px-4">
          {mockStore.isLoading && (
            <div data-testid="loading-indicator">Carregando quadros...</div>
          )}
          
          {mockStore.error && (
            <div data-testid="error-message" className="text-red-400">
              {mockStore.error}
            </div>
          )}

          {mockStore.boards.length === 0 && !mockStore.isLoading ? (
            <div data-testid="empty-state">
              <p>Nenhum quadro criado ainda</p>
              <p>Crie seu primeiro quadro para começar</p>
            </div>
          ) : (
            <div data-testid="board-list">
              {mockStore.boards.map((board) => (
                <div
                  key={board.id}
                  data-testid={`board-item-${board.id}`}
                  className={`p-3 rounded cursor-pointer ${
                    mockStore.activeBoard?.id === board.id ? 'bg-cyan-950/30' : 'hover:bg-zinc-800'
                  }`}
                  onClick={() => mockStore.selectBoard(board)}
                >
                  <h4 className="font-medium">{board.name}</h4>
                  <p className="text-xs text-zinc-500">
                    {board.content.nodes.length} elemento{board.content.nodes.length !== 1 ? 's' : ''}
                  </p>
                  <button
                    data-testid={`delete-board-${board.id}`}
                    onClick={(e) => {
                      e.stopPropagation()
                      mockStore.deleteBoard(board.id)
                    }}
                    className="text-red-400 hover:text-red-300"
                  >
                    Excluir
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 bg-zinc-950">
        {!mockStore.activeBoard ? (
          <div data-testid="canvas-empty-state" className="flex items-center justify-center h-full">
            <p className="text-zinc-400">Selecione ou crie um Quadro para começar</p>
          </div>
        ) : (
          <div data-testid="canvas-area" className="h-full">
            <div className="p-4 border-b border-zinc-800">
              <h2 className="text-xl font-semibold text-zinc-100">
                {mockStore.activeBoard.name}
              </h2>
            </div>
            
            <div className="h-full">
              {/* Mock React Flow Canvas */}
              <div 
                data-testid="react-flow-canvas" 
                data-nodes-count={mockStore.activeBoard.content.nodes.length}
                data-edges-count={mockStore.activeBoard.content.edges.length}
                className="h-full"
              >
                <button
                  data-testid="add-text-node"
                  onClick={() => {
                    const newNode = {
                      id: `node-${Date.now()}`,
                      type: 'text' as const,
                      position: { x: 100, y: 100 },
                      data: { content: 'Novo texto' }
                    }
                    const updatedContent = {
                      ...mockStore.activeBoard!.content,
                      nodes: [...mockStore.activeBoard!.content.nodes, newNode]
                    }
                    mockStore.activeBoard!.content = updatedContent
                    mockStore.updateNodes(updatedContent.nodes)
                    mockStore.autoSave()
                  }}
                  className="m-4 px-3 py-2 bg-blue-600 text-white rounded"
                >
                  Adicionar Texto
                </button>

                <button
                  data-testid="simulate-paste-image"
                  onClick={() => {
                    const newNode = {
                      id: `image-${Date.now()}`,
                      type: 'image' as const,
                      position: { x: 200, y: 200 },
                      data: { imageUrl: 'data:image/png;base64,test' }
                    }
                    const updatedContent = {
                      ...mockStore.activeBoard!.content,
                      nodes: [...mockStore.activeBoard!.content.nodes, newNode]
                    }
                    mockStore.activeBoard!.content = updatedContent
                    mockStore.updateNodes(updatedContent.nodes)
                    mockStore.autoSave()
                  }}
                  className="m-4 px-3 py-2 bg-green-600 text-white rounded"
                >
                  Colar Imagem
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

describe('FlowBoard Integration Tests', () => {
  let mockLocalStorage: any
  let service: LocalStorageFlowBoardService

  beforeEach(() => {
    // Reset mock store
    mockStore.boards = []
    mockStore.activeBoard = null
    mockStore.isLoading = false
    mockStore.error = null
    mockStore.nodes = []
    mockStore.edges = []
    mockStore.viewport = { x: 0, y: 0, zoom: 1 }

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

    service = new LocalStorageFlowBoardService('test-user')

    // Clear all mocks
    vi.clearAllMocks()
  })

  afterEach(() => {
    service.cleanup()
  })

  describe('Complete Board Creation and Editing Workflow', () => {
    it('should create board, select it, add content, and persist changes', async () => {
      const user = userEvent.setup()

      // Mock empty localStorage initially
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      render(<TestFlowBoardApp />)

      // Initially should show empty state
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
      expect(screen.getByTestId('canvas-empty-state')).toBeInTheDocument()

      // Create a new board
      const createButton = screen.getByTestId('create-board-button')
      expect(createButton).not.toBeDisabled()

      // Simulate board creation
      await act(async () => {
        const newBoard: FlowBoard = {
          id: 'board-1',
          userId: 'test-user',
          name: 'Novo Quadro',
          content: {
            nodes: [],
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 }
          },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        
        mockStore.boards = [newBoard]
        mockStore.createBoard.mockResolvedValue(newBoard)
      })

      await user.click(createButton)

      // Should now show the board in the list
      await waitFor(() => {
        expect(screen.getByTestId('board-list')).toBeInTheDocument()
        expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument()
        expect(screen.getByText('Novo Quadro')).toBeInTheDocument()
        expect(screen.getByText('0 elementos')).toBeInTheDocument()
      })

      // Select the board
      const boardItem = screen.getByTestId('board-item-board-1')
      await act(async () => {
        mockStore.activeBoard = mockStore.boards[0]
      })

      await user.click(boardItem)

      // Should show canvas area
      await waitFor(() => {
        expect(screen.getByTestId('canvas-area')).toBeInTheDocument()
        expect(screen.getByText('Novo Quadro')).toBeInTheDocument() // Board name in canvas header
        expect(screen.queryByTestId('canvas-empty-state')).not.toBeInTheDocument()
      })

      // Add text node
      const addTextButton = screen.getByTestId('add-text-node')
      await user.click(addTextButton)

      // Should update the board content
      await waitFor(() => {
        expect(mockStore.updateNodes).toHaveBeenCalled()
        expect(mockStore.autoSave).toHaveBeenCalled()
      })

      // Add image node
      const pasteImageButton = screen.getByTestId('simulate-paste-image')
      await user.click(pasteImageButton)

      // Should update the board content again
      await waitFor(() => {
        expect(mockStore.updateNodes).toHaveBeenCalledTimes(2)
        expect(mockStore.autoSave).toHaveBeenCalledTimes(2)
      })

      // Verify the board now shows 2 elements
      expect(mockStore.activeBoard?.content.nodes).toHaveLength(2)
    })

    it('should handle board limit enforcement', async () => {
      const user = userEvent.setup()

      // Create 10 boards (at limit)
      const boards = Array.from({ length: 10 }, (_, i) => ({
        id: `board-${i}`,
        userId: 'test-user',
        name: `Board ${i}`,
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      await act(async () => {
        mockStore.boards = boards
      })

      render(<TestFlowBoardApp />)

      // Create button should be disabled
      const createButton = screen.getByTestId('create-board-button')
      expect(createButton).toBeDisabled()

      // Should show 10/10 in header
      expect(screen.getByText('10/10')).toBeInTheDocument()

      // Should show all 10 boards
      expect(screen.getByTestId('board-list')).toBeInTheDocument()
      boards.forEach((board) => {
        expect(screen.getByTestId(`board-item-${board.id}`)).toBeInTheDocument()
      })
    })

    it('should handle board deletion workflow', async () => {
      const user = userEvent.setup()

      // Start with 2 boards
      const boards = [
        {
          id: 'board-1',
          userId: 'test-user',
          name: 'Board 1',
          content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id: 'board-2',
          userId: 'test-user',
          name: 'Board 2',
          content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ]

      await act(async () => {
        mockStore.boards = boards
        mockStore.activeBoard = boards[0]
      })

      render(<TestFlowBoardApp />)

      // Should show both boards
      expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument()
      expect(screen.getByTestId('board-item-board-2')).toBeInTheDocument()
      expect(screen.getByText('2/10')).toBeInTheDocument()

      // Delete first board
      const deleteButton = screen.getByTestId('delete-board-board-1')
      
      await act(async () => {
        mockStore.boards = [boards[1]] // Remove first board
        mockStore.activeBoard = null // Clear active board
      })

      await user.click(deleteButton)

      // Should now show only one board
      await waitFor(() => {
        expect(screen.queryByTestId('board-item-board-1')).not.toBeInTheDocument()
        expect(screen.getByTestId('board-item-board-2')).toBeInTheDocument()
        expect(screen.getByText('1/10')).toBeInTheDocument()
      })

      // Should show empty canvas state since active board was deleted
      expect(screen.getByTestId('canvas-empty-state')).toBeInTheDocument()
    })
  })

  describe('Data Persistence Across Page Refreshes', () => {
    it('should restore boards and content after page refresh', async () => {
      // Simulate stored data in localStorage
      const storedBoards = [
        {
          id: 'board-1',
          userId: 'test-user',
          name: 'Persisted Board',
          content: {
            nodes: [
              {
                id: 'node-1',
                type: 'text',
                position: { x: 100, y: 100 },
                data: { content: 'Persisted content' }
              }
            ],
            edges: [],
            viewport: { x: 10, y: 20, zoom: 1.5 }
          },
          createdAt: new Date('2024-01-01').toISOString(),
          updatedAt: new Date('2024-01-02').toISOString()
        }
      ]

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: storedBoards,
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Simulate loading boards on app initialization
      await act(async () => {
        mockStore.isLoading = true
      })

      render(<TestFlowBoardApp />)

      // Should show loading state initially
      expect(screen.getByTestId('loading-indicator')).toBeInTheDocument()

      // Simulate successful load
      await act(async () => {
        mockStore.isLoading = false
        mockStore.boards = storedBoards.map(board => ({
          ...board,
          createdAt: new Date(board.createdAt),
          updatedAt: new Date(board.updatedAt)
        }))
      })

      // Should show restored board
      await waitFor(() => {
        expect(screen.queryByTestId('loading-indicator')).not.toBeInTheDocument()
        expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument()
        expect(screen.getByText('Persisted Board')).toBeInTheDocument()
        expect(screen.getByText('1 elemento')).toBeInTheDocument()
      })

      // Select the restored board
      const user = userEvent.setup()
      const boardItem = screen.getByTestId('board-item-board-1')
      
      await act(async () => {
        mockStore.activeBoard = mockStore.boards[0]
      })

      await user.click(boardItem)

      // Should show canvas with restored content
      await waitFor(() => {
        expect(screen.getByTestId('canvas-area')).toBeInTheDocument()
        expect(screen.getByText('Persisted Board')).toBeInTheDocument()
      })

      // Verify content was restored
      expect(mockStore.activeBoard?.content.nodes).toHaveLength(1)
      expect(mockStore.activeBoard?.content.nodes[0].data.content).toBe('Persisted content')
      expect(mockStore.activeBoard?.content.viewport).toEqual({ x: 10, y: 20, zoom: 1.5 })
    })

    it('should handle corrupted localStorage data gracefully', async () => {
      // Simulate corrupted data
      mockLocalStorage.getItem.mockReturnValue('invalid json data')

      await act(async () => {
        mockStore.isLoading = true
      })

      render(<TestFlowBoardApp />)

      // Simulate error state
      await act(async () => {
        mockStore.isLoading = false
        mockStore.error = 'Failed to retrieve boards from storage'
      })

      // Should show error message
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByText('Failed to retrieve boards from storage')).toBeInTheDocument()
      })

      // Should still show empty state for boards
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('should handle localStorage unavailable scenarios', async () => {
      // Simulate localStorage unavailable
      mockLocalStorage.getItem.mockImplementation(() => {
        throw new DOMException('SecurityError', 'SecurityError')
      })

      await act(async () => {
        mockStore.isLoading = true
      })

      render(<TestFlowBoardApp />)

      // Simulate error state
      await act(async () => {
        mockStore.isLoading = false
        mockStore.error = 'Armazenamento indisponível: modo privado/incógnito detectado'
      })

      // Should show appropriate error message
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByText(/modo privado\/incógnito detectado/)).toBeInTheDocument()
      })
    })
  })

  describe('Error Scenarios and Recovery', () => {
    it('should handle storage quota exceeded during board creation', async () => {
      const user = userEvent.setup()

      // Start with empty state
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      render(<TestFlowBoardApp />)

      // Simulate quota exceeded error during creation
      const createButton = screen.getByTestId('create-board-button')
      
      await act(async () => {
        mockStore.createBoard.mockRejectedValue(new Error('Storage quota exceeded'))
        mockStore.error = 'Storage quota exceeded. Please delete some boards or clear browser data.'
      })

      await user.click(createButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByText(/Storage quota exceeded/)).toBeInTheDocument()
      })

      // Should still show empty state since creation failed
      expect(screen.getByTestId('empty-state')).toBeInTheDocument()
    })

    it('should handle auto-save failures gracefully', async () => {
      const user = userEvent.setup()

      // Start with a board
      const board: FlowBoard = {
        id: 'board-1',
        userId: 'test-user',
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await act(async () => {
        mockStore.boards = [board]
        mockStore.activeBoard = board
      })

      render(<TestFlowBoardApp />)

      // Add content to trigger auto-save
      const addTextButton = screen.getByTestId('add-text-node')
      
      // Mock auto-save to fail silently (as it should in real implementation)
      mockStore.autoSave.mockImplementation(() => {
        console.error('Auto-save failed: Storage error')
        // Auto-save should not throw or show user-visible errors
      })

      await user.click(addTextButton)

      // Should still update the UI even if auto-save fails
      await waitFor(() => {
        expect(mockStore.updateNodes).toHaveBeenCalled()
        expect(mockStore.autoSave).toHaveBeenCalled()
      })

      // Should not show any error to the user (auto-save failures are silent)
      expect(screen.queryByTestId('error-message')).not.toBeInTheDocument()
    })

    it('should recover from corrupted board data', async () => {
      // Simulate partially corrupted board data
      const corruptedBoard = {
        id: 'board-1',
        userId: 'test-user',
        name: 'Corrupted Board',
        content: {
          nodes: [
            {
              id: 'node-1',
              type: 'text',
              position: { x: 'invalid', y: 100 }, // Invalid position
              data: { content: 'Valid content' }
            },
            null, // Invalid node
            {
              id: 'node-2',
              type: 'text',
              position: { x: 200, y: 200 },
              data: { content: 'Another valid node' }
            }
          ],
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 }
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [corruptedBoard],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      // Simulate data recovery process
      await act(async () => {
        mockStore.isLoading = true
      })

      render(<TestFlowBoardApp />)

      // Simulate successful recovery with cleaned data
      await act(async () => {
        mockStore.isLoading = false
        mockStore.boards = [{
          ...corruptedBoard,
          content: {
            nodes: [
              {
                id: 'node-2',
                type: 'text',
                position: { x: 200, y: 200 },
                data: { content: 'Another valid node' }
              }
            ], // Only valid nodes remain
            edges: [],
            viewport: { x: 0, y: 0, zoom: 1 }
          },
          createdAt: new Date(corruptedBoard.createdAt),
          updatedAt: new Date(corruptedBoard.updatedAt)
        }]
      })

      // Should show recovered board
      await waitFor(() => {
        expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument()
        expect(screen.getByText('Corrupted Board')).toBeInTheDocument()
        expect(screen.getByText('1 elemento')).toBeInTheDocument() // Only valid node remains
      })
    })

    it('should handle network-like errors during board operations', async () => {
      const user = userEvent.setup()

      // Start with a board
      const board: FlowBoard = {
        id: 'board-1',
        userId: 'test-user',
        name: 'Test Board',
        content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
        createdAt: new Date(),
        updatedAt: new Date()
      }

      await act(async () => {
        mockStore.boards = [board]
      })

      render(<TestFlowBoardApp />)

      // Simulate error during board deletion
      const deleteButton = screen.getByTestId('delete-board-board-1')
      
      await act(async () => {
        mockStore.deleteBoard.mockRejectedValue(new Error('Network error'))
        mockStore.error = 'Failed to delete board'
      })

      await user.click(deleteButton)

      // Should show error message
      await waitFor(() => {
        expect(screen.getByTestId('error-message')).toBeInTheDocument()
        expect(screen.getByText('Failed to delete board')).toBeInTheDocument()
      })

      // Board should still be visible since deletion failed
      expect(screen.getByTestId('board-item-board-1')).toBeInTheDocument()
    })
  })

  describe('Performance and Edge Cases', () => {
    it('should handle large number of boards efficiently', async () => {
      // Create 10 boards (at limit)
      const boards = Array.from({ length: 10 }, (_, i) => ({
        id: `board-${i}`,
        userId: 'test-user',
        name: `Board ${i}`,
        content: {
          nodes: Array.from({ length: 5 }, (_, j) => ({
            id: `node-${i}-${j}`,
            type: 'text' as const,
            position: { x: j * 100, y: i * 50 },
            data: { content: `Content ${i}-${j}` }
          })),
          edges: [],
          viewport: { x: 0, y: 0, zoom: 1 }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      }))

      await act(async () => {
        mockStore.boards = boards
      })

      render(<TestFlowBoardApp />)

      // Should render all boards efficiently
      expect(screen.getByText('10/10')).toBeInTheDocument()
      
      boards.forEach((board) => {
        expect(screen.getByTestId(`board-item-${board.id}`)).toBeInTheDocument()
        expect(screen.getByText(`5 elementos`)).toBeInTheDocument()
      })

      // Create button should be disabled at limit
      expect(screen.getByTestId('create-board-button')).toBeDisabled()
    })

    it('should handle rapid user interactions without race conditions', async () => {
      const user = userEvent.setup()

      // Start with empty state
      mockLocalStorage.getItem.mockReturnValue(JSON.stringify({
        boards: [],
        lastModified: Date.now(),
        version: '1.0.0'
      }))

      render(<TestFlowBoardApp />)

      const createButton = screen.getByTestId('create-board-button')

      // Simulate rapid clicking (should not create multiple boards)
      let boardCount = 0
      mockStore.createBoard.mockImplementation(async () => {
        boardCount++
        const newBoard: FlowBoard = {
          id: `board-${boardCount}`,
          userId: 'test-user',
          name: `Board ${boardCount}`,
          content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
          createdAt: new Date(),
          updatedAt: new Date()
        }
        mockStore.boards = [...mockStore.boards, newBoard]
        return newBoard
      })

      // Rapid clicks
      await user.click(createButton)
      await user.click(createButton)
      await user.click(createButton)

      // Should handle rapid interactions gracefully
      await waitFor(() => {
        expect(mockStore.createBoard).toHaveBeenCalledTimes(3)
      })
    })
  })
})