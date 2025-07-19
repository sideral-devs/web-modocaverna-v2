# API Endpoints & Backend Integrations Documentation

## 📋 Overview

This document provides a comprehensive mapping of all API endpoints and backend integrations used in the Modo Caverna application. The system follows RESTful conventions with standardized patterns for CRUD operations.

## 🔧 Base Configuration

### API Client Setup
```typescript
// Base API configuration
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, // https://api.modocaverna.com/api
  withCredentials: true,
})

// Authentication token management
api.defaults.headers.Authorization = `Bearer ${token}`
```

### Standard Response Patterns
- **Success**: HTTP 200/201 with data payload
- **Error**: HTTP 4xx/5xx with error message
- **Authentication**: Bearer token in Authorization header
- **CORS**: Credentials included for cross-origin requests

---

## 🔐 Authentication & User Management

### Authentication Endpoints
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `POST` | `/auth/logout` | User logout | `api.post('/auth/logout')` |
| `GET` | `/auth/user` | Get current user data | `api.get('/auth/user')` |

### User Profile & Settings
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/perfil-comunidade/user` | Get user community profile | Community features |
| `GET` | `/configuracoes/find` | Get user configurations | Google OAuth settings |
| `PUT` | `/configuracoes/update` | Update user configurations | OAuth token management |
| `POST` | `/users/onboarding/videos/watch` | Mark onboarding video as watched | Tour completion |

---

## 🏋️ Exercise & Fitness Management

### Workout Management (Fichas de Treinos)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/fichas-de-treinos/find` | List all workouts | - |
| `GET` | `/fichas-de-treinos/show/{id}` | Get specific workout | - |
| `POST` | `/fichas-de-treinos/store` | Create new workout | `CreateWorkoutRequest` |
| `PUT` | `/fichas-de-treinos/update/{id}` | Update workout | `UpdateWorkoutRequest` |
| `DELETE` | `/fichas-de-treinos/destroy/{id}` | Delete workout | - |
| `DELETE` | `/fichas-de-treinos/{workoutId}/exercicios/{exerciseId}` | Delete specific exercise | - |
| `PUT` | `/fichas-de-treinos/{workoutId}/reorder` | Reorder exercises | `{ exerciseIndices: number[] }` |

### Shape Registration (Body Measurements)
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/registro-de-shape/find` | List shape registrations | - |
| `GET` | `/registro-de-shape/show/{id}` | Get specific registration | - |
| `POST` | `/registro-de-shape/store` | Create shape registration | `CreateShapeRegistrationRequest` |
| `PUT` | `/registro-de-shape/update/{id}` | Update registration | `Partial<ShapeRegistration>` |
| `DELETE` | `/registro-de-shape/destroy/{id}` | Delete registration | - |
| `POST` | `/registro-de-shape/skip/{id}` | Skip registration | `{ is_skipped: boolean }` |

---

## 🍽️ Meal Planning & Nutrition

### Meal Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/refeicoes/find` | List all meals | - |
| `GET` | `/refeicoes/show/{id}` | Get specific meal | - |
| `POST` | `/refeicoes/store` | Create new meal | `CreateMealRequest` |
| `PUT` | `/refeicoes/update/{id}` | Update meal | `UpdateMealRequest` |
| `DELETE` | `/refeicoes/destroy/{id}` | Delete meal | - |

---

## 📅 Calendar & Events

### Event Management
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/compromissos/find` | List calendar events | Google Calendar integration |

---

## 👥 Community & Social Features

### Posts & Content
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/posts/top-trending` | Get trending posts | - |
| `POST` | `/posts/store` | Create new post | `{ content, category, midia? }` |
| `POST` | `/posts/store/comments` | Create comment/reply | `{ content, category, post_id }` |
| `PUT` | `/posts/update/{id}` | Update post | `{ content, category, midia? }` |
| `DELETE` | `/posts/destroy/{id}` | Delete post | - |

### Post Interactions
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/post-interactions/store` | Create interaction (like/view) | `{ post_id, interaction }` |
| `DELETE` | `/post-interactions/destroy/{postId}/LIKE` | Remove like | - |

### Notifications
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/post-notifications/not-read/user` | Get unread notifications count | Community notifications |

---

## 🎯 Goals & Dream Board

### Goal Management
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `GET` | `/metas/find` | List user goals | - |
| `POST` | `/metas/upload` | Upload goal image | `{ ano, foto }` |
| `PUT` | `/metas/update-photo-setup/{id}` | Update photo setup | `{ foto: { foto, x, y, width, height, rotation } }` |
| `DELETE` | `/metas/delete-photo/{id}` | Delete single photo | - |
| `DELETE` | `/metas/delete-all-photos` | Delete multiple photos | `{ fotos: number[] }` |

---

## 📊 Analytics & Productivity

### Productivity Tracking
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/pomodoro/chart?period=week` | Get productivity chart data | Dashboard analytics |

### Financial Tracking
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/datatables/financeiro-transacoes` | Get financial transactions | Expense tracking |

---

## 🎵 Media & Content

### Music & Playlists
| Method | Endpoint | Description | Usage |
|--------|----------|-------------|-------|
| `GET` | `/playlists/find` | List user playlists | Music player |
| `GET` | `/playlists/{id}/musics` | Get playlist songs | Music player |

### Notes & Documentation
| Method | Endpoint | Description | Request Body |
|--------|----------|-------------|--------------|
| `POST` | `/notas/upload/{documentId}` | Save note content | `{ descricao, anotacao }` |

---

## 🔄 Standardized Patterns

### 1. CRUD Operations Pattern
```typescript
// Standard CRUD endpoints follow this pattern:
GET    /{resource}/find           // List all
GET    /{resource}/show/{id}      // Get by ID
POST   /{resource}/store          // Create new
PUT    /{resource}/update/{id}    // Update existing
DELETE /{resource}/destroy/{id}   // Delete by ID
```

### 2. Authentication Pattern
```typescript
// All protected endpoints require Bearer token
headers: { 
  Authorization: `Bearer ${token}` 
}
```

### 3. Error Handling Pattern
```typescript
try {
  const response = await api.get('/endpoint')
  return response.data
} catch (error) {
  // Handle error appropriately
  console.error('API Error:', error)
  throw error
}
```

### 4. Query Invalidation Pattern
```typescript
// After mutations, invalidate related queries
queryClient.invalidateQueries({ queryKey: ['resource-name'] })
```

---

## 🔧 Key Backend Integrations

### 1. Google OAuth Integration
- **Scopes**: `userinfo.email`, `userinfo.profile`, `calendar`
- **Token Management**: Automatic refresh with refresh tokens
- **Calendar Access**: Full Google Calendar integration

### 2. File Upload System
- **Image Processing**: HTML2Canvas for screenshots
- **File Storage**: AWS S3 integration
- **Photo Management**: Drag & drop with positioning

### 3. Real-time Features
- **Notifications**: Post interaction notifications
- **Live Updates**: Query invalidation for real-time data

### 4. Analytics Integration
- **Google Analytics**: GA4 tracking
- **Productivity Metrics**: Pomodoro timer data
- **User Behavior**: Interaction tracking

---

## 📱 Mobile & Responsive Considerations

### API Response Optimization
- Paginated responses for large datasets
- Compressed image formats
- Minimal data transfer for mobile

### Offline Capabilities
- TanStack Query caching
- Optimistic updates
- Background sync when online

---

## 🔒 Security Considerations

### Authentication Security
- JWT tokens with expiration
- Refresh token rotation
- Secure cookie handling

### Data Protection
- Input validation on all endpoints
- SQL injection prevention
- XSS protection

### API Rate Limiting
- Request throttling
- User-based limits
- Abuse prevention

---

## 🚀 Performance Optimizations

### Caching Strategy
```typescript
// Query caching with TanStack Query
const { data } = useQuery({
  queryKey: ['resource', id],
  queryFn: () => fetchResource(id),
  staleTime: 5 * 60 * 1000, // 5 minutes
})
```

### Batch Operations
- Multiple photo uploads
- Bulk exercise reordering
- Batch notification marking

### Lazy Loading
- Paginated content loading
- Image lazy loading
- Component code splitting

---

## 📈 Monitoring & Logging

### API Monitoring
- Response time tracking
- Error rate monitoring
- Usage analytics

### Debug Information
- Request/response logging
- Error stack traces
- User session tracking

---

This documentation serves as a comprehensive reference for all backend integrations in the Modo Caverna application. It should be updated as new endpoints are added or existing ones are modified.