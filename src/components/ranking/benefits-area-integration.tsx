'use client'

import { RankingWidget } from './ranking-widget'

export function BenefitsAreaWithRanking() {
  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-white">Área de Benefícios</h1>
          <p className="text-gray-400 mt-2">
            Desbloqueie recompensas exclusivas conforme você evolui na sua jornada de transformação
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Benefits Content */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Cave Store Benefits */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                🏪 Descontos na Cave Store
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-gray-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-300">O Despertar</span>
                  </div>
                  <p className="text-2xl font-bold text-white">5%</p>
                  <p className="text-xs text-gray-400">de desconto</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-red-600 rounded-full" />
                    <span className="text-sm font-medium text-gray-300">A Ruptura</span>
                  </div>
                  <p className="text-2xl font-bold text-white">10%</p>
                  <p className="text-xs text-gray-400">de desconto</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-blue-600 rounded-full" />
                    <span className="text-sm font-medium text-gray-300">O Chamado</span>
                  </div>
                  <p className="text-2xl font-bold text-white">15%</p>
                  <p className="text-xs text-gray-400">de desconto</p>
                </div>
                <div className="bg-gray-800 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                    <span className="text-sm font-medium text-gray-300">A Lenda</span>
                  </div>
                  <p className="text-2xl font-bold text-white">40%</p>
                  <p className="text-xs text-gray-400">de desconto</p>
                </div>
              </div>
            </div>

            {/* Exclusive Content */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                🎯 Conteúdo Exclusivo
              </h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full" />
                    <span className="text-gray-300">Masterclass Descoberta</span>
                  </div>
                  <span className="text-xs text-gray-500">Nível 4+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full" />
                    <span className="text-gray-300">Workshop Discernimento</span>
                  </div>
                  <span className="text-xs text-gray-500">Nível 5+</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full" />
                    <span className="text-gray-300">Círculo dos Lendários</span>
                  </div>
                  <span className="text-xs text-gray-500">Nível 7</span>
                </div>
              </div>
            </div>

            {/* Special Events */}
            <div className="bg-gray-900 rounded-lg p-6 border border-gray-700">
              <h2 className="text-xl font-semibold text-white mb-4">
                🎪 Eventos Especiais
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gradient-to-r from-blue-900/20 to-blue-800/20 rounded-lg p-4 border border-blue-700/30">
                  <h3 className="font-semibold text-white mb-2">Mastermind Mensal</h3>
                  <p className="text-sm text-gray-300 mb-2">Sessões exclusivas de mentoria em grupo</p>
                  <span className="text-xs text-blue-400">Disponível: Nível 3+</span>
                </div>
                <div className="bg-gradient-to-r from-orange-900/20 to-orange-800/20 rounded-lg p-4 border border-orange-700/30">
                  <h3 className="font-semibold text-white mb-2">Summit Ascensão</h3>
                  <p className="text-sm text-gray-300 mb-2">Evento anual para líderes da transformação</p>
                  <span className="text-xs text-orange-400">Disponível: Nível 6+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ranking Widget Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              <RankingWidget />
              
              {/* Additional Benefits Info */}
              <div className="mt-6 bg-gray-900 rounded-lg p-4 border border-gray-700">
                <h3 className="text-sm font-semibold text-white mb-3">
                  💡 Como Ganhar XP
                </h3>
                <div className="space-y-2 text-xs text-gray-400">
                  <div className="flex justify-between">
                    <span>Login diário</span>
                    <span className="text-green-400">+1 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Completar desafio</span>
                    <span className="text-green-400">+100 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Post na comunidade</span>
                    <span className="text-green-400">+5 XP</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Finalizar curso</span>
                    <span className="text-green-400">+50-100 XP</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}