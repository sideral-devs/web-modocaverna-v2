'use client'

import { RankingWidget } from '@/components/ranking/ranking-widget'
import { RankingWidgetClean } from '@/components/ranking/ranking-widget-clean'

export default function RankingDemoPage() {
  return (
    <div className="min-h-screen bg-gray-950 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Ranking Widget Demo
          </h1>
          <p className="text-gray-400">
            Preview do widget de ranking para a Área de Benefícios
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Clean Widget for Área de Benefícios */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Área de Benefícios Version
            </h2>
            <p className="text-sm text-gray-400">
              Clean, brand-focused design for the benefits hub
            </p>
            <RankingWidgetClean />
          </div>

          {/* Original Widget Preview */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-white">
              Full Widget Preview
            </h2>
            <p className="text-sm text-gray-400">
              Complete version with all features
            </p>
            <RankingWidget />
          </div>

          {/* Widget Information */}
          <div className="space-y-6">
            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Funcionalidades
              </h3>
              <ul className="space-y-2 text-gray-300">
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Top 5 usuários no ranking
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Posição atual do usuário
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Progresso para próximo nível
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Conquistas recentes
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Indicadores de tendência
                </li>
                <li className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  Níveis de transformação
                </li>
              </ul>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Níveis de Transformação
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gray-500 rounded-full" />
                  <span className="text-gray-300">O Despertar (0-500 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-600 rounded-full" />
                  <span className="text-gray-300">A Ruptura (501-1,200 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-amber-500 rounded-full" />
                  <span className="text-gray-300">O Chamado (1,201-2,000 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-purple-600 rounded-full" />
                  <span className="text-gray-300">A Descoberta (2,001-3,500 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-600 rounded-full" />
                  <span className="text-gray-300">O Discernimento (3,501-5,000 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-orange-600 rounded-full" />
                  <span className="text-gray-300">A Ascensão (5,001-8,000 XP)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                  <span className="text-gray-300">A Lenda (8,000+ XP)</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-900 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Dados Mock Utilizados
              </h3>
              <div className="text-sm text-gray-400 space-y-2">
                <p><strong>Usuário Atual:</strong> Rank #47, 1,850 XP, Nível 3</p>
                <p><strong>Top 1:</strong> CavernaMaster - 8,750 XP (Nível 7)</p>
                <p><strong>Top 2:</strong> TransformadorAlpha - 6,420 XP (Nível 6)</p>
                <p><strong>Conquistas:</strong> Streak 15 dias, Desafio Completado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Integration Notes */}
        <div className="mt-12 bg-gray-900 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">
            Notas de Integração
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">APIs Necessárias:</h4>
              <ul className="space-y-1">
                <li>• GET /api/ranking/leaderboard</li>
                <li>• GET /api/ranking/user/[id]</li>
                <li>• GET /api/user/level-progress</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">Dados do Sistema:</h4>
              <ul className="space-y-1">
                <li>• User.score (pontos totais)</li>
                <li>• User.level (nível atual)</li>
                <li>• User.login_streak (sequência)</li>
                <li>• Challenge completion data</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}