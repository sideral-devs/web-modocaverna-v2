'use client'

import { Trophy, Star, TrendingUp, Users, Target, Award, Crown, Medal, Zap } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { TRANSFORMATION_LEVELS } from "@/constants/transformation-levels"

interface User {
  id: number
  name: string
  level: number
  cp: number
  position: number
  avatar: string
  tier: 'gold' | 'silver' | 'purple' | 'legendary' | 'epic' | 'rare' | 'common'
  status?: string
}

const mockUsers: User[] = [
  { id: 1, name: "Rafael Nogueira", level: 1, cp: 195, position: 1, avatar: "R", tier: "gold", status: "O Despertar" },
  { id: 2, name: "Douglas Roberto", level: 1, cp: 96, position: 2, avatar: "D", tier: "silver", status: "O Despertar" },
  { id: 3, name: "João Augusto", level: 1, cp: 87, position: 3, avatar: "J", tier: "purple", status: "O Despertar" },
  { id: 4, name: "Maria Silva", level: 2, cp: 1250, position: 4, avatar: "M", tier: "rare", status: "A Ruptura" },
  { id: 5, name: "Pedro Santos", level: 2, cp: 1180, position: 5, avatar: "P", tier: "rare", status: "A Ruptura" },
  { id: 6, name: "Ana Costa", level: 3, cp: 1850, position: 6, avatar: "A", tier: "epic", status: "O Chamado" },
  { id: 7, name: "Carlos Lima", level: 3, cp: 1720, position: 7, avatar: "C", tier: "epic", status: "O Chamado" },
  { id: 8, name: "Lucia Ferreira", level: 4, cp: 2950, position: 8, avatar: "L", tier: "legendary", status: "A Descoberta" },
  { id: 9, name: "Roberto Alves", level: 4, cp: 2800, position: 9, avatar: "R", tier: "legendary", status: "A Descoberta" },
  { id: 10, name: "Fernanda Rocha", level: 5, cp: 4200, position: 10, avatar: "F", tier: "legendary", status: "O Discernimento" },
  // Current user
  { id: 50, name: "Você", level: 1, cp: 12, position: 50, avatar: "V", tier: "common", status: "O Despertar" },
  // Users below current user
  { id: 51, name: "João Baggio", level: 1, cp: 11, position: 51, avatar: "J", tier: "common", status: "O Despertar" },
  { id: 52, name: "Rodolfo Nogueira", level: 1, cp: 8, position: 52, avatar: "R", tier: "common", status: "O Despertar" }
]

const topTransformers = [
  { id: 1, name: "CavernaMaster", cp: 8750, level: 7, status: "A Lenda", tier: "legendary" },
  { id: 2, name: "TransformadorAlpha", cp: 6420, level: 6, status: "A Ascensão", tier: "epic" },
  { id: 3, name: "FocoLaser", cp: 5890, level: 6, status: "A Ascensão", tier: "epic" },
  { id: 4, name: "DespertarTotal", cp: 4320, level: 5, status: "O Discernimento", tier: "rare" },
  { id: 5, name: "RupturaVital", cp: 3850, level: 5, status: "O Discernimento", tier: "rare" }
]

const achievements = [
  { name: "Streak de 15 dias", icon: Target },
  { name: "Desafio Completado", icon: Award },
  { name: "Top 5 Comunidade", icon: Trophy }
]

function getTierColors(tier: string) {
  const colors = {
    gold: "bg-yellow-500 text-black",
    silver: "bg-gray-400 text-black",
    purple: "bg-purple-500 text-white",
    legendary: "bg-gradient-to-r from-purple-600 to-pink-600 text-white",
    epic: "bg-gradient-to-r from-purple-500 to-indigo-500 text-white",
    rare: "bg-gradient-to-r from-green-500 to-emerald-500 text-white",
    common: "bg-gray-600 text-gray-300"
  }
  return colors[tier as keyof typeof colors] || colors.common
}

function getTierBorder(tier: string) {
  const borders = {
    gold: "border-yellow-500 shadow-lg shadow-yellow-500/20",
    silver: "border-gray-400 shadow-lg shadow-gray-400/20",
    purple: "border-purple-500 shadow-lg shadow-purple-500/20",
    legendary: "border-purple-600 shadow-lg shadow-purple-600/30",
    epic: "border-purple-500 shadow-lg shadow-purple-500/20",
    rare: "border-green-500 shadow-lg shadow-green-500/20",
    common: "border-gray-600"
  }
  return borders[tier as keyof typeof borders] || borders.common
}

function getTierIcon(position: number) {
  if (position === 1) return <Crown className="w-5 h-5 text-yellow-500" />
  if (position === 2) return <Medal className="w-5 h-5 text-gray-400" />
  if (position === 3) return <Zap className="w-5 h-5 text-purple-500" />
  return null
}

function UserRankCard({ user, isCurrentUser = false }: { user: User; isCurrentUser?: boolean }) {
  return (
    <Card className={`p-4 transition-all duration-300 hover:scale-[1.02] bg-gray-800/50 border-2 ${
      isCurrentUser 
        ? "border-red-600 bg-red-600/10 shadow-lg shadow-red-600/20" 
        : `${getTierBorder(user.tier)} hover:border-gray-500`
    }`}>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${getTierColors(user.tier)}`}>
            {user.position <= 3 ? getTierIcon(user.position) : user.avatar}
          </div>
          <div className="flex items-center gap-2">
            <span className={`text-2xl font-bold ${
              user.position <= 3 
                ? user.position === 1 ? 'text-yellow-500' 
                  : user.position === 2 ? 'text-gray-400' 
                  : 'text-purple-500'
                : 'text-gray-400'
            }`}>
              #{user.position}
            </span>
          </div>
        </div>
        
        <div className="flex-1">
          <h3 className={`font-semibold ${isCurrentUser ? 'text-red-400' : 'text-white'}`}>
            {user.name}
          </h3>
          <p className="text-sm text-gray-400">
            Nível {user.level} • {user.status}
          </p>
        </div>
        
        <div className="text-right">
          <span className={`text-2xl font-bold ${isCurrentUser ? 'text-red-400' : 'text-white'}`}>
            {user.cp.toLocaleString()}
          </span>
          <p className="text-sm text-gray-400">CP</p>
        </div>
      </div>
    </Card>
  )
}

export default function RankingPage() {
  const currentUser = mockUsers.find(u => u.name === "Você")
  const nextLevel = TRANSFORMATION_LEVELS.find(l => l.min_points > (currentUser?.cp || 0))
  const progressToNext = currentUser && nextLevel 
    ? ((currentUser.cp - (TRANSFORMATION_LEVELS.find(l => l.id === currentUser.level)?.min_points || 0)) / 
       (nextLevel.min_points - (TRANSFORMATION_LEVELS.find(l => l.id === currentUser.level)?.min_points || 0))) * 100 
    : 0

  return (
    <div className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600 text-white font-semibold">
            <Trophy className="w-5 h-5" />
            RANKING & PREMIAÇÕES
          </div>
          <h1 className="text-4xl font-bold text-white">
            Sistema de Transformação
          </h1>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Acompanhe seu progresso, conquiste níveis e compita com outros transformadores
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main Ranking */}
          <div className="lg:col-span-2 space-y-4">
            <Card className="p-6 bg-gray-800/50 border-2 border-gray-600">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2 text-white">
                  <Users className="w-6 h-6 text-red-500" />
                  Ranking Geral
                </h2>
                <Badge className="bg-green-600 text-white">
                  Atualizado há 0 min
                </Badge>
              </div>
              
              <div className="space-y-3">
                {mockUsers.slice(0, 10).map((user, index) => (
                  <div key={user.id} className="opacity-0 animate-fade-in" 
                       style={{ animationDelay: `${index * 0.1}s`, animationFillMode: 'forwards' }}>
                    <UserRankCard user={user} isCurrentUser={user.name === "Você"} />
                  </div>
                ))}
              </div>
              
              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-semibold">
                Carregar Mais Usuários
              </Button>
            </Card>

            {/* Current User Progress */}
            {currentUser && (
              <Card className="p-6 bg-gray-800/50 border-2 border-red-600 shadow-lg shadow-red-600/20">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-red-400 flex items-center gap-2">
                      <TrendingUp className="w-5 h-5" />
                      Seu Progresso
                    </h3>
                    <Badge className="bg-red-600 text-white">
                      Posição #{currentUser.position}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Progresso para próximo nível</span>
                      <span className="text-red-400 font-semibold">
                        {currentUser.cp}/{nextLevel?.min_points || 500} CP
                      </span>
                    </div>
                    <Progress value={progressToNext} className="h-3" />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-red-400">{currentUser.cp}</p>
                      <p className="text-sm text-gray-400">CP Total</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-green-400">{currentUser.level}</p>
                      <p className="text-sm text-gray-400">Nível</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-purple-400">#{currentUser.position}</p>
                      <p className="text-sm text-gray-400">Posição</p>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Top Transformers */}
            <Card className="p-6 bg-gray-800/50 border-2 border-gray-600">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Star className="w-5 h-5 text-yellow-500" />
                Top Transformadores
              </h3>
              <div className="space-y-3">
                {topTransformers.map((user, index) => (
                  <div key={user.id} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getTierColors(user.tier)}`}>
                      {index + 1}
                    </span>
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-white">{user.name}</p>
                      <p className="text-xs text-gray-400">{user.status}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-sm text-white">{user.cp.toLocaleString()}</p>
                      <p className="text-xs text-gray-400">CP</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Transformation Levels */}
            <Card className="p-6 bg-gray-800/50 border-2 border-gray-600">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Award className="w-5 h-5 text-purple-500" />
                Níveis de Transformação
              </h3>
              <div className="space-y-3">
                {TRANSFORMATION_LEVELS.map((level, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gray-700/20 hover:bg-gray-700/40 transition-colors">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: level.color }} />
                    <div className="flex-1">
                      <p className="font-semibold text-sm text-white">{level.name}</p>
                      <p className="text-xs text-gray-400">{level.min_points} - {level.max_points === 999999 ? '∞' : level.max_points} CP</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Recent Achievements */}
            <Card className="p-6 bg-gray-800/50 border-2 border-gray-600">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2 text-white">
                <Trophy className="w-5 h-5 text-yellow-500" />
                Conquistas Recentes
              </h3>
              <div className="space-y-3">
                {achievements.map((achievement, index) => (
                  <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-gradient-to-r from-gray-700/30 to-gray-600/30">
                    <achievement.icon className="w-5 h-5 text-red-500" />
                    <span className="text-sm font-medium text-white">{achievement.name}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}