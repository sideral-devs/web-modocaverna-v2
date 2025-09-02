'use client'

import { useCallback, useMemo, useRef, useEffect } from 'react'
import { Node, Edge, Viewport } from 'reactflow'
import { CustomNode } from '../types/flowboard.types'
import { compressImageDataUrl, optimizeImageForStorage } from '../utils/image-optimization'

interface PerformanceConfig {
  enableViewportRendering: boolean
  maxVisibleNodes: number
  imageCompressionQuality: number
  imageMaxWidth: number
  imageMaxHeight: number
  debounceDelay: number
  enableVirtualization: boolean
}

const DEFAULT_CONFIG: PerformanceConfig = {
  enableViewportRendering: true,
  maxVisibleNodes: 100,
  imageCompressionQuality: 0.8,
  imageMaxWidth: 800,
  imageMaxHeight: 600,
  debounceDelay: 100,
  enableVirtualization: true
}

export function usePerformanceOptimizations(config: Partial<PerformanceConfig> = {}) {
  const finalConfig = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config])
  const compressionCanvasRef = useRef<HTMLCanvasElement | null>(null)

  // Create a canvas for image compression if it doesn't exist
  useEffect(() => {
    if (!compressionCanvasRef.current) {
      compressionCanvasRef.current = document.createElement('canvas')
    }
  }, [])

  // Compress image data URL for localStorage efficiency
  const compressImage = useCallback(async (
    dataUrl: string,
    quality: number = finalConfig.imageCompressionQuality,
    maxWidth: number = finalConfig.imageMaxWidth,
    maxHeight: number = finalConfig.imageMaxHeight
  ): Promise<string> => {
    try {
      return await compressImageDataUrl(dataUrl, {
        quality,
        maxWidth,
        maxHeight,
        format: 'jpeg'
      })
    } catch (error) {
      console.error('Image compression failed:', error)
      return dataUrl // Return original if compression fails
    }
  }, [finalConfig.imageCompressionQuality, finalConfig.imageMaxWidth, finalConfig.imageMaxHeight])

  // Optimize image for storage with target size
  const optimizeImage = useCallback(async (
    dataUrl: string,
    targetSizeKB: number = 300
  ): Promise<string> => {
    try {
      const result = await optimizeImageForStorage(dataUrl, targetSizeKB)
      return result.dataUrl
    } catch (error) {
      console.error('Image optimization failed:', error)
      return dataUrl // Return original if optimization fails
    }
  }, [])

  // Filter nodes based on viewport for performance
  const getVisibleNodes = useCallback((
    nodes: CustomNode[],
    viewport: Viewport,
    canvasWidth: number,
    canvasHeight: number
  ): CustomNode[] => {
    if (!finalConfig.enableViewportRendering || nodes.length <= finalConfig.maxVisibleNodes) {
      return nodes
    }

    // Calculate visible area with some padding
    const padding = 200 // Extra padding to render nodes just outside viewport
    const visibleArea = {
      left: -viewport.x / viewport.zoom - padding,
      top: -viewport.y / viewport.zoom - padding,
      right: (-viewport.x + canvasWidth) / viewport.zoom + padding,
      bottom: (-viewport.y + canvasHeight) / viewport.zoom + padding
    }

    return nodes.filter(node => {
      const nodeWidth = node.width || 150 // Default node width
      const nodeHeight = node.height || 50 // Default node height
      
      const nodeRight = node.position.x + nodeWidth
      const nodeBottom = node.position.y + nodeHeight

      // Check if node intersects with visible area
      return !(
        node.position.x > visibleArea.right ||
        nodeRight < visibleArea.left ||
        node.position.y > visibleArea.bottom ||
        nodeBottom < visibleArea.top
      )
    })
  }, [finalConfig.enableViewportRendering, finalConfig.maxVisibleNodes])

  // Optimize React Flow performance settings
  const getReactFlowProps = useCallback(() => {
    return {
      // Performance optimizations
      nodesDraggable: true,
      nodesConnectable: true,
      elementsSelectable: true,
      
      // Reduce re-renders
      snapToGrid: false,
      snapGrid: [15, 15] as [number, number],
      
      // Connection line styling (lighter rendering)
      connectionLineStyle: {
        strokeWidth: 2,
        stroke: '#6366f1'
      },
      
      // Optimize edge updates
      edgeUpdaterRadius: 10,
      
      // Reduce animation overhead if user prefers reduced motion
      ...(window.matchMedia('(prefers-reduced-motion: reduce)').matches && {
        connectionLineStyle: {
          strokeWidth: 2,
          stroke: '#6366f1',
          animation: 'none'
        }
      })
    }
  }, [])

  // Debounce function for performance-critical operations
  const debounce = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = finalConfig.debounceDelay
  ): ((...args: Parameters<T>) => void) => {
    let timeoutId: NodeJS.Timeout
    
    return (...args: Parameters<T>) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => func(...args), delay)
    }
  }, [finalConfig.debounceDelay])

  // Throttle function for high-frequency events
  const throttle = useCallback(<T extends (...args: any[]) => any>(
    func: T,
    delay: number = finalConfig.debounceDelay
  ): ((...args: Parameters<T>) => void) => {
    let lastCall = 0
    
    return (...args: Parameters<T>) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        func(...args)
      }
    }
  }, [finalConfig.debounceDelay])

  // Memory cleanup for large datasets
  const cleanupUnusedData = useCallback((nodes: CustomNode[]) => {
    // Remove unused image data from nodes that are far from viewport
    return nodes.map(node => {
      if (node.type === 'image' && node.data.imageUrl) {
        // Keep image data for now, but could implement more aggressive cleanup
        // based on distance from viewport or last access time
        return node
      }
      return node
    })
  }, [])

  // Calculate storage usage for monitoring
  const calculateStorageUsage = useCallback(() => {
    try {
      const flowboardData = localStorage.getItem('flowboards')
      if (!flowboardData) return { bytes: 0, mb: 0, percentage: 0 }
      
      // Calculate size in bytes (rough estimate)
      const sizeInBytes = new Blob([flowboardData]).size
      const sizeInMB = sizeInBytes / (1024 * 1024)
      
      return {
        bytes: sizeInBytes,
        mb: sizeInMB,
        percentage: (sizeInMB / 5) * 100 // Assuming 5MB localStorage limit
      }
    } catch (error) {
      console.warn('Failed to calculate storage usage:', error)
      return { bytes: 0, mb: 0, percentage: 0 }
    }
  }, [])

  // Optimize node rendering based on zoom level
  const getNodeRenderLevel = useCallback((zoom: number) => {
    if (zoom < 0.3) {
      return 'minimal' // Show only basic shapes
    } else if (zoom < 0.7) {
      return 'reduced' // Show shapes with minimal text
    } else {
      return 'full' // Show full detail
    }
  }, [])

  // Batch operations for better performance
  const batchNodeUpdates = useCallback((
    updates: Array<{ nodeId: string; changes: Partial<CustomNode> }>,
    nodes: CustomNode[]
  ): CustomNode[] => {
    const nodeMap = new Map(nodes.map(node => [node.id, node]))
    
    updates.forEach(({ nodeId, changes }) => {
      const existingNode = nodeMap.get(nodeId)
      if (existingNode) {
        nodeMap.set(nodeId, { ...existingNode, ...changes })
      }
    })
    
    return Array.from(nodeMap.values())
  }, [])

  return {
    // Image optimization
    compressImage,
    optimizeImage,
    
    // Viewport optimization
    getVisibleNodes,
    
    // React Flow optimization
    getReactFlowProps,
    
    // Performance utilities
    debounce,
    throttle,
    
    // Memory management
    cleanupUnusedData,
    calculateStorageUsage,
    
    // Rendering optimization
    getNodeRenderLevel,
    batchNodeUpdates,
    
    // Configuration
    config: finalConfig
  }
}

// Hook for monitoring performance metrics
export function usePerformanceMonitoring() {
  const metricsRef = useRef({
    renderCount: 0,
    lastRenderTime: 0,
    averageRenderTime: 0,
    nodeCount: 0,
    edgeCount: 0
  })

  const recordRender = useCallback((nodeCount: number, edgeCount: number) => {
    const now = performance.now()
    const renderTime = now - metricsRef.current.lastRenderTime
    
    metricsRef.current.renderCount++
    metricsRef.current.nodeCount = nodeCount
    metricsRef.current.edgeCount = edgeCount
    
    // Calculate rolling average
    if (metricsRef.current.renderCount > 1) {
      metricsRef.current.averageRenderTime = 
        (metricsRef.current.averageRenderTime * (metricsRef.current.renderCount - 1) + renderTime) / 
        metricsRef.current.renderCount
    } else {
      metricsRef.current.averageRenderTime = renderTime
    }
    
    metricsRef.current.lastRenderTime = now
  }, [])

  const getMetrics = useCallback(() => {
    return { ...metricsRef.current }
  }, [])

  const resetMetrics = useCallback(() => {
    metricsRef.current = {
      renderCount: 0,
      lastRenderTime: performance.now(),
      averageRenderTime: 0,
      nodeCount: 0,
      edgeCount: 0
    }
  }, [])

  return {
    recordRender,
    getMetrics,
    resetMetrics
  }
}