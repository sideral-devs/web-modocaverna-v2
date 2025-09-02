import { FlowBoard, ReactFlowContent, FlowBoardError, FlowBoardErrorType, validateFlowBoard } from '../types/flowboard.types'

// Migration status and progress tracking
export interface MigrationStatus {
  status: 'idle' | 'in_progress' | 'completed' | 'failed'
  progress: number // 0-100
  totalBoards: number
  migratedBoards: number
  failedBoards: number
  errors: MigrationError[]
  startedAt?: Date
  completedAt?: Date
}

export interface MigrationError {
  boardId: string
  boardName: string
  error: string
  timestamp: Date
}

export interface MigrationResult {
  success: boolean
  status: MigrationStatus
  exportData?: ExportData
}

export interface ExportData {
  version: string
  exportedAt: Date
  userId: string
  boards: FlowBoard[]
  metadata: {
    totalBoards: number
    totalSize: number
    exportFormat: 'json'
  }
}

export interface ImportData {
  version: string
  exportedAt: string | Date
  userId: string
  boards: any[]
  metadata?: {
    totalBoards: number
    totalSize: number
    exportFormat: string
  }
}

// Data migration utility class
export class FlowBoardDataMigration {
  private static readonly EXPORT_VERSION = '1.0.0'
  private static readonly STORAGE_KEY = 'flowboards'
  
  /**
   * Export all localStorage data for a user
   */
  static exportLocalStorageData(userId: string): ExportData {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) {
        return this.createEmptyExport(userId)
      }

      const parsed = JSON.parse(stored)
      const userBoards = (parsed.boards || [])
        .filter((board: any) => board.userId === userId)
        .map((board: any) => this.sanitizeExportBoard(board))

      const exportData: ExportData = {
        version: this.EXPORT_VERSION,
        exportedAt: new Date(),
        userId,
        boards: userBoards,
        metadata: {
          totalBoards: userBoards.length,
          totalSize: JSON.stringify(userBoards).length,
          exportFormat: 'json'
        }
      }

      return exportData
    } catch (error) {
      console.error('Export failed:', error)
      throw new FlowBoardError(
        FlowBoardErrorType.INVALID_BOARD_DATA,
        'Failed to export localStorage data'
      )
    }
  }

  /**
   * Import data and validate it
   */
  static validateImportData(data: any): ImportData {
    if (!data || typeof data !== 'object') {
      throw new FlowBoardError(
        FlowBoardErrorType.INVALID_BOARD_DATA,
        'Invalid import data format'
      )
    }

    if (!data.version || !data.userId || !Array.isArray(data.boards)) {
      throw new FlowBoardError(
        FlowBoardErrorType.INVALID_BOARD_DATA,
        'Missing required import data fields'
      )
    }

    // Validate version compatibility
    if (!this.isVersionCompatible(data.version)) {
      throw new FlowBoardError(
        FlowBoardErrorType.INVALID_BOARD_DATA,
        `Unsupported export version: ${data.version}`
      )
    }

    return {
      version: data.version,
      exportedAt: typeof data.exportedAt === 'string' 
        ? new Date(data.exportedAt) 
        : data.exportedAt,
      userId: data.userId,
      boards: data.boards,
      metadata: data.metadata
    }
  }

  /**
   * Transform localStorage board data to API format
   */
  static transformBoardForAPI(board: any): Partial<FlowBoard> {
    try {
      const transformedBoard: Partial<FlowBoard> = {
        name: board.name?.trim() || 'Untitled Board',
        content: this.transformContentForAPI(board.content)
      }

      // Don't include id, userId, createdAt, updatedAt - these will be set by API
      return transformedBoard
    } catch (error) {
      console.error('Board transformation failed:', error)
      throw new FlowBoardError(
        FlowBoardErrorType.INVALID_BOARD_DATA,
        `Failed to transform board: ${board.name || 'Unknown'}`
      )
    }
  }

  /**
   * Transform board content for API compatibility
   */
  static transformContentForAPI(content: any): ReactFlowContent {
    if (!content || typeof content !== 'object') {
      return {
        nodes: [],
        edges: [],
        viewport: { x: 0, y: 0, zoom: 1 }
      }
    }

    return {
      nodes: this.transformNodesForAPI(content.nodes || []),
      edges: this.transformEdgesForAPI(content.edges || []),
      viewport: this.transformViewportForAPI(content.viewport)
    }
  }

  /**
   * Transform nodes for API compatibility
   */
  private static transformNodesForAPI(nodes: any[]): any[] {
    if (!Array.isArray(nodes)) return []

    return nodes
      .map((node, index) => {
        try {
          return {
            id: node.id || `node-${Date.now()}-${index}`,
            type: ['text', 'image', 'shape'].includes(node.type) ? node.type : 'text',
            position: {
              x: typeof node.position?.x === 'number' ? node.position.x : 0,
              y: typeof node.position?.y === 'number' ? node.position.y : 0
            },
            data: this.transformNodeDataForAPI(node.data),
            // Preserve React Flow properties
            ...(node.style && { style: node.style }),
            ...(node.className && { className: node.className }),
            ...(typeof node.width === 'number' && { width: node.width }),
            ...(typeof node.height === 'number' && { height: node.height })
          }
        } catch (error) {
          console.warn(`Failed to transform node at index ${index}:`, error)
          return null
        }
      })
      .filter(node => node !== null)
  }

  /**
   * Transform node data for API compatibility
   */
  private static transformNodeDataForAPI(data: any): any {
    if (!data || typeof data !== 'object') {
      return { content: 'Restored content' }
    }

    const transformedData: any = {}

    // Transform and validate each property
    if (typeof data.label === 'string') {
      transformedData.label = data.label.substring(0, 1000) // Limit length
    }
    
    if (typeof data.content === 'string') {
      transformedData.content = data.content.substring(0, 10000) // Limit length
    }
    
    if (typeof data.imageUrl === 'string') {
      transformedData.imageUrl = this.validateImageUrl(data.imageUrl)
    }
    
    if (typeof data.backgroundColor === 'string') {
      transformedData.backgroundColor = this.validateColor(data.backgroundColor)
    }
    
    if (typeof data.borderColor === 'string') {
      transformedData.borderColor = this.validateColor(data.borderColor)
    }
    
    if (typeof data.textColor === 'string') {
      transformedData.textColor = this.validateColor(data.textColor)
    }

    // Ensure at least some content exists
    if (!transformedData.content && !transformedData.imageUrl && !transformedData.label) {
      transformedData.content = 'Migrated content'
    }

    return transformedData
  }

  /**
   * Transform edges for API compatibility
   */
  private static transformEdgesForAPI(edges: any[]): any[] {
    if (!Array.isArray(edges)) return []

    return edges
      .map((edge, index) => {
        try {
          if (!edge.source || !edge.target) {
            console.warn(`Edge at index ${index} missing source or target`)
            return null
          }

          return {
            id: edge.id || `edge-${Date.now()}-${index}`,
            source: edge.source,
            target: edge.target,
            // Preserve React Flow properties
            ...(edge.type && { type: edge.type }),
            ...(edge.style && { style: edge.style }),
            ...(edge.className && { className: edge.className }),
            ...(typeof edge.animated === 'boolean' && { animated: edge.animated }),
            ...(edge.label && { label: String(edge.label).substring(0, 500) }), // Limit length
            ...(edge.labelStyle && { labelStyle: edge.labelStyle }),
            ...(typeof edge.labelShowBg === 'boolean' && { labelShowBg: edge.labelShowBg }),
            ...(edge.labelBgStyle && { labelBgStyle: edge.labelBgStyle }),
            ...(edge.data && { data: edge.data })
          }
        } catch (error) {
          console.warn(`Failed to transform edge at index ${index}:`, error)
          return null
        }
      })
      .filter(edge => edge !== null)
  }

  /**
   * Transform viewport for API compatibility
   */
  private static transformViewportForAPI(viewport: any): { x: number, y: number, zoom: number } {
    if (!viewport || typeof viewport !== 'object') {
      return { x: 0, y: 0, zoom: 1 }
    }

    return {
      x: typeof viewport.x === 'number' && isFinite(viewport.x) ? viewport.x : 0,
      y: typeof viewport.y === 'number' && isFinite(viewport.y) ? viewport.y : 0,
      zoom: typeof viewport.zoom === 'number' && isFinite(viewport.zoom) && viewport.zoom > 0
        ? Math.max(0.1, Math.min(4, viewport.zoom)) // Clamp between 0.1 and 4
        : 1
    }
  }

  /**
   * Generate migration report
   */
  static generateMigrationReport(
    exportData: ExportData,
    migrationStatus: MigrationStatus
  ): string {
    const report = [
      '# FlowBoard Migration Report',
      '',
      `**Migration Date:** ${new Date().toLocaleString()}`,
      `**User ID:** ${exportData.userId}`,
      `**Export Version:** ${exportData.version}`,
      '',
      '## Summary',
      `- Total boards to migrate: ${exportData.metadata.totalBoards}`,
      `- Successfully migrated: ${migrationStatus.migratedBoards}`,
      `- Failed migrations: ${migrationStatus.failedBoards}`,
      `- Migration status: ${migrationStatus.status}`,
      '',
      '## Board Details',
      ...exportData.boards.map(board => 
        `- **${board.name}** (${board.content.nodes.length} nodes, ${board.content.edges.length} edges)`
      ),
      ''
    ]

    if (migrationStatus.errors.length > 0) {
      report.push(
        '## Errors',
        ...migrationStatus.errors.map(error => 
          `- **${error.boardName}**: ${error.error} (${error.timestamp.toLocaleString()})`
        ),
        ''
      )
    }

    report.push(
      '## Data Size',
      `- Total export size: ${this.formatBytes(exportData.metadata.totalSize)}`,
      `- Average board size: ${this.formatBytes(Math.round(exportData.metadata.totalSize / exportData.metadata.totalBoards))}`,
      ''
    )

    return report.join('\n')
  }

  /**
   * Create downloadable export file
   */
  static createExportFile(exportData: ExportData): Blob {
    const jsonString = JSON.stringify(exportData, null, 2)
    return new Blob([jsonString], { type: 'application/json' })
  }

  /**
   * Download export data as file
   */
  static downloadExportData(exportData: ExportData): void {
    const blob = this.createExportFile(exportData)
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    
    link.href = url
    link.download = `flowboard-export-${exportData.userId}-${Date.now()}.json`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    
    URL.revokeObjectURL(url)
  }

  /**
   * Parse uploaded export file
   */
  static async parseExportFile(file: File): Promise<ImportData> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string
          const data = JSON.parse(content)
          const importData = this.validateImportData(data)
          resolve(importData)
        } catch (error) {
          reject(new FlowBoardError(
            FlowBoardErrorType.INVALID_BOARD_DATA,
            'Failed to parse export file'
          ))
        }
      }
      
      reader.onerror = () => {
        reject(new FlowBoardError(
          FlowBoardErrorType.INVALID_BOARD_DATA,
          'Failed to read export file'
        ))
      }
      
      reader.readAsText(file)
    })
  }

  /**
   * Validate board data integrity
   */
  static validateBoardIntegrity(board: any): { isValid: boolean, errors: string[] } {
    const errors: string[] = []

    // Check required fields
    if (!board.name || typeof board.name !== 'string') {
      errors.push('Missing or invalid board name')
    }

    if (!board.content || typeof board.content !== 'object') {
      errors.push('Missing or invalid board content')
    } else {
      // Validate content structure
      if (!Array.isArray(board.content.nodes)) {
        errors.push('Invalid nodes array')
      }
      
      if (!Array.isArray(board.content.edges)) {
        errors.push('Invalid edges array')
      }
      
      if (!board.content.viewport || typeof board.content.viewport !== 'object') {
        errors.push('Invalid viewport object')
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Clean up localStorage after successful migration
   */
  static cleanupLocalStorage(userId: string): void {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (!stored) return

      const parsed = JSON.parse(stored)
      const otherUserBoards = (parsed.boards || [])
        .filter((board: any) => board.userId !== userId)

      // Keep other users' data, remove only current user's data
      const cleanedData = {
        ...parsed,
        boards: otherUserBoards,
        lastModified: Date.now()
      }

      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(cleanedData))
    } catch (error) {
      console.error('Failed to cleanup localStorage:', error)
      // Don't throw error - cleanup failure shouldn't break migration
    }
  }

  /**
   * Estimate migration time based on data size
   */
  static estimateMigrationTime(exportData: ExportData): number {
    // Rough estimate: 1 second per board + 0.1 seconds per KB
    const baseTime = exportData.metadata.totalBoards * 1000 // 1 second per board
    const sizeTime = (exportData.metadata.totalSize / 1024) * 100 // 0.1 seconds per KB
    
    return Math.max(baseTime + sizeTime, 2000) // Minimum 2 seconds
  }

  // Helper methods
  private static createEmptyExport(userId: string): ExportData {
    return {
      version: this.EXPORT_VERSION,
      exportedAt: new Date(),
      userId,
      boards: [],
      metadata: {
        totalBoards: 0,
        totalSize: 0,
        exportFormat: 'json'
      }
    }
  }

  private static sanitizeExportBoard(board: any): FlowBoard {
    return {
      id: board.id,
      userId: board.userId,
      name: board.name,
      content: board.content,
      createdAt: new Date(board.createdAt),
      updatedAt: new Date(board.updatedAt)
    }
  }

  private static isVersionCompatible(version: string): boolean {
    // For now, only support current version
    // In the future, implement version compatibility matrix
    return version === this.EXPORT_VERSION
  }

  private static validateImageUrl(url: string): string {
    // Basic validation for image URLs and base64 data
    if (url.startsWith('data:image/')) {
      // Validate base64 image data
      try {
        const base64Data = url.split(',')[1]
        if (base64Data && base64Data.length > 0) {
          return url
        }
      } catch (error) {
        console.warn('Invalid base64 image data')
      }
    } else if (url.startsWith('http://') || url.startsWith('https://')) {
      // Basic URL validation
      try {
        new URL(url)
        return url
      } catch (error) {
        console.warn('Invalid image URL')
      }
    }
    
    return '' // Return empty string for invalid URLs
  }

  private static validateColor(color: string): string {
    // Basic CSS color validation
    if (color.match(/^#[0-9A-Fa-f]{6}$/) || 
        color.match(/^#[0-9A-Fa-f]{3}$/) ||
        color.match(/^rgb\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*\)$/) ||
        color.match(/^rgba\(\s*\d+\s*,\s*\d+\s*,\s*\d+\s*,\s*[\d.]+\s*\)$/)) {
      return color
    }
    
    return '' // Return empty string for invalid colors
  }

  private static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes'
    
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// Migration progress tracker
export class MigrationProgressTracker {
  private status: MigrationStatus = {
    status: 'idle',
    progress: 0,
    totalBoards: 0,
    migratedBoards: 0,
    failedBoards: 0,
    errors: []
  }

  private listeners: ((status: MigrationStatus) => void)[] = []

  start(totalBoards: number): void {
    this.status = {
      status: 'in_progress',
      progress: 0,
      totalBoards,
      migratedBoards: 0,
      failedBoards: 0,
      errors: [],
      startedAt: new Date()
    }
    this.notifyListeners()
  }

  boardMigrated(): void {
    this.status.migratedBoards++
    this.updateProgress()
    this.notifyListeners()
  }

  boardFailed(boardId: string, boardName: string, error: string): void {
    this.status.failedBoards++
    this.status.errors.push({
      boardId,
      boardName,
      error,
      timestamp: new Date()
    })
    this.updateProgress()
    this.notifyListeners()
  }

  complete(): void {
    this.status.status = 'completed'
    this.status.progress = 100
    this.status.completedAt = new Date()
    this.notifyListeners()
  }

  fail(): void {
    this.status.status = 'failed'
    this.status.completedAt = new Date()
    this.notifyListeners()
  }

  getStatus(): MigrationStatus {
    return { ...this.status }
  }

  onStatusChange(listener: (status: MigrationStatus) => void): () => void {
    this.listeners.push(listener)
    return () => {
      const index = this.listeners.indexOf(listener)
      if (index > -1) {
        this.listeners.splice(index, 1)
      }
    }
  }

  private updateProgress(): void {
    const completed = this.status.migratedBoards + this.status.failedBoards
    this.status.progress = Math.round((completed / this.status.totalBoards) * 100)
  }

  private notifyListeners(): void {
    this.listeners.forEach(listener => listener(this.status))
  }
}