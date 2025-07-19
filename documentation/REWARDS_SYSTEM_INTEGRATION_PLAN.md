# Rewards System Integration Plan

## Current System Analysis

### Existing Infrastructure ✅
- **User Model**: Already has `score`, `level`, `login_streak` fields
- **Points System**: 55 different activities across 9 sections (4,855 total possible points)
- **Transformation Levels**: 7-level system defined with proper progression
- **Database**: Points are already being tracked and stored
- **API Structure**: Basic user data endpoints exist

### Points Distribution Reality Check

Based on the CSV analysis, here's the realistic point distribution:

#### Level Mapping (Updated for Real Usage)
1. **O Despertar** (0-500 points) - New users, basic engagement
2. **A Ruptura** (501-1,200 points) - Regular users with some challenges
3. **O Chamado** (1,201-2,000 points) - Active community members
4. **A Descoberta** (2,001-3,500 points) - Challenge completers, course finishers
5. **O Discernimento** (3,501-5,000 points) - Power users, multiple challenges
6. **A Ascensão** (5,001-8,000 points) - Long-term consistent users
7. **A Lenda** (8,000+ points) - Elite users, platform ambassadors

### Current Point Sources (Active)
- **Daily Login**: 1 point/day (365 max/year)
- **Challenge System**: 640 points potential
- **Community**: 1,365 points potential (highest engagement)
- **Content**: 650 points from courses
- **Productivity**: 250 points from checklists (Pomodoro disabled)
- **Financial Tracking**: 420 points
- **Profile/Account**: 629 points

### Missing/Disabled Features
- **Pomodoro Sessions**: 500 points (disabled)
- **Goals System**: 95 points (disabled)
- **Meal Planning**: Not connected to points
- **Exercise Logging**: Not connected to points
- **Note Taking**: Not connected to points

## Implementation Priority

### Phase 1: Ranking Widget (Immediate)
Focus on creating the ranking widget using existing data:

1. **API Endpoints**:
   - `GET /ranking/leaderboard` - Top users by score
   - `GET /ranking/user/{id}` - User's ranking position
   - `GET /user/level-progress` - Current level and progress

2. **Widget Components**:
   - Leaderboard display
   - User position indicator
   - Level progression bar
   - Recent achievements

3. **Data Sources**:
   - User.score (total points)
   - User.level (current level)
   - User.login_streak (streak counter)
   - Challenge completion data
   - Community engagement metrics

### Phase 2: Enhanced Rewards (Short-term)
1. Enable disabled point activities
2. Add Cave Store integration
3. Implement level-based benefits

### Phase 3: Capitão Caverna Integration (Medium-term)
1. Contextual messaging system
2. Video content integration
3. Personalized guidance

## Ranking Widget Specifications

### Data Structure
```typescript
interface RankingData {
  leaderboard: {
    userId: string
    username: string
    avatar?: string
    totalPoints: number
    currentLevel: number
    levelName: string
    rank: number
    trend: 'up' | 'down' | 'stable'
  }[]
  currentUser: {
    rank: number
    totalPoints: number
    currentLevel: number
    levelName: string
    pointsToNextLevel: number
    progressPercentage: number
    recentAchievements: string[]
  }
  lastUpdated: Date
}
```

### API Endpoints Needed
```typescript
// Get top 10 users for leaderboard
GET /api/ranking/leaderboard?limit=10

// Get user's ranking position
GET /api/ranking/user/{userId}

// Get user's level progression
GET /api/user/{userId}/level-progress
```

### Widget Features
1. **Top 10 Leaderboard**
   - User avatar/name
   - Total points
   - Current level badge
   - Rank position

2. **Current User Section**
   - Your rank (if not in top 10)
   - Progress to next level
   - Recent achievements
   - Level benefits

3. **Interactive Elements**
   - Click to view level details
   - Hover for user stats
   - Refresh button
   - "View Full Ranking" link

### Cave Store Integration Points
Based on existing system, users should get:

- **Level 1-2**: 5-10% discount
- **Level 3-4**: 15-20% discount  
- **Level 5-6**: 25-30% discount
- **Level 7**: 35-40% discount + exclusive access

### Real User Behavior Insights

From the CSV data, we can see:
- **Community engagement** is the highest point generator (28% of total)
- **Challenge system** is well-utilized (13% of total)
- **Content consumption** is significant (13% of total)
- **Daily activities** provide steady progression

This suggests the ranking widget should emphasize:
1. Community contributions
2. Challenge completions
3. Learning achievements
4. Consistency rewards

## Next Steps

### Immediate (This Sprint)
1. Create ranking API endpoints
2. Build ranking widget component
3. Integrate with Área de Benefícios
4. Test with real user data

### Short-term (Next Sprint)
1. Enable disabled point activities
2. Add level-up notifications
3. Implement basic rewards system

### Medium-term (Following Sprints)
1. Capitão Caverna integration
2. Advanced analytics
3. Social sharing features

This plan leverages the existing robust points system while adding the gamification layer that will motivate users and increase engagement across all platform features.