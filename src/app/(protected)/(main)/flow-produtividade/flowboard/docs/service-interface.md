# FlowBoard Service Interface Documentation

## Overview

This document describes the service interface abstraction that enables seamless migration from localStorage (Phase 1) to backend API (Phase 2). The interface provides a consistent API for board operations regardless of the underlying storage mechanism.

## Service Interface Architecture

### Core Interface Definition

```typescript
interface FlowBoardService {
  // Core CRUD operations
  getBoards(): Promise<FlowBoard[]>
  getBoardById?(id: string): Promise<FlowBoard | null>
  createBoard(name: string): Promise<FlowBoard>
  updateBoard(id: string, updates: Partial<FlowBoard>): Promise<FlowBoard>
  deleteBoard(id: string): Promise<void>
  saveBoardContent(id: string, content: ReactFlowContent): Promise<void>
  
  // Optional enhanced methods
  autoSaveBoardContent?(id: string, content: ReactFlowContent): void
  isStorageAvailable?(): boolean
  getStorageInfo?(): StorageInfo
  validateStorageHealth?(): HealthCheck
  cleanupStorage?(): Promise<CleanupResult>
  cleanup?(): void
}
```

### Extended Interfaces

```typescript
interface StorageInfo {
  used: number
  available: number
  percentage: number
  isNearLimit: boolean
  isAtLimit: boolean
  estimatedBoardsRemaining: number
}

interface HealthCheck {
  isHealthy: boolean
  issues: string[]
  recommendations: string[]
}

interface CleanupResult {
  deletedBoards: number
  freedSpace: number
  newStorageInfo: StorageInfo
}
```

## Implementation Comparison

### Phase 1: LocalStorage Implementation

```typescript
class LocalStorageFlowBoardService implements FlowBoardService {
  private readonly STORAGE_KEY = 'flowboards'
  private readonly MAX_BOARDS = 10
  private readonly VERSION = '1.0.0'
  private autoSaveTimeouts = new Map<string, NodeJS.Timeout>()

  constructor(private userId: string) {}

  // Synchronous localStorage operations wrapped in Promise
  async getBoards(): Promise<FlowBoard[]> {
    const data = this.getStorageData()
    return data.boards.filter(board => board.userId === this.userId)
  }

  async createBoard(name: string): Promise<FlowBoard> {
    // Validate board limit
    // Create board object
    // Save to localStorage
    // Return created board
  }

  // Auto-save with debouncing
  autoSaveBoardContent(id: string, content: ReactFlowContent): void {
    const existingTimeout = this.autoSaveTimeouts.get(id)
    if (existingTimeout) clearTimeout(existingTimeout)
    
    const timeout = setTimeout(async () => {
      await this.saveBoardContent(id, content)
      this.autoSaveTimeouts.delete(id)
    }, 2000)
    
    this.autoSaveTimeouts.set(id, timeout)
  }

  // Storage-specific methods
  isStorageAvailable(): boolean { /* localStorage availability check */ }
  getStorageInfo(): StorageInfo { /* localStorage usage info */ }
  validateStorageHealth(): HealthCheck { /* localStorage health check */ }
  cleanupStorage(): Promise<CleanupResult> { /* localStorage cleanup */ }
  cleanup(): void { /* Clear timeouts */ }
}
```

### Phase 2: API Implementation

```typescript
class APIFlowBoardService implements FlowBoardService {
  private readonly baseURL = '/api/flowboards'
  private cache = new Map<string, { data: any, timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(private authToken: string) {}

  async getBoards(): Promise<FlowBoard[]> {
    const cacheKey = 'boards'
    const cached = this.getFromCache(cacheKey)
    if (cached) return cached

    const response = await fetch(this.baseURL, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw this.handleAPIError(response)
    }

    const result = await response.json()
    const boards = result.data.boards.map(this.transformAPIBoard)
    
    this.setCache(cacheKey, boards)
    return boards
  }

  async createBoard(name: string): Promise<FlowBoard> {
    const response = await fetch(this.baseURL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ name })
    })

    if (!response.ok) {
      throw this.handleAPIError(response)
    }

    const result = await response.json()
    const board = this.transformAPIBoard(result.data)
    
    // Invalidate boards cache
    this.invalidateCache('boards')
    
    return board
  }

  async saveBoardContent(id: string, content: ReactFlowContent): Promise<void> {
    const response = await fetch(`${this.baseURL}/${id}/content`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content })
    })

    if (!response.ok) {
      throw this.handleAPIError(response)
    }

    // Invalidate relevant caches
    this.invalidateCache(`board-${id}`)
    this.invalidateCache('boards')
  }

  // Auto-save with optimistic updates and conflict resolution
  autoSaveBoardContent(id: string, content: ReactFlowContent): void {
    // Implement optimistic updates
    // Queue save operations
    // Handle conflicts
  }

  // API-specific methods
  private transformAPIBoard(apiBoard: any): FlowBoard {
    return {
      ...apiBoard,
      createdAt: new Date(apiBoard.createdAt),
      updatedAt: new Date(apiBoard.updatedAt)
    }
  }

  private handleAPIError(response: Response): FlowBoardError {
    // Transform API errors to FlowBoardError
  }

  private getFromCache(key: string): any | null {
    const cached = this.cache.get(key)
    if (!cached) return null
    
    if (Date.now() - cached.timestamp > this.CACHE_TTL) {
      this.cache.delete(key)
      return null
    }
    
    return cached.data
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, { data, timestamp: Date.now() })
  }

  private invalidateCache(key: string): void {
    this.cache.delete(key)
  }
}
```

## Service Factory Pattern

```typescript
interface ServiceConfig {
  mode: 'localStorage' | 'api'
  userId?: string
  authToken?: string
  apiBaseURL?: string
}

class FlowBoardServiceFactory {
  static create(config: ServiceConfig): FlowBoardService {
    switch (config.mode) {
      case 'localStorage':
        if (!config.userId) {
          throw new Error('userId required for localStorage mode')
        }
        return new LocalStorageFlowBoardService(config.userId)
      
      case 'api':
        if (!config.authToken) {
          throw new Error('authToken required for API mode')
        }
        return new APIFlowBoardService(config.authToken)
      
      default:
        throw new Error(`Unsupported service mode: ${config.mode}`)
    }
  }
}

// Usage in application
const service = FlowBoardServiceFactory.create({
  mode: process.env.NODE_ENV === 'development' ? 'localStorage' : 'api',
  userId: session?.user?.id,
  authToken: session?.accessToken
})
```

## Error Handling Abstraction

### Unified Error Types

```typescript
enum FlowBoardErrorType {
  // Storage errors
  STORAGE_FULL = 'STORAGE_FULL',
  STORAGE_UNAVAILABLE = 'STORAGE_UNAVAILABLE',
  
  // Business logic errors
  BOARD_LIMIT_EXCEEDED = 'BOARD_LIMIT_EXCEEDED',
  BOARD_NOT_FOUND = 'BOARD_NOT_FOUND',
  INVALID_BOARD_DATA = 'INVALID_BOARD_DATA',
  
  // Network/API errors
  NETWORK_ERROR = 'NETWORK_ERROR',
  AUTHENTICATION_ERROR = 'AUTHENTICATION_ERROR',
  AUTHORIZATION_ERROR = 'AUTHORIZATION_ERROR',
  RATE_LIMIT_ERROR = 'RATE_LIMIT_ERROR',
  
  // Client errors
  CLIPBOARD_ACCESS_DENIED = 'CLIPBOARD_ACCESS_DENIED',
  IMAGE_LOAD_FAILED = 'IMAGE_LOAD_FAILED'
}

class FlowBoardError extends Error {
  constructor(
    public type: FlowBoardErrorType,
    message: string,
    public recoverable: boolean = true,
    public retryAfter?: number // For rate limiting
  ) {
    super(message)
    this.name = 'FlowBoardError'
  }
}
```

### Error Transformation

```typescript
// LocalStorage specific errors
private handleStorageError(error: any): FlowBoardError {
  if (error instanceof DOMException) {
    switch (error.name) {
      case 'QuotaExceededError':
        return new FlowBoardError(
          FlowBoardErrorType.STORAGE_FULL,
          'Storage quota exceeded',
          false
        )
      case 'SecurityError':
        return new FlowBoardError(
          FlowBoardErrorType.STORAGE_UNAVAILABLE,
          'Storage access denied (private mode?)',
          false
        )
    }
  }
  
  return new FlowBoardError(
    FlowBoardErrorType.INVALID_BOARD_DATA,
    'Storage operation failed'
  )
}

// API specific errors
private handleAPIError(response: Response): FlowBoardError {
  switch (response.status) {
    case 401:
      return new FlowBoardError(
        FlowBoardErrorType.AUTHENTICATION_ERROR,
        'Authentication required',
        false
      )
    case 403:
      return new FlowBoardError(
        FlowBoardErrorType.AUTHORIZATION_ERROR,
        'Access denied',
        false
      )
    case 404:
      return new FlowBoardError(
        FlowBoardErrorType.BOARD_NOT_FOUND,
        'Board not found'
      )
    case 409:
      return new FlowBoardError(
        FlowBoardErrorType.BOARD_LIMIT_EXCEEDED,
        'Board limit exceeded',
        false
      )
    case 429:
      const retryAfter = parseInt(response.headers.get('Retry-After') || '60')
      return new FlowBoardError(
        FlowBoardErrorType.RATE_LIMIT_ERROR,
        'Rate limit exceeded',
        true,
        retryAfter
      )
    case 500:
    default:
      return new FlowBoardError(
        FlowBoardErrorType.NETWORK_ERROR,
        'Server error occurred'
      )
  }
}
```

## Migration Strategy

### Hybrid Service Implementation

```typescript
class HybridFlowBoardService implements FlowBoardService {
  private localService: LocalStorageFlowBoardService
  private apiService: APIFlowBoardService
  private migrationInProgress = false

  constructor(
    private userId: string,
    private authToken: string
  ) {
    this.localService = new LocalStorageFlowBoardService(userId)
    this.apiService = new APIFlowBoardService(authToken)
  }

  async getBoards(): Promise<FlowBoard[]> {
    try {
      // Try API first
      const apiBoards = await this.apiService.getBoards()
      
      // If API has boards, use them
      if (apiBoards.length > 0) {
        return apiBoards
      }
      
      // Otherwise, check localStorage and migrate if needed
      const localBoards = await this.localService.getBoards()
      if (localBoards.length > 0 && !this.migrationInProgress) {
        this.startMigration(localBoards)
      }
      
      return localBoards
    } catch (apiError) {
      // Fallback to localStorage
      console.warn('API unavailable, using localStorage:', apiError)
      return this.localService.getBoards()
    }
  }

  private async startMigration(localBoards: FlowBoard[]): Promise<void> {
    this.migrationInProgress = true
    
    try {
      for (const board of localBoards) {
        await this.apiService.createBoard(board.name)
        // Update with content
        await this.apiService.saveBoardContent(board.id, board.content)
      }
      
      // Clear localStorage after successful migration
      // this.localService.cleanup()
      
      console.log('Migration completed successfully')
    } catch (error) {
      console.error('Migration failed:', error)
    } finally {
      this.migrationInProgress = false
    }
  }
}
```

## Testing Strategy

### Service Interface Testing

```typescript
// Abstract test suite that works with any service implementation
abstract class FlowBoardServiceTestSuite {
  protected abstract createService(): FlowBoardService
  protected abstract cleanup(): Promise<void>

  async testCreateBoard() {
    const service = this.createService()
    const board = await service.createBoard('Test Board')
    
    expect(board.name).toBe('Test Board')
    expect(board.id).toBeDefined()
    expect(board.content.nodes).toEqual([])
    expect(board.content.edges).toEqual([])
  }

  async testBoardLimit() {
    const service = this.createService()
    
    // Create 10 boards (max limit)
    for (let i = 0; i < 10; i++) {
      await service.createBoard(`Board ${i}`)
    }
    
    // 11th board should fail
    await expect(service.createBoard('Board 11'))
      .rejects.toThrow(FlowBoardError)
  }

  // ... more test methods
}

// Concrete test implementations
class LocalStorageServiceTest extends FlowBoardServiceTestSuite {
  protected createService(): FlowBoardService {
    return new LocalStorageFlowBoardService('test-user')
  }

  protected async cleanup(): Promise<void> {
    localStorage.clear()
  }
}

class APIServiceTest extends FlowBoardServiceTestSuite {
  protected createService(): FlowBoardService {
    return new APIFlowBoardService('test-token')
  }

  protected async cleanup(): Promise<void> {
    // Clean up test data via API
  }
}
```

### Mock Service for Testing

```typescript
class MockFlowBoardService implements FlowBoardService {
  private boards: FlowBoard[] = []
  private nextId = 1

  async getBoards(): Promise<FlowBoard[]> {
    return [...this.boards]
  }

  async createBoard(name: string): Promise<FlowBoard> {
    if (this.boards.length >= 10) {
      throw new FlowBoardError(
        FlowBoardErrorType.BOARD_LIMIT_EXCEEDED,
        'Board limit exceeded'
      )
    }

    const board: FlowBoard = {
      id: `mock-${this.nextId++}`,
      userId: 'mock-user',
      name,
      content: { nodes: [], edges: [], viewport: { x: 0, y: 0, zoom: 1 } },
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.boards.push(board)
    return board
  }

  // ... implement other methods
}
```

## Performance Considerations

### Caching Strategy

```typescript
interface CacheConfig {
  ttl: number // Time to live in milliseconds
  maxSize: number // Maximum cache entries
}

class ServiceCache {
  private cache = new Map<string, CacheEntry>()
  
  constructor(private config: CacheConfig) {}

  get<T>(key: string): T | null {
    const entry = this.cache.get(key)
    if (!entry) return null
    
    if (Date.now() - entry.timestamp > this.config.ttl) {
      this.cache.delete(key)
      return null
    }
    
    return entry.data as T
  }

  set<T>(key: string, data: T): void {
    // Implement LRU eviction if cache is full
    if (this.cache.size >= this.config.maxSize) {
      const oldestKey = this.cache.keys().next().value
      this.cache.delete(oldestKey)
    }
    
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  invalidate(pattern: string): void {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.cache.delete(key)
      }
    }
  }
}
```

### Optimistic Updates

```typescript
class OptimisticUpdateService {
  private pendingUpdates = new Map<string, ReactFlowContent>()
  
  async saveBoardContentOptimistic(
    id: string, 
    content: ReactFlowContent,
    service: FlowBoardService
  ): Promise<void> {
    // Store optimistic update
    this.pendingUpdates.set(id, content)
    
    try {
      await service.saveBoardContent(id, content)
      this.pendingUpdates.delete(id)
    } catch (error) {
      // Handle conflict resolution
      const serverContent = await service.getBoardById(id)
      if (serverContent) {
        // Merge changes or show conflict resolution UI
        this.handleConflict(id, content, serverContent.content)
      }
    }
  }

  private handleConflict(
    id: string,
    localContent: ReactFlowContent,
    serverContent: ReactFlowContent
  ): void {
    // Implement conflict resolution strategy
    // Could be last-write-wins, merge, or user choice
  }
}
```

## Best Practices

### Service Usage Guidelines

1. **Always use the service interface**: Never directly access localStorage or API
2. **Handle errors gracefully**: All service methods can throw FlowBoardError
3. **Use auto-save judiciously**: Don't call it on every keystroke
4. **Cache appropriately**: Balance performance with data freshness
5. **Test with both implementations**: Ensure compatibility

### Migration Guidelines

1. **Gradual migration**: Support both modes during transition
2. **Data validation**: Validate data during migration
3. **Rollback capability**: Ability to revert to localStorage if needed
4. **User communication**: Clear messaging about migration status
5. **Error handling**: Graceful handling of migration failures

### Performance Guidelines

1. **Batch operations**: Group multiple updates when possible
2. **Debounce auto-save**: Prevent excessive save operations
3. **Cache strategically**: Cache frequently accessed data
4. **Lazy loading**: Load board content only when needed
5. **Cleanup resources**: Properly dispose of services and timers