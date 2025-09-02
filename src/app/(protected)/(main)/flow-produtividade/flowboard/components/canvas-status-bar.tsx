'use client'

import React from 'react'
import { Panel } from 'reactflow'
import { useCanvasOperations } from '../hooks/use-flowboard-store'
import { SaveStatusIndicator } from './save-status-indicator'

interface CanvasStatusBarProps {
  className?: string
}

export const CanvasStatusBar: React.FC<CanvasStatusBarProps> = ({
  className = ''
}) => {
  const { 
    selectedTool, 
    nodes, 
    edges 
  } = useCanvasOperations()

  const getToolName = (tool: string) => {
    switch (tool) {
      case 'select': return 'Selecionar'
      case 'text': return 'Texto'
      case 'shape': return 'Forma'
      case 'image': return 'Imagem'
      default: return 'Texto'
    }
  }

  return (
    <Panel position="bottom-center" className={`z-10 ${className}`}>
      <div className="bg-zinc-800/95 backdrop-blur-sm rounded-lg border border-zinc-700 px-4 py-2 shadow-lg">
        <div className="flex items-center gap-6 text-sm text-zinc-300">
          {/* Nodes count */}
          <span className="flex items-center gap-2">
            <span className="text-zinc-400">Nodes:</span>
            <span className="text-white font-medium">{nodes.length}</span>
          </span>

          {/* Edges count */}
          <span className="flex items-center gap-2">
            <span className="text-zinc-400">Edges:</span>
            <span className="text-white font-medium">{edges.length}</span>
          </span>

          {/* Current tool */}
          <span className="flex items-center gap-2">
            <span className="text-zinc-400">Ferramenta:</span>
            <span className="text-white font-medium">{getToolName(selectedTool)}</span>
          </span>

          {/* Save status */}
          <div className="flex items-center gap-2">
            <SaveStatusIndicator showIcon={false} showText={true} />
          </div>
        </div>
      </div>
    </Panel>
  )
}