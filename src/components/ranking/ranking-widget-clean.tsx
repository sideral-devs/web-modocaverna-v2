'use client'

import { TRANSFORMATION_LEVELS } from '@/constants/transformation-levels'
import { useEffect, useState } from 'react'
import { Trophy, Star, TrendingUp } from 'lucide-react'

interface RankedUser {
  userId: string
  username: string
  fullName: string
  totalPoints: number
  currentLevel: number
  rank: number
}

interface UserRanking {
  rank: number
  totalPoints: number
  currentLevel: number
  fullName: string
}

interface RankingWidgetCleanProps {
  topUsers: RankedUser[]
  currentUser: UserRanking
}

// Mock data matching the exact design
const mockTopUsers: RankedUser[] = [
  {
    userId: '1',
    username: 'R',
    fullName: 'Rafael Nogueira',
    totalPoints: 195,
    currentLevel: 1,
    rank: 1
  },
  {
    userId: '2',
    username: 'D',
    fullName: 'Douglas Roberto',
    totalPoints: 96,
    currentLevel: 1,
    rank: 2
  },
  {
    userId: '3',
    username: 'J',
    fullName: 'João Augusto',
    totalPoints: 87,
    currentLevel: 1,
    rank: 3
  }
]

const mockCurrentUser: UserRanking = {
  rank: 50,
  totalPoints: 12,
  currentLevel: 1,
  fullName: 'Você'
}

const mockOtherUsers: RankedUser[] = [
  {
    userId: '51',
    username: 'J',
    fullName: 'João Baggio',
    totalPoints: 11,
    currentLevel: 1,
    rank: 51
  },
  {
    userId: '52',
    username: 'R',
    fullName: 'Rodolfo Nogueira',
    totalPoints: 8,
    currentLevel: 1,
    rank: 52
  }
]

function getLevelInfo(levelId: number) {
  return TRANSFORMATION_LEVELS.find(level => level.id === levelId) || TRANSFORMATION_LEVELS[0]
}

function getRankColor(rank: number) {
  if (rank === 1) return '#FBBF24' // Gold
  if (rank === 2) return '#9CA3AF' // Silver
  if (rank === 3) return '#8B5CF6' // Purple instead of bronze
  return '#6B7280' // Default gray
}

function getTierIcon(rank: number) {
  if (rank === 1) return <Trophy className="w-4 h-4 text-yellow-400" />
  if (rank === 2) return <Star className="w-4 h-4 text-gray-400" />
  if (rank === 3) return <TrendingUp className="w-4 h-4 text-purple-400" />
  return null
}

// Animated counter component
function AnimatedCounter({ value, duration = 1000 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      setCount(Math.floor(easeOutQuart * value))

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationFrame)
  }, [value, duration])

  return <span>{count}</span>
}

export function RankingWidgetClean({
  topUsers = mockTopUsers,
  currentUser = mockCurrentUser
}: Partial<RankingWidgetCleanProps>) {
  const currentLevelInfo = getLevelInfo(currentUser.currentLevel)

  return (
    <div className="w-full h-full min-h-[676px] bg-gray-800/90 border border-gray-600 rounded-2xl text-white p-6 flex flex-col">
      {/* Header */}
      <div className="mb-6">
        <div className="flex w-fit px-3 py-2 border border-white rounded-full">
          <span className="text-[10px] text-white font-semibold">
            RANKING & PREMIAÇÕES
          </span>
        </div>
      </div>

      {/* Top 3 Users */}
      <div className="space-y-3 mb-4">
        {topUsers.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-4 bg-gray-800/50 rounded-xl border border-gray-700 hover:scale-[1.02] transition-transform duration-200"
          >
            <div className="flex items-center gap-4">
              {/* Rank Circle */}
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-black"
                style={{ backgroundColor: getRankColor(user.rank) }}
              >
                {user.rank}
              </div>

              {/* Avatar */}
              <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold text-white">
                  {user.username}
                </span>
              </div>

              {/* Name and Level */}
              <div>
                <div className="text-white font-medium">
                  {user.fullName}
                </div>
                <div className="text-xs text-gray-400">
                  Nível {user.currentLevel} - {getLevelInfo(user.currentLevel).name}
                </div>
              </div>
            </div>

            {/* Points with Rolling Animation */}
            <div className="text-right flex items-center gap-2">
              {getTierIcon(user.rank)}
              <div>
                <div className="text-lg font-bold text-white">
                  <AnimatedCounter value={user.totalPoints} duration={1500} /> CP
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Current User (Highlighted) */}
      <div className="mb-4">
        <div className="flex items-center justify-between p-4 bg-red-600/20 rounded-xl border border-red-600/50 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/20 transition-all duration-200">
          <div className="flex items-center gap-4">
            {/* Rank with rolling animation */}
            <div className="text-red-400 font-bold text-lg">
              <AnimatedCounter value={currentUser.rank} duration={2000} />
            </div>

            {/* Avatar */}
            <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-white">
                V
              </span>
            </div>

            {/* Name and Level */}
            <div>
              <div className="text-red-400 font-medium">
                {currentUser.fullName}
              </div>
              <div className="text-xs text-gray-400">
                Nível {currentUser.currentLevel} - {currentLevelInfo.name}
              </div>
            </div>
          </div>

          {/* Points with emphasis animation */}
          <div className="text-right">
            <div className="text-lg font-bold text-red-400">
              <AnimatedCounter value={currentUser.totalPoints} duration={2500} /> CP
            </div>
          </div>
        </div>
      </div>

      {/* Other Users Below */}
      <div className="space-y-2 mb-6">
        {mockOtherUsers.map((user, index) => (
          <div
            key={user.userId}
            className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg hover:bg-gray-700/50 transition-colors duration-200"
          >
            <div className="flex items-center gap-3">
              {/* Rank */}
              <div className="text-gray-400 font-medium text-sm w-6">
                <AnimatedCounter value={user.rank} duration={1000} />
              </div>

              {/* Avatar */}
              <div className="w-8 h-8 bg-gray-600 rounded-full flex items-center justify-center">
                <span className="text-sm font-bold text-white">
                  {user.username}
                </span>
              </div>

              {/* Name */}
              <div className="text-gray-300 text-sm">
                {user.fullName}
              </div>
            </div>

            {/* Points */}
            <div className="text-sm text-gray-400">
              <AnimatedCounter value={user.totalPoints} duration={1200} /> CP
            </div>
          </div>
        ))}
      </div>

      {/* Action Button */}
      <button 
        onClick={() => window.location.href = '/ranking'}
        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-xl transition-all duration-200 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-600/40 active:scale-[0.98]"
      >
        Ver Ranking Completo
      </button>
    </div>
  )
}