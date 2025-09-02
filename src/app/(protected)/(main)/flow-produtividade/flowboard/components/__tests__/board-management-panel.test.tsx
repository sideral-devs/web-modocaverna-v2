import React from 'react'
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BoardManagementPanel } from '../board-management-panel'
import { FlowBoard } from '../../types/flowboard.types'

// Mock the hook
vi.mock('../../hooks/use-flowboard-store', () => ({
  useBoardManagement: vi.fn()
}))

// Mock child components
vi.mock('../create-board-button', () => ({
  CreateBoardButton: () => <button data-testid="create-board-button">Criar novo Quadro</button>
}))

vi.mock('../board-list', () => ({
  BoardList: () => <div data-testid="board-list">Board List</div>
}))

import { useBoardManagement } from '../../hooks/use-flowboard-store'

const mockUseBoardManagement = useBoardManagement as Mock

describe('BoardManagementPanel', () => {
  const mockBoards: FlowBoard[] = [
    {
      id: 'board-1',
      userId: 'user-1',
      name: 'Test Board 1',
      content: {
        nodes: [
          {
            id: 'node-1',
            type: 'text',
            position: { x: 0, y: 0 },
            data: { content: 'Test content' }
          }
        ],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      },
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-01-01')
    },
    {
      id: 'board-2',
      userId: 'user-1',
      name: 'Test Board 2',
      content: {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      },
      createdAt: new Date('2024-01-02'),
      updatedAt: new Date('2024-01-02')
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Rendering', () => {
    it('should render panel with title and board count', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('Quadros FlowBoard')).toBeInTheDocument()
      expect(screen.getByText('2/10')).toBeInTheDocument()
      expect(screen.getByTestId('create-board-button')).toBeInTheDocument()
    })

    it('should apply custom className', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      const { container } = render(<BoardManagementPanel className="custom-class" />)
      
      expect(container.firstChild).toHaveClass('custom-class')
    })

    it('should show correct board count in header', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards.slice(0, 1), // Only 1 board
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('1/10')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('should show loading spinner when loading', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: true,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('Carregando quadros...')).toBeInTheDocument()
      expect(screen.getByRole('status', { hidden: true })).toBeInTheDocument() // Loading spinner
    })

    it('should not show board list when loading', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: true,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.queryByTestId('board-list')).not.toBeInTheDocument()
    })
  })

  describe('Error State', () => {
    it('should display error message when error exists', () => {
      const errorMessage = 'Failed to load boards'
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: errorMessage
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByText(errorMessage)).toHaveClass('text-red-400')
    })

    it('should show error and boards together if both exist', () => {
      const errorMessage = 'Partial error'
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: errorMessage
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText(errorMessage)).toBeInTheDocument()
      expect(screen.getByTestId('board-list')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('should show empty state when no boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('Nenhum quadro criado ainda')).toBeInTheDocument()
      expect(screen.getByText('Crie seu primeiro quadro para começar')).toBeInTheDocument()
      expect(screen.queryByTestId('board-list')).not.toBeInTheDocument()
    })

    it('should show empty state icon', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      // Check for the document icon SVG
      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Board List State', () => {
    it('should show board list when boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByTestId('board-list')).toBeInTheDocument()
      expect(screen.queryByText('Nenhum quadro criado ainda')).not.toBeInTheDocument()
    })

    it('should not show empty state when boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.queryByText('Nenhum quadro criado ainda')).not.toBeInTheDocument()
      expect(screen.queryByText('Crie seu primeiro quadro para começar')).not.toBeInTheDocument()
    })
  })

  describe('Footer Information', () => {
    it('should show creation prompt when no boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('Crie quadros para organizar suas ideias')).toBeInTheDocument()
    })

    it('should show singular board count in footer', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards.slice(0, 1),
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('1 quadro criado')).toBeInTheDocument()
    })

    it('should show plural board count in footer', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByText('2 quadros criados')).toBeInTheDocument()
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive width classes', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      const { container } = render(<BoardManagementPanel />)
      const panel = container.firstChild as HTMLElement

      expect(panel).toHaveClass('w-80') // Base width
      expect(panel).toHaveClass('lg:w-80') // Large screens
      expect(panel).toHaveClass('md:w-72') // Medium screens
      expect(panel).toHaveClass('sm:w-64') // Small screens
      expect(panel).toHaveClass('max-sm:absolute') // Mobile overlay
    })

    it('should have mobile-specific classes', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      const { container } = render(<BoardManagementPanel />)
      const panel = container.firstChild as HTMLElement

      expect(panel).toHaveClass('max-sm:absolute')
      expect(panel).toHaveClass('max-sm:z-20')
      expect(panel).toHaveClass('max-sm:h-full')
    })
  })

  describe('Accessibility', () => {
    it('should have proper semantic structure', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      // Check for heading
      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('Quadros FlowBoard')
    })

    it('should have proper ARIA labels and roles', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      // The panel should be properly structured for screen readers
      const panel = screen.getByRole('generic') // div with proper structure
      expect(panel).toBeInTheDocument()
    })
  })

  describe('Integration with Child Components', () => {
    it('should render CreateBoardButton', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByTestId('create-board-button')).toBeInTheDocument()
    })

    it('should render BoardList when boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.getByTestId('board-list')).toBeInTheDocument()
    })

    it('should not render BoardList when no boards exist', () => {
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      render(<BoardManagementPanel />)

      expect(screen.queryByTestId('board-list')).not.toBeInTheDocument()
    })
  })

  describe('State Transitions', () => {
    it('should transition from loading to loaded state', async () => {
      // Start with loading state
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: true,
        error: null
      })

      const { rerender } = render(<BoardManagementPanel />)

      expect(screen.getByText('Carregando quadros...')).toBeInTheDocument()

      // Transition to loaded state
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      rerender(<BoardManagementPanel />)

      await waitFor(() => {
        expect(screen.queryByText('Carregando quadros...')).not.toBeInTheDocument()
        expect(screen.getByTestId('board-list')).toBeInTheDocument()
      })
    })

    it('should transition from empty to populated state', async () => {
      // Start with empty state
      mockUseBoardManagement.mockReturnValue({
        boards: [],
        isLoading: false,
        error: null
      })

      const { rerender } = render(<BoardManagementPanel />)

      expect(screen.getByText('Nenhum quadro criado ainda')).toBeInTheDocument()

      // Transition to populated state
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      rerender(<BoardManagementPanel />)

      await waitFor(() => {
        expect(screen.queryByText('Nenhum quadro criado ainda')).not.toBeInTheDocument()
        expect(screen.getByTestId('board-list')).toBeInTheDocument()
      })
    })

    it('should handle error state transitions', async () => {
      // Start with normal state
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: null
      })

      const { rerender } = render(<BoardManagementPanel />)

      expect(screen.getByTestId('board-list')).toBeInTheDocument()

      // Transition to error state
      const errorMessage = 'Network error'
      mockUseBoardManagement.mockReturnValue({
        boards: mockBoards,
        isLoading: false,
        error: errorMessage
      })

      rerender(<BoardManagementPanel />)

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument()
        expect(screen.getByTestId('board-list')).toBeInTheDocument() // Should still show boards
      })
    })
  })
})