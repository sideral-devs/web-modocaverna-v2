'use client'

import React, { useState, useEffect } from 'react'
import { usePerformanceOptimizations, usePerformanceMonitoring } from '../hooks/use-performance-optimizations'
import { useFlowBoardStore } from '../hooks/use-flowboard-store'

interface PerformanceMonitorProps {
  visible?: boolean
  onClose?: () => void
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
  visible = false,
  onClose
}) => {
  const { calculateStorageUsage } = usePerformanceOptimizations()
  const { getMetrics } = usePerformanceMonitoring()
  const { nodes, edges } = useFlowBoardStore()
  
  const [storageInfo, setStorageInfo] = useState({ bytes: 0, mb: 0, percentage: 0 })
  const [performanceMetrics, setPerformanceMetrics] = useState({
    renderCount: 0,
    averageRenderTime: 0,
    nodeCount: 0,
    edgeCount: 0
  })

  useEffect(() => {
    if (visible) {
      const updateMetrics = () => {
        setStorageInfo(calculateStorageUsage())
        setPerformanceMetrics(getMetrics())
      }

      updateMetrics()
      const interval = setInterval(updateMetrics, 1000)
      
      return () => clearInterval(interval)
    }
  }, [visible, calculateStorageUsage, getMetrics])

  if (!visible) return null

  const getStorageColor = (percentage: number) => {
    if (percentage < 50) return 'text-green-400'
    if (percentage < 80) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getPerformanceColor = (renderTime: number) => {
    if (renderTime < 16) return 'text-green-400' // 60fps
    if (renderTime < 33) return 'text-yellow-400' // 30fps
    return 'text-red-400' // Below 30fps
  }

  return (
    <div className="fixed top-4 right-4 bg-zinc-900 border border-zinc-700 rounded-lg p-4 min-w-[300px] z-50 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-100">Monitor de Performance</h3>
        {onClose && (
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* Canvas Statistics */}
        <div>
          <h4 className="text-xs font-medium text-zinc-300 mb-2">Canvas</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="bg-zinc-800 rounded p-2">
              <div className="text-zinc-400">Nós</div>
              <div className="text-zinc-100 font-mono">{nodes.length}</div>
            </div>
            <div className="bg-zinc-800 rounded p-2">
              <div className="text-zinc-400">Conexões</div>
              <div className="text-zinc-100 font-mono">{edges.length}</div>
            </div>
          </div>
        </div>

        {/* Storage Usage */}
        <div>
          <h4 className="text-xs font-medium text-zinc-300 mb-2">Armazenamento</h4>
          <div className="bg-zinc-800 rounded p-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-zinc-400">Uso do localStorage</span>
              <span className={`text-xs font-mono ${getStorageColor(storageInfo.percentage)}`}>
                {storageInfo.percentage.toFixed(1)}%
              </span>
            </div>
            <div className="w-full bg-zinc-700 rounded-full h-2">
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  storageInfo.percentage < 50 ? 'bg-green-500' :
                  storageInfo.percentage < 80 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(storageInfo.percentage, 100)}%` }}
              />
            </div>
            <div className="text-xs text-zinc-400 mt-1">
              {storageInfo.mb.toFixed(2)} MB usado
            </div>
          </div>
        </div>

        {/* Performance Metrics */}
        <div>
          <h4 className="text-xs font-medium text-zinc-300 mb-2">Performance</h4>
          <div className="space-y-2">
            <div className="bg-zinc-800 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Tempo médio de render</span>
                <span className={`text-xs font-mono ${getPerformanceColor(performanceMetrics.averageRenderTime)}`}>
                  {performanceMetrics.averageRenderTime.toFixed(1)}ms
                </span>
              </div>
            </div>
            <div className="bg-zinc-800 rounded p-2">
              <div className="flex justify-between items-center">
                <span className="text-xs text-zinc-400">Total de renders</span>
                <span className="text-xs font-mono text-zinc-100">
                  {performanceMetrics.renderCount}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Performance Tips */}
        <div>
          <h4 className="text-xs font-medium text-zinc-300 mb-2">Dicas</h4>
          <div className="text-xs text-zinc-400 space-y-1">
            {storageInfo.percentage > 80 && (
              <div className="text-yellow-400">
                • Considere excluir quadros antigos
              </div>
            )}
            {nodes.length > 50 && (
              <div className="text-yellow-400">
                • Muitos elementos podem afetar a performance
              </div>
            )}
            {performanceMetrics.averageRenderTime > 33 && (
              <div className="text-red-400">
                • Performance baixa detectada
              </div>
            )}
            {storageInfo.percentage < 50 && performanceMetrics.averageRenderTime < 16 && (
              <div className="text-green-400">
                • Performance ótima!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

// Performance warning component for critical issues
export const PerformanceWarning: React.FC<{
  storagePercentage: number
  nodeCount: number
  onOptimize?: () => void
}> = ({ storagePercentage, nodeCount, onOptimize }) => {
  const [dismissed, setDismissed] = useState(false)

  const shouldShowWarning = storagePercentage > 90 || nodeCount > 100

  if (!shouldShowWarning || dismissed) return null

  return (
    <div className="fixed bottom-4 right-4 bg-yellow-900/90 border border-yellow-700 rounded-lg p-4 max-w-sm z-50">
      <div className="flex items-start gap-3">
        <svg className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-yellow-200 mb-1">
            Aviso de Performance
          </h4>
          <p className="text-xs text-yellow-300 mb-3">
            {storagePercentage > 90 
              ? 'Armazenamento quase cheio. Considere excluir quadros antigos.'
              : 'Muitos elementos no canvas podem afetar a performance.'
            }
          </p>
          <div className="flex gap-2">
            {onOptimize && (
              <button
                onClick={onOptimize}
                className="text-xs px-3 py-1.5 bg-yellow-800 hover:bg-yellow-700 text-yellow-100 rounded transition-colors"
              >
                Otimizar
              </button>
            )}
            <button
              onClick={() => setDismissed(true)}
              className="text-xs px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 rounded transition-colors"
            >
              Dispensar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}