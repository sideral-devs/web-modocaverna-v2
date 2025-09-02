import React from 'react'
import { describe, it, expect, beforeEach, vi, Mock } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BoardListItem } from '../board-list-item'
import { FlowBoard } from '../../types/flowboard.types'

// Mock the hook
vi.mock('../../hooks/use-flowboard-store', () => ({
  useBoardManagement: vi.fn()
}))

// Mock the context menu component
vi.mock('../board-context-menu', () => ({
  BoardContextMenu: ({ board, open, onOpenChange, position }: any) => (
    open ? (
      <div 
        data-testid="board-context-menu"
        data-board-id={board.id}
        data-position={`${position.x},${position.y}`}
      >
        Context Menu for {board.name}
        <button onClick={() => onOpenChange(false)}>Close</button>
      </div>
    ) : null
  )
}))

import { useBoardManagement } from '../../hooks/use-flowboard-store'

const mockUseBoardManagement = useBoardManagement as Mock

describe('BoardListItem', () => {
  const mockBoard: FlowBoard = {
    id: 'board-1',
    userId: 'user-1',
    name: 'Test Board',
    content: {
      nodes: [
        {
          id: 'node-1',
          type: 'text',
          position: { x: 0, y: 0 },
          data: { content: 'Test content' }
        },
        {
          id: 'node-2',
          type: 'image',
          position: { x: 100, y: 100 },
          data: { imageUrl: 'test.jpg' }
        }
      ],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 }
    },
    createdAt: new Date('2024-01-01T10:30:00'),
    updatedAt: new Date('2024-01-02T15:45:00')
  }

  const mockSelectBoard = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    mockUseBoardManagement.mockReturnValue({
      activeBoard: null,
      selectBoard: mockSelectBoard
    })
  })

  describe('Rendering', () => {
    it('should render board name and info', () => {
      render(<BoardListItem board={mockBoard} />)

      expect(screen.getByText('Test Board')).toBeInTheDocument()
      expect(screen.getByText('2 elementos')).toBeInTheDocument()
      expect(screen.getByText('02/01/24, 15:45')).toBeInTheDocument() // Formatted date
    })

    it('should show singular element count', () => {
      const boardWithOneElement = {
        ...mockBoard,
        content: {
          ...mockBoard.content,
          nodes: [mockBoard.content.nodes[0]]
        }
      }

      render(<BoardListItem board={boardWithOneElement} />)

      expect(screen.getByText('1 elemento')).toBeInTheDocument()
    })

    it('should show zero elements', () => {
      const emptyBoard = {
        ...mockBoard,
        content: {
          ...mockBoard.content,
          nodes: []
        }
      }

      render(<BoardListItem board={emptyBoard} />)

      expect(screen.getByText('0 elementos')).toBeInTheDocument()
    })

    it('should render board icon', () => {
      render(<BoardListItem board={mockBoard} />)

      // Check for FileText icon (Lucide icon)
      const icon = screen.getByRole('img', { hidden: true })
      expect(icon).toBeInTheDocument()
    })
  })

  describe('Selection State', () => {
    it('should show as inactive when not selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: null,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).not.toHaveClass('bg-cyan-950/30')
    })

    it('should show as active when selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: mockBoard,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveAttribute('aria-pressed', 'true')
      expect(button).toHaveClass('bg-cyan-950/30')
    })

    it('should show active indicator when selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: mockBoard,
        selectBoard: mockSelectBoard
      })

      const { container } = render(<BoardListItem board={mockBoard} />)

      // Check for active indicator (cyan bar)
      const indicator = container.querySelector('.bg-cyan-500')
      expect(indicator).toBeInTheDocument()
    })

    it('should not show active indicator when not selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: null,
        selectBoard: mockSelectBoard
      })

      const { container } = render(<BoardListItem board={mockBoard} />)

      // Check for active indicator (cyan bar)
      const indicator = container.querySelector('.bg-cyan-500')
      expect(indicator).not.toBeInTheDocument()
    })
  })

  describe('User Interactions', () => {
    it('should call selectBoard when clicked', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      await user.click(button)

      expect(mockSelectBoard).toHaveBeenCalledWith(mockBoard)
    })

    it('should call selectBoard when Enter key is pressed', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      button.focus()
      await user.keyboard('{Enter}')

      expect(mockSelectBoard).toHaveBeenCalledWith(mockBoard)
    })

    it('should call selectBoard when Space key is pressed', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      button.focus()
      await user.keyboard(' ')

      expect(mockSelectBoard).toHaveBeenCalledWith(mockBoard)
    })

    it('should not call selectBoard for other keys', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      button.focus()
      await user.keyboard('{Escape}')

      expect(mockSelectBoard).not.toHaveBeenCalled()
    })
  })

  describe('Context Menu', () => {
    it('should show context menu on right click', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      await user.pointer({ keys: '[MouseRight]', target: button })

      await waitFor(() => {
        expect(screen.getByTestId('board-context-menu')).toBeInTheDocument()
        expect(screen.getByText('Context Menu for Test Board')).toBeInTheDocument()
      })
    })

    it('should show context menu when ContextMenu key is pressed', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      button.focus()
      await user.keyboard('{ContextMenu}')

      await waitFor(() => {
        expect(screen.getByTestId('board-context-menu')).toBeInTheDocument()
      })
    })

    it('should show context menu when options button is clicked', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const optionsButton = screen.getByRole('button', { name: /opções do quadro test board/i })
      await user.click(optionsButton)

      await waitFor(() => {
        expect(screen.getByTestId('board-context-menu')).toBeInTheDocument()
      })
    })

    it('should not select board when options button is clicked', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const optionsButton = screen.getByRole('button', { name: /opções do quadro test board/i })
      await user.click(optionsButton)

      expect(mockSelectBoard).not.toHaveBeenCalled()
    })

    it('should close context menu when close button is clicked', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      // Open context menu
      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      await user.pointer({ keys: '[MouseRight]', target: button })

      await waitFor(() => {
        expect(screen.getByTestId('board-context-menu')).toBeInTheDocument()
      })

      // Close context menu
      const closeButton = screen.getByText('Close')
      await user.click(closeButton)

      await waitFor(() => {
        expect(screen.queryByTestId('board-context-menu')).not.toBeInTheDocument()
      })
    })

    it('should position context menu correctly on right click', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      
      // Mock getBoundingClientRect to return specific coordinates
      vi.spyOn(button, 'getBoundingClientRect').mockReturnValue({
        left: 100,
        top: 200,
        right: 300,
        bottom: 250,
        width: 200,
        height: 50,
        x: 100,
        y: 200,
        toJSON: () => ({})
      })

      // Simulate right click at specific coordinates
      fireEvent.contextMenu(button, { clientX: 150, clientY: 225 })

      await waitFor(() => {
        const contextMenu = screen.getByTestId('board-context-menu')
        expect(contextMenu).toHaveAttribute('data-position', '150,225')
      })
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA attributes', () => {
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveAttribute('aria-pressed', 'false')
      expect(button).toHaveAttribute('tabindex', '0')
    })

    it('should have proper ARIA attributes when selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: mockBoard,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveAttribute('aria-pressed', 'true')
    })

    it('should have proper focus management', async () => {
      const user = userEvent.setup()
      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      await user.tab()

      expect(button).toHaveFocus()
    })

    it('should have proper ARIA label for options button', () => {
      render(<BoardListItem board={mockBoard} />)

      const optionsButton = screen.getByRole('button', { name: /opções do quadro test board/i })
      expect(optionsButton).toBeInTheDocument()
    })
  })

  describe('Date Formatting', () => {
    it('should format date correctly in Portuguese locale', () => {
      const boardWithSpecificDate = {
        ...mockBoard,
        updatedAt: new Date('2024-12-25T14:30:00')
      }

      render(<BoardListItem board={boardWithSpecificDate} />)

      expect(screen.getByText('25/12/24, 14:30')).toBeInTheDocument()
    })

    it('should handle different date formats', () => {
      const boardWithDifferentDate = {
        ...mockBoard,
        updatedAt: new Date('2024-01-05T09:15:00')
      }

      render(<BoardListItem board={boardWithDifferentDate} />)

      expect(screen.getByText('05/01/24, 09:15')).toBeInTheDocument()
    })
  })

  describe('Visual States', () => {
    it('should show options button on hover (via CSS classes)', () => {
      render(<BoardListItem board={mockBoard} />)

      const optionsButton = screen.getByRole('button', { name: /opções do quadro test board/i })
      expect(optionsButton).toHaveClass('opacity-0', 'group-hover:opacity-100')
    })

    it('should show options button when selected', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: mockBoard,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const optionsButton = screen.getByRole('button', { name: /opções do quadro test board/i })
      expect(optionsButton).toHaveClass('opacity-100')
    })

    it('should apply correct styling classes for selected state', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: mockBoard,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveClass('bg-cyan-950/30', 'border-cyan-500/30')
    })

    it('should apply correct styling classes for unselected state', () => {
      mockUseBoardManagement.mockReturnValue({
        activeBoard: null,
        selectBoard: mockSelectBoard
      })

      render(<BoardListItem board={mockBoard} />)

      const button = screen.getByRole('button', { name: /selecionar quadro test board/i })
      expect(button).toHaveClass('bg-transparent', 'border-transparent')
    })
  })

  describe('Long Board Names', () => {
    it('should truncate long board names', () => {
      const boardWithLongName = {
        ...mockBoard,
        name: 'This is a very long board name that should be truncated when displayed in the UI'
      }

      render(<BoardListItem board={boardWithLongName} />)

      const nameElement = screen.getByText(boardWithLongName.name)
      expect(nameElement).toHaveClass('truncate')
    })
  })

  describe('Edge Cases', () => {
    it('should handle board with no nodes', () => {
      const emptyBoard = {
        ...mockBoard,
        content: {
          ...mockBoard.content,
          nodes: []
        }
      }

      render(<BoardListItem board={emptyBoard} />)

      expect(screen.getByText('0 elementos')).toBeInTheDocument()
    })

    it('should handle invalid dates gracefully', () => {
      const boardWithInvalidDate = {
        ...mockBoard,
        updatedAt: new Date('invalid-date')
      }

      render(<BoardListItem board={boardWithInvalidDate} />)

      // Should not crash and should render something
      expect(screen.getByText('Test Board')).toBeInTheDocument()
    })
  })
})