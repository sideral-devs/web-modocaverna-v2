'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { TRANSFORMATION_LEVELS } from '@/constants/transformation-levels'
import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus, Trophy, Crown, Star } from 'lucide-react'
import Image from 'next/image'

interface RankedUser {
  userId: string
  username: string
  avatar?: string
  totalPoints: number
  currentLevel: number
  rank: number
  trend: 'up' | 'down' | 'stable'
}

interface UserRanking {
  rank: number
  totalPoints: number
  currentLevel: number
  pointsToNextLevel: number
  progressPercentage: number
  recentAchievements: string[]
}

interface RankingWidgetProps {
  topUsers: RankedUser[]
  currentUser: UserRanking
  lastUpdated: Date
}

// Mock data for demonstration
const mockTopUsers: RankedUser[] = [
  {
    userId: '1',
    username: 'CavernaMaster',
    avatar: '/images/members-area/iuri.jpg',
    totalPoints: 8750,
    currentLevel: 7,
    rank: 1,
    trend: 'stable'
  },
  {
    userId: '2', 
    username: 'TransformadorAlpha',
    totalPoints: 6420,
    currentLevel: 6,
    rank: 2,
    trend: 'up'
  },
  {
    userId: '3',
    username: 'FocoLaser',
    totalPoints: 5890,
    currentLevel: 6,
    rank: 3,
    trend: 'down'
  },
  {
    userId: '4',
    username: 'DespertarTotal',
    totalPoints: 4320,
    currentLevel: 5,
    rank: 4,
    trend: 'up'
  },
  {
    userId: '5',
    username: 'RupturaVital',
    totalPoints: 3850,
    currentLevel: 5,
    rank: 5,
    trend: 'stable'
  }
]

const mockCurrentUser: UserRanking = {
  rank: 47,
  totalPoints: 1850,
  currentLevel: 3,
  pointsToNextLevel: 150,
  progressPercentage: 92.5,
  recentAchievements: ['Streak de 15 dias', 'Desafio Completado', 'Top 5 Comunidade']
}

function getLevelInfo(levelId: number) {
  return TRANSFORMATION_LEVELS.find(level => level.id === levelId) || TRANSFORMATION_LEVELS[0]
}

function getTrendIcon(trend: 'up' | 'down' | 'stable') {
  switch (trend) {
    case 'up':
      return <TrendingUp className="w-3 h-3 text-green-500" />
    case 'down':
      return <TrendingDown className="w-3 h-3 text-red-500" />
    default:
      return <Minus className="w-3 h-3 text-gray-400" />
  }
}

function getRankIcon(rank: number) {
  switch (rank) {
    case 1:
      return <Crown className="w-4 h-4 text-yellow-500" />
    case 2:
      return <Trophy className="w-4 h-4 text-gray-400" />
    case 3:
      return <Star className="w-4 h-4 text-amber-600" />
    default:
      return null
  }
}

export function RankingWidget({ 
  topUsers = mockTopUsers, 
  currentUser = mockCurrentUser,
  lastUpdated = new Date()
}: Partial<RankingWidgetProps>) {
  const currentLevelInfo = getLevelInfo(currentUser.currentLevel)
  const nextLevelInfo = getLevelInfo(currentUser.currentLevel + 1)

  return (
    <Card className="w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 border-gray-700 text-white">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-bold text-white">
            Ranking & Premiações
          </CardTitle>
          <Badge 
            variant="secondary" 
            className="bg-red-600 text-white text-xs px-2 py-1 rounded-full"
          >
            EM BREVE
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current User Progress */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: currentLevelInfo.color }}
              />
              <span className="text-sm font-medium text-gray-300">
                Você está em #{currentUser.rank}
              </span>
            </div>
            <span className="text-sm text-gray-400">
              {currentUser.totalPoints.toLocaleString()} XP
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-gray-400">{currentLevelInfo.name}</span>
              <span className="text-gray-400">
                {nextLevelInfo ? `${currentUser.pointsToNextLevel} XP para ${nextLevelInfo.name}` : 'Nível Máximo'}
              </span>
            </div>
            <Progress 
              value={currentUser.progressPercentage} 
              className="h-2 bg-gray-700"
              style={{
                '--progress-background': currentLevelInfo.color
              } as React.CSSProperties}
            />
          </div>
        </div>

        {/* Top Users Leaderboard */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-300 mb-3">
            Top Transformadores
          </h3>
          
          {topUsers.slice(0, 5).map((user, index) => {
            const levelInfo = getLevelInfo(user.currentLevel)
            const isCurrentUser = user.userId === 'current-user' // This would be dynamic
            
            return (
              <div
                key={user.userId}
                className={cn(
                  "flex items-center justify-between p-3 rounded-lg transition-colors",
                  isCurrentUser 
                    ? "bg-red-600/20 border border-red-600/30" 
                    : "bg-gray-800/50 hover:bg-gray-700/50"
                )}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-gray-400 w-4">
                      {user.rank}
                    </span>
                    {getRankIcon(user.rank)}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center overflow-hidden">
                      {user.avatar ? (
                        <Image
                          src={user.avatar}
                          alt={user.username}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                      ) : (
                        <span className="text-xs font-bold text-gray-300">
                          {user.username.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-white">
                          {user.username}
                        </span>
                        {getTrendIcon(user.trend)}
                      </div>
                      <div className="flex items-center gap-1">
                        <div 
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: levelInfo.color }}
                        />
                        <span className="text-xs text-gray-400">
                          {levelInfo.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-sm font-bold text-white">
                    {user.totalPoints.toLocaleString()}
                  </div>
                  <div className="text-xs text-gray-400">XP</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Recent Achievements */}
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide">
            Conquistas Recentes
          </h4>
          <div className="flex flex-wrap gap-1">
            {currentUser.recentAchievements.map((achievement, index) => (
              <Badge
                key={index}
                variant="outline"
                className="text-xs bg-gray-800 border-gray-600 text-gray-300"
              >
                {achievement}
              </Badge>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-gray-700">
          <div className="flex justify-between items-center text-xs text-gray-500">
            <span>Atualizado há {Math.floor((Date.now() - lastUpdated.getTime()) / 60000)} min</span>
            <button className="text-blue-400 hover:text-blue-300 transition-colors">
              Ver ranking completo
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}