# FlowBoard API Requirements - Phase 2 Backend Integration

## Overview

This document outlines the API requirements for migrating the FlowBoard feature from localStorage (Phase 1) to full backend integration (Phase 2). The API design follows RESTful principles and integrates with the existing authentication system.

## Authentication & Authorization

### Authentication
- Uses existing NextAuth.js authentication system
- JWT tokens for API authentication
- Session-based user identification

### Authorization
- Users can only access their own boards
- Board operations require valid user session
- Rate limiting per user to prevent abuse

## API Endpoints

### Base URL
```
/api/flowboards
```

### Endpoints Specification

#### 1. Get User's Boards
```http
GET /api/flowboards
```

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Query Parameters:**
- `limit` (optional): Number of boards to return (default: 50, max: 100)
- `offset` (optional): Pagination offset (default: 0)
- `sort` (optional): Sort order - `created_asc`, `created_desc`, `updated_asc`, `updated_desc` (default: `updated_desc`)

**Response:**
```json
{
  "success": true,
  "data": {
    "boards": [
      {
        "id": "uuid",
        "userId": "uuid",
        "name": "Board Name",
        "content": {
          "nodes": [],
          "edges": [],
          "viewport": { "x": 0, "y": 0, "zoom": 1 }
        },
        "createdAt": "2024-01-01T00:00:00.000Z",
        "updatedAt": "2024-01-01T00:00:00.000Z"
      }
    ],
    "total": 5,
    "hasMore": false
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication
- `500 Internal Server Error`: Database or server error

#### 2. Get Single Board
```http
GET /api/flowboards/:id
```

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Board Name",
    "content": {
      "nodes": [],
      "edges": [],
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Board not found or not owned by user
- `500 Internal Server Error`: Database or server error

#### 3. Create Board
```http
POST /api/flowboards
```

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "New Board Name"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "New Board Name",
    "content": {
      "nodes": [],
      "edges": [],
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid board name or board limit exceeded
- `401 Unauthorized`: Invalid or missing authentication
- `409 Conflict`: Board limit exceeded (10 boards per user)
- `500 Internal Server Error`: Database or server error

#### 4. Update Board
```http
PUT /api/flowboards/:id
```

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "name": "Updated Board Name",
  "content": {
    "nodes": [],
    "edges": [],
    "viewport": { "x": 0, "y": 0, "zoom": 1 }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "userId": "uuid",
    "name": "Updated Board Name",
    "content": {
      "nodes": [],
      "edges": [],
      "viewport": { "x": 0, "y": 0, "zoom": 1 }
    },
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid request data
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Board not found or not owned by user
- `500 Internal Server Error`: Database or server error

#### 5. Update Board Content Only
```http
PATCH /api/flowboards/:id/content
```

**Headers:**
- `Authorization: Bearer <jwt_token>`
- `Content-Type: application/json`

**Request Body:**
```json
{
  "content": {
    "nodes": [],
    "edges": [],
    "viewport": { "x": 0, "y": 0, "zoom": 1 }
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

**Error Responses:**
- `400 Bad Request`: Invalid content data
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Board not found or not owned by user
- `500 Internal Server Error`: Database or server error

#### 6. Delete Board
```http
DELETE /api/flowboards/:id
```

**Headers:**
- `Authorization: Bearer <jwt_token>`

**Response:**
```json
{
  "success": true,
  "message": "Board deleted successfully"
}
```

**Error Responses:**
- `401 Unauthorized`: Invalid or missing authentication
- `404 Not Found`: Board not found or not owned by user
- `500 Internal Server Error`: Database or server error

## Database Schema

### FlowBoards Table
```sql
CREATE TABLE flowboards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  content JSONB NOT NULL DEFAULT '{"nodes": [], "edges": [], "viewport": {"x": 0, "y": 0, "zoom": 1}}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT flowboards_name_length CHECK (char_length(name) >= 1 AND char_length(name) <= 255)
);

-- Indexes for performance
CREATE INDEX idx_flowboards_user_id ON flowboards(user_id);
CREATE INDEX idx_flowboards_updated_at ON flowboards(updated_at DESC);
CREATE INDEX idx_flowboards_user_updated ON flowboards(user_id, updated_at DESC);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_flowboards_updated_at 
    BEFORE UPDATE ON flowboards 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();
```

### Board Limit Constraint
```sql
-- Function to check board limit
CREATE OR REPLACE FUNCTION check_board_limit()
RETURNS TRIGGER AS $$
BEGIN
    IF (SELECT COUNT(*) FROM flowboards WHERE user_id = NEW.user_id) >= 10 THEN
        RAISE EXCEPTION 'User cannot have more than 10 boards';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to enforce board limit
CREATE TRIGGER enforce_board_limit
    BEFORE INSERT ON flowboards
    FOR EACH ROW
    EXECUTE FUNCTION check_board_limit();
```

## Data Validation

### Server-Side Validation Rules

#### Board Name
- Required field
- String type
- Length: 1-255 characters
- Trimmed of leading/trailing whitespace

#### Board Content
- Must be valid JSON
- Must contain `nodes`, `edges`, and `viewport` properties
- `nodes` must be an array of valid node objects
- `edges` must be an array of valid edge objects
- `viewport` must contain `x`, `y`, and `zoom` numeric properties

#### Node Validation
```typescript
interface NodeValidation {
  id: string // Required, unique within board
  type: 'text' | 'image' | 'shape' // Required, enum
  position: { x: number, y: number } // Required
  data: {
    label?: string // Optional, max 1000 chars
    content?: string // Optional, max 10000 chars
    imageUrl?: string // Optional, valid URL or base64
    backgroundColor?: string // Optional, valid CSS color
    borderColor?: string // Optional, valid CSS color
    textColor?: string // Optional, valid CSS color
  }
}
```

#### Edge Validation
```typescript
interface EdgeValidation {
  id: string // Required, unique within board
  source: string // Required, must reference existing node
  target: string // Required, must reference existing node
  type?: string // Optional
  style?: object // Optional, valid CSS properties
  animated?: boolean // Optional
  label?: string // Optional, max 500 chars
}
```

## Error Handling

### Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human readable error message",
    "details": {} // Optional additional error details
  }
}
```

### Error Codes
- `INVALID_REQUEST`: Malformed request data
- `BOARD_NOT_FOUND`: Requested board doesn't exist
- `BOARD_LIMIT_EXCEEDED`: User has reached maximum board limit
- `INVALID_BOARD_NAME`: Board name validation failed
- `INVALID_BOARD_CONTENT`: Board content validation failed
- `UNAUTHORIZED`: Authentication required or failed
- `FORBIDDEN`: User doesn't have access to resource
- `INTERNAL_ERROR`: Server or database error

## Rate Limiting

### Limits per User
- **GET requests**: 100 requests per minute
- **POST/PUT/PATCH requests**: 30 requests per minute
- **DELETE requests**: 10 requests per minute

### Implementation
- Use Redis for rate limiting storage
- Return `429 Too Many Requests` when limits exceeded
- Include rate limit headers in responses:
  ```
  X-RateLimit-Limit: 100
  X-RateLimit-Remaining: 95
  X-RateLimit-Reset: 1640995200
  ```

## Performance Considerations

### Caching Strategy
- Cache user's board list for 5 minutes
- Cache individual board content for 10 minutes
- Invalidate cache on board updates
- Use Redis for caching layer

### Database Optimization
- Use JSONB for content storage (PostgreSQL)
- Index on user_id and updated_at for efficient queries
- Consider partitioning by user_id for large datasets
- Use connection pooling for database connections

### Content Size Limits
- Maximum board content size: 1MB
- Maximum image size in base64: 500KB
- Maximum number of nodes per board: 1000
- Maximum number of edges per board: 2000

## Security Considerations

### Input Sanitization
- Sanitize all text inputs to prevent XSS
- Validate image data and file types
- Limit content size to prevent DoS attacks
- Use parameterized queries to prevent SQL injection

### Data Protection
- Encrypt sensitive data at rest
- Use HTTPS for all API communications
- Implement CORS policies
- Log security events for monitoring

### Access Control
- Verify user ownership for all board operations
- Implement proper session management
- Use secure JWT tokens with expiration
- Audit trail for board modifications

## Migration Considerations

### Data Migration from localStorage
- Provide migration endpoint: `POST /api/flowboards/migrate`
- Accept localStorage data format
- Validate and transform data during migration
- Handle migration conflicts and errors gracefully
- Provide migration status and progress feedback

### Backward Compatibility
- Support both localStorage and API modes during transition
- Graceful fallback to localStorage if API unavailable
- Clear migration path and user communication
- Data export functionality for user backup

## Monitoring and Logging

### Metrics to Track
- API response times
- Error rates by endpoint
- Board creation/update frequency
- Storage usage per user
- Migration success rates

### Logging Requirements
- Request/response logging for debugging
- Error logging with stack traces
- Security event logging
- Performance metrics logging
- User activity logging (anonymized)

## Testing Requirements

### API Testing
- Unit tests for all endpoints
- Integration tests with database
- Load testing for performance
- Security testing for vulnerabilities
- Migration testing with real data

### Test Data
- Sample board data for testing
- Edge cases and error scenarios
- Performance test datasets
- Migration test scenarios