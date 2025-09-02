/**
 * Image optimization utilities for FlowBoard
 * Provides image compression and optimization for better localStorage performance
 */

export interface ImageOptimizationOptions {
  maxWidth?: number
  maxHeight?: number
  quality?: number
  format?: 'jpeg' | 'png' | 'webp'
}

const DEFAULT_OPTIONS: Required<ImageOptimizationOptions> = {
  maxWidth: 800,
  maxHeight: 600,
  quality: 0.8,
  format: 'jpeg'
}

/**
 * Compress an image data URL for better storage efficiency
 */
export async function compressImageDataUrl(
  dataUrl: string,
  options: ImageOptimizationOptions = {}
): Promise<string> {
  const opts = { ...DEFAULT_OPTIONS, ...options }
  
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error('Canvas context not available'))
          return
        }

        // Calculate new dimensions while maintaining aspect ratio
        let { width, height } = img
        
        if (width > opts.maxWidth || height > opts.maxHeight) {
          const aspectRatio = width / height
          
          if (width > height) {
            width = Math.min(width, opts.maxWidth)
            height = width / aspectRatio
          } else {
            height = Math.min(height, opts.maxHeight)
            width = height * aspectRatio
          }
        }

        // Set canvas dimensions
        canvas.width = width
        canvas.height = height

        // Draw and compress
        ctx.drawImage(img, 0, 0, width, height)
        
        const mimeType = `image/${opts.format}`
        const compressedDataUrl = canvas.toDataURL(mimeType, opts.quality)
        
        resolve(compressedDataUrl)
      } catch (error) {
        reject(error)
      }
    }

    img.onerror = () => {
      reject(new Error('Failed to load image for compression'))
    }

    img.src = dataUrl
  })
}

/**
 * Get the size of a data URL in bytes
 */
export function getDataUrlSize(dataUrl: string): number {
  // Remove data URL prefix to get just the base64 data
  const base64Data = dataUrl.split(',')[1] || dataUrl
  
  // Calculate size: each base64 character represents 6 bits
  // So 4 base64 chars = 3 bytes, accounting for padding
  const padding = (base64Data.match(/=/g) || []).length
  return Math.floor((base64Data.length * 3) / 4) - padding
}

/**
 * Format bytes to human readable string
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

/**
 * Check if an image needs compression based on size
 */
export function shouldCompressImage(dataUrl: string, maxSizeKB: number = 500): boolean {
  const sizeBytes = getDataUrlSize(dataUrl)
  const sizeKB = sizeBytes / 1024
  return sizeKB > maxSizeKB
}

/**
 * Optimize image for localStorage storage
 */
export async function optimizeImageForStorage(
  dataUrl: string,
  targetSizeKB: number = 300
): Promise<{ dataUrl: string; originalSize: number; compressedSize: number; compressionRatio: number }> {
  const originalSize = getDataUrlSize(dataUrl)
  
  // If image is already small enough, return as-is
  if (originalSize / 1024 <= targetSizeKB) {
    return {
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    }
  }

  // Try different compression levels to reach target size
  const compressionLevels = [0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3]
  
  for (const quality of compressionLevels) {
    try {
      const compressedDataUrl = await compressImageDataUrl(dataUrl, { quality })
      const compressedSize = getDataUrlSize(compressedDataUrl)
      
      if (compressedSize / 1024 <= targetSizeKB) {
        return {
          dataUrl: compressedDataUrl,
          originalSize,
          compressedSize,
          compressionRatio: compressedSize / originalSize
        }
      }
    } catch (error) {
      console.warn('Failed to compress image at quality', quality, error)
    }
  }

  // If we can't reach target size, return best compression
  try {
    const compressedDataUrl = await compressImageDataUrl(dataUrl, { quality: 0.3 })
    const compressedSize = getDataUrlSize(compressedDataUrl)
    
    return {
      dataUrl: compressedDataUrl,
      originalSize,
      compressedSize,
      compressionRatio: compressedSize / originalSize
    }
  } catch (error) {
    // If compression fails completely, return original
    console.error('Image compression failed completely:', error)
    return {
      dataUrl,
      originalSize,
      compressedSize: originalSize,
      compressionRatio: 1
    }
  }
}

/**
 * Batch optimize multiple images
 */
export async function batchOptimizeImages(
  images: Array<{ id: string; dataUrl: string }>,
  targetSizeKB: number = 300,
  onProgress?: (completed: number, total: number) => void
): Promise<Array<{ id: string; dataUrl: string; originalSize: number; compressedSize: number }>> {
  const results = []
  
  for (let i = 0; i < images.length; i++) {
    const image = images[i]
    
    try {
      const optimized = await optimizeImageForStorage(image.dataUrl, targetSizeKB)
      results.push({
        id: image.id,
        dataUrl: optimized.dataUrl,
        originalSize: optimized.originalSize,
        compressedSize: optimized.compressedSize
      })
    } catch (error) {
      console.error(`Failed to optimize image ${image.id}:`, error)
      results.push({
        id: image.id,
        dataUrl: image.dataUrl,
        originalSize: getDataUrlSize(image.dataUrl),
        compressedSize: getDataUrlSize(image.dataUrl)
      })
    }
    
    onProgress?.(i + 1, images.length)
  }
  
  return results
}

/**
 * Calculate total storage usage of images
 */
export function calculateImageStorageUsage(images: string[]): {
  totalBytes: number
  totalMB: number
  averageBytes: number
  largestBytes: number
  smallestBytes: number
} {
  if (images.length === 0) {
    return {
      totalBytes: 0,
      totalMB: 0,
      averageBytes: 0,
      largestBytes: 0,
      smallestBytes: 0
    }
  }

  const sizes = images.map(getDataUrlSize)
  const totalBytes = sizes.reduce((sum, size) => sum + size, 0)
  
  return {
    totalBytes,
    totalMB: totalBytes / (1024 * 1024),
    averageBytes: totalBytes / sizes.length,
    largestBytes: Math.max(...sizes),
    smallestBytes: Math.min(...sizes)
  }
}