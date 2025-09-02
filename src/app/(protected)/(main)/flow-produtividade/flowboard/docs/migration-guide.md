# FlowBoard Phase 2 Migration Guide

## Overview

This guide provides comprehensive instructions for migrating the FlowBoard feature from Phase 1 (localStorage) to Phase 2 (backend API). The migration process is designed to be seamless and safe, with multiple safeguards to prevent data loss.

## Migration Strategy

### Approach
The migration follows a **gradual transition** approach:
1. **Dual Mode Operation**: Support both localStorage and API simultaneously
2. **Data Export/Import**: Provide tools for manual data migration
3. **Automatic Migration**: Seamless background migration when API is available
4. **Fallback Support**: Graceful degradation to localStorage if API fails

### Timeline
- **Phase 1**: localStorage-only implementation (Current)
- **Phase 2a**: Dual mode with migration tools (Transition)
- **Phase 2b**: API-primary with localStorage fallback (Target)
- **Phase 3**: API-only implementation (Future)

## Pre-Migration Checklist

### Backend Requirements
- [ ] Database schema created and migrated
- [ ] API endpoints implemented and tested
- [ ] Authentication integration completed
- [ ] Rate limiting configured
- [ ] Error handling implemented
- [ ] Performance optimization applied

### Frontend Requirements
- [ ] API service implementation completed
- [ ] Service abstraction layer tested
- [ ] Migration utilities implemented
- [ ] Error boundaries updated
- [ ] User interface for migration ready

### Testing Requirements
- [ ] Unit tests for API service
- [ ] Integration tests for migration
- [ ] End-to-end tests for dual mode
- [ ] Performance tests completed
- [ ] Security tests passed

## Migration Process

### Step 1: Prepare Backend Infrastructure

#### Database Setup
```sql
-- Create flowboards table
CREATE TABLE flowboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content JSONB NOT NULL DEFAULT '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT flowboards_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255)
);

-- Create indexes
CREATE INDEX idx_flowboards_user_id ON flowboards(user_id);
CREATE INDEX idx_flowboards_updated_at ON flowboards(updated_at DESC);
CREATE INDEX idx_flowboards_user_updated ON flowboards(user_id, updated_at DESC);

-- Create triggers for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_flowboards_updated_at 
    BEFORE UPDATE ON flowboards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Create board limit constraint
CREATE OR REPLACE FUNCTION check_board_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM flowboards WHERE user_id = NEW.user_id) >= 10 THEN
        RAISE EXCEPTION 'User cannot have more than 10 boards';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER enforce_board_limit
    BEFORE INSERT ON flowboards
    FOR EACH ROW
    EXECUTE FUNCTION check_board_limit();
```

#### API Implementation
```typescript
// src/app/api/flowboards/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/auth'
import { FlowBoardService } from '@/lib/services/flowboard-service'

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const service = new FlowBoardService(session.user.id)
    const boards = await service.getBoards()

    return NextResponse.json({
      success: true,
      data: { boards }
    })
  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { name } = await request.json()
    if (!name || typeof name !== 'string') {
      return NextResponse.json(
        { error: 'Invalid board name' },
        { status: 400 }
      )
    }

    const service = new FlowBoardService(session.user.id)
    const board = await service.createBoard(name)

    return NextResponse.json({
      success: true,
      data: board
    })
  } catch (error) {
    console.error('API Error:', error)
    
    if (error.message.includes('board limit')) {
      return NextResponse.json(
        { error: 'Board limit exceeded' },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

### Step 2: Implement Service Abstraction

#### Service Factory
```typescript
// src/app/(protected)/(main)/flow-produtividade/flowboard/services/service-factory.ts
import { FlowBoardService } from '../types/flowboard.types'
import { LocalStorageFlowBoardService } from './localStorage-flowboard-service'
import { APIFlowBoardService } from './api-flowboard-service'

interface ServiceConfig {
  mode: 'localStorage' | 'api' | 'hybrid'
  userId: string
  authToken?: string
}

export class FlowBoardServiceFactory {
  static create(config: ServiceConfig): FlowBoardService {
    switch (config.mode) {
      case 'localStorage':
        return new LocalStorageFlowBoardService(config.userId)
      
      case 'api':
        if (!config.authToken) {
          throw new Error('Auth token required for API mode')
        }
        return new APIFlowBoardService(config.authToken)
      
      case 'hybrid':
        return new HybridFlowBoardService(config.userId, config.authToken)
      
      default:
        throw new Error(`Unsupported service mode: ${config.mode}`)
    }
  }
}
```

#### API Service Implementation
```typescript
// src/app/(protected)/(main)/flow-produtividade/flowboard/services/api-flowboard-service.ts
import { FlowBoard, ReactFlowContent, FlowBoardService, FlowBoardError, FlowBoardErrorType } from '../types/flowboard.types'

export class APIFlowBoardService implements FlowBoardService {
  private readonly baseURL = '/api/flowboards'
  private cache = new Map<string, { data: any, timestamp: number }>()
  private readonly CACHE_TTL = 5 * 60 * 1000 // 5 minutes

  constructor(private authToken: string) {}

  async getBoards(): Promise<FlowBoard[]> {
    const response = await this.fetch(this.baseURL)
    const result = await response.json()
    
    return result.data.boards.map(this.transformAPIBoard)
  }

  async createBoard(name: string): Promise<FlowBoard> {
    const response = await this.fetch(this.baseURL, {
      method: 'POST',
      body: JSON.stringify({ name })
    })
    
    const result = await response.json()
    return this.transformAPIBoard(result.data)
  }

  async updateBoard(id: string, updates: Partial<FlowBoard>): Promise<FlowBoard> {
    const response = await this.fetch(`${this.baseURL}/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    })
    
    const result = await response.json()
    return this.transformAPIBoard(result.data)
  }

  async deleteBoard(id: string): Promise<void> {
    await this.fetch(`${this.baseURL}/${id}`, {
      method: 'DELETE'
    })
  }

  async saveBoardContent(id: string, content: ReactFlowContent): Promise<void> {
    await this.fetch(`${this.baseURL}/${id}/content`, {
      method: 'PATCH',
      body: JSON.stringify({ content })
    })
  }

  private async fetch(url: string, options: RequestInit = {}): Promise<Response> {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
        ...options.headers
      }
    })

    if (!response.ok) {
      throw this.handleAPIError(response)
    }

    return response
  }

  private transformAPIBoard(apiBoard: any): FlowBoard {
    return {
      ...apiBoard,
      createdAt: new Date(apiBoard.createdAt),
      updatedAt: new Date(apiBoard.updatedAt)
    }
  }

  private handleAPIError(response: Response): FlowBoardError {
    switch (response.status) {
      case 401:
        return new FlowBoardError(FlowBoardErrorType.AUTHENTICATION_ERROR, 'Authentication required', false)
      case 404:
        return new FlowBoardError(FlowBoardErrorType.BOARD_NOT_FOUND, 'Board not found')
      case 409:
        return new FlowBoardError(FlowBoardErrorType.BOARD_LIMIT_EXCEEDED, 'Board limit exceeded', false)
      default:
        return new FlowBoardError(FlowBoardErrorType.NETWORK_ERROR, 'Server error occurred')
    }
  }
}
```

### Step 3: Update Store Configuration

#### Store Update
```typescript
// src/app/(protected)/(main)/flow-produtividade/flowboard/hooks/use-flowboard-store.ts
import { create } from 'zustand'
import { FlowBoardServiceFactory } from '../services/service-factory'

interface FlowBoardStoreState {
  // ... existing state
  migrationMode: 'localStorage' | 'api' | 'hybrid'
  setMigrationMode: (mode: 'localStorage' | 'api' | 'hybrid') => void
}

export const useFlowBoardStore = create<FlowBoardStoreState>((set, get) => ({
  // ... existing state
  migrationMode: 'localStorage', // Start with localStorage
  
  setMigrationMode: (mode) => {
    set({ migrationMode: mode })
    
    // Reinitialize service with new mode
    const { userId, authToken } = get()
    const service = FlowBoardServiceFactory.create({
      mode,
      userId,
      authToken
    })
    
    set({ service })
  },

  // ... rest of store implementation
}))
```

### Step 4: Deploy Migration Tools

#### Migration UI Integration
```typescript
// Add to FlowBoard page
import { MigrationPanel } from './components/migration-panel'

const FlowBoardPage = () => {
  const { migrationMode, setMigrationMode } = useFlowBoardStore()
  
  return (
    <div>
      {/* Existing FlowBoard UI */}
      
      {/* Migration Panel (show during transition period) */}
      {process.env.NODE_ENV === 'development' && (
        <MigrationPanel
          userId={session.user.id}
          localStorageService={localStorageService}
          apiService={apiService}
          onMigrationComplete={() => setMigrationMode('api')}
        />
      )}
    </div>
  )
}
```

### Step 5: Execute Migration

#### Automatic Migration
```typescript
// src/app/(protected)/(main)/flow-produtividade/flowboard/hooks/use-auto-migration.ts
import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { FlowBoardDataMigration } from '../utils/data-migration'

export const useAutoMigration = () => {
  const { data: session } = useSession()
  const [migrationStatus, setMigrationStatus] = useState<'idle' | 'checking' | 'migrating' | 'completed'>('idle')

  useEffect(() => {
    if (!session?.user?.id) return

    const checkAndMigrate = async () => {
      setMigrationStatus('checking')
      
      try {
        // Check if user has localStorage data
        const exportData = FlowBoardDataMigration.exportLocalStorageData(session.user.id)
        
        if (exportData.boards.length === 0) {
          setMigrationStatus('completed')
          return
        }

        // Check if API has data
        const apiService = new APIFlowBoardService(session.accessToken)
        const apiBoards = await apiService.getBoards()
        
        if (apiBoards.length > 0) {
          // User already has API data, don't auto-migrate
          setMigrationStatus('completed')
          return
        }

        // Start automatic migration
        setMigrationStatus('migrating')
        
        // Implement migration logic here
        // ...
        
        setMigrationStatus('completed')
      } catch (error) {
        console.error('Auto-migration failed:', error)
        setMigrationStatus('idle')
      }
    }

    checkAndMigrate()
  }, [session])

  return { migrationStatus }
}
```

## Testing Strategy

### Unit Tests
```typescript
// Test service abstraction
describe('FlowBoardServiceFactory', () => {
  test('creates localStorage service', () => {
    const service = FlowBoardServiceFactory.create({
      mode: 'localStorage',
      userId: 'test-user'
    })
    expect(service).toBeInstanceOf(LocalStorageFlowBoardService)
  })

  test('creates API service', () => {
    const service = FlowBoardServiceFactory.create({
      mode: 'api',
      userId: 'test-user',
      authToken: 'test-token'
    })
    expect(service).toBeInstanceOf(APIFlowBoardService)
  })
})

// Test migration utilities
describe('FlowBoardDataMigration', () => {
  test('exports localStorage data', () => {
    // Mock localStorage data
    const mockData = { /* ... */ }
    localStorage.setItem('flowboards', JSON.stringify(mockData))
    
    const exportData = FlowBoardDataMigration.exportLocalStorageData('test-user')
    expect(exportData.boards).toHaveLength(mockData.boards.length)
  })

  test('transforms board for API', () => {
    const localBoard = { /* ... */ }
    const apiBoard = FlowBoardDataMigration.transformBoardForAPI(localBoard)
    expect(apiBoard.name).toBe(localBoard.name)
  })
})
```

### Integration Tests
```typescript
describe('Migration Integration', () => {
  test('migrates data from localStorage to API', async () => {
    // Setup localStorage data
    const localService = new LocalStorageFlowBoardService('test-user')
    await localService.createBoard('Test Board')
    
    // Export data
    const exportData = FlowBoardDataMigration.exportLocalStorageData('test-user')
    
    // Migrate to API
    const apiService = new APIFlowBoardService('test-token')
    // ... migration logic
    
    // Verify migration
    const apiBoards = await apiService.getBoards()
    expect(apiBoards).toHaveLength(1)
    expect(apiBoards[0].name).toBe('Test Board')
  })
})
```

## Rollback Strategy

### Rollback Triggers
- API service unavailable for extended period
- Data corruption detected in API
- Performance issues with API
- User requests rollback to localStorage

### Rollback Process
1. **Immediate Fallback**: Switch service mode to localStorage
2. **Data Recovery**: Restore from export files if needed
3. **User Notification**: Inform users about the rollback
4. **Issue Resolution**: Fix API issues before re-enabling

### Rollback Implementation
```typescript
// Emergency rollback function
const rollbackToLocalStorage = async () => {
  try {
    // Switch service mode
    setMigrationMode('localStorage')
    
    // Restore data from backup if needed
    const backupData = await loadBackupData()
    if (backupData) {
      await restoreLocalStorageData(backupData)
    }
    
    // Notify user
    showNotification('Switched to offline mode due to server issues')
  } catch (error) {
    console.error('Rollback failed:', error)
  }
}
```

## Monitoring and Alerts

### Metrics to Monitor
- Migration success rate
- API response times
- Error rates by endpoint
- User adoption of API mode
- Storage usage patterns

### Alert Conditions
- Migration failure rate > 5%
- API response time > 2 seconds
- Error rate > 1%
- Storage quota warnings

### Monitoring Implementation
```typescript
// Migration metrics tracking
const trackMigrationMetrics = (status: MigrationStatus) => {
  // Send metrics to monitoring service
  analytics.track('flowboard_migration', {
    status: status.status,
    totalBoards: status.totalBoards,
    migratedBoards: status.migratedBoards,
    failedBoards: status.failedBoards,
    duration: status.completedAt - status.startedAt
  })
}
```

## Post-Migration Tasks

### Cleanup
- [ ] Remove localStorage migration code (after transition period)
- [ ] Update documentation
- [ ] Remove development-only migration UI
- [ ] Archive migration utilities

### Optimization
- [ ] Implement caching strategies
- [ ] Add real-time sync capabilities
- [ ] Optimize database queries
- [ ] Implement background sync

### User Communication
- [ ] Announce successful migration
- [ ] Provide new feature documentation
- [ ] Collect user feedback
- [ ] Address any issues promptly

## Troubleshooting

### Common Issues

#### Migration Fails
**Symptoms**: Migration stops with errors
**Causes**: Network issues, API errors, data validation failures
**Solutions**: 
- Check network connectivity
- Verify API service status
- Validate export data format
- Retry migration with smaller batches

#### Data Loss
**Symptoms**: Boards missing after migration
**Causes**: Export failure, import errors, cleanup too early
**Solutions**:
- Restore from export backup
- Check localStorage for remaining data
- Contact support for data recovery

#### Performance Issues
**Symptoms**: Slow loading, timeouts
**Causes**: Large board data, network latency, server overload
**Solutions**:
- Implement pagination
- Optimize board content
- Use caching strategies
- Scale server resources

### Support Procedures
1. **Data Recovery**: Use export files to restore user data
2. **Rollback Process**: Switch back to localStorage if needed
3. **Issue Escalation**: Contact development team for complex issues
4. **User Communication**: Keep users informed of status and resolution

## Success Criteria

### Technical Metrics
- [ ] 95%+ migration success rate
- [ ] <2 second API response times
- [ ] <1% error rate
- [ ] Zero data loss incidents

### User Experience Metrics
- [ ] Seamless transition for users
- [ ] No disruption to workflow
- [ ] Positive user feedback
- [ ] Increased feature adoption

### Business Metrics
- [ ] Reduced support tickets
- [ ] Improved system reliability
- [ ] Enhanced scalability
- [ ] Foundation for future features

## Conclusion

The Phase 2 migration represents a significant step forward in the FlowBoard feature's evolution. By following this comprehensive guide, the migration can be executed safely and efficiently, providing users with a more robust and scalable solution while maintaining the familiar user experience they expect.

The key to success is thorough preparation, careful testing, and gradual rollout with proper monitoring and rollback capabilities. With these safeguards in place, the migration will enhance the FlowBoard feature's capabilities and set the foundation for future enhancements.