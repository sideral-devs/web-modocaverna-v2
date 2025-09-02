'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import { 
  Palette, 
  MousePointer, 
  Image, 
  Type, 
  Shapes, 
  ArrowRight,
  Lightbulb,
  Zap
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface EmptyStateGuidanceProps {
  onCreateBoard?: () => void
  className?: string
}

export function EmptyStateGuidance({ onCreateBoard, className }: EmptyStateGuidanceProps) {
  const features = [
    {
      icon: <MousePointer className="w-5 h-5" />,
      title: 'Clique duplo',
      description: 'Para adicionar texto'
    },
    {
      icon: <Image className="w-5 h-5" />,
      title: 'Ctrl+V',
      description: 'Para colar imagens'
    },
    {
      icon: <Shapes className="w-5 h-5" />,
      title: 'Arrastar',
      description: 'Para conectar elementos'
    }
  ]

  return (
    <div className={cn(
      "flex flex-col items-center justify-center p-8 text-center relative",
      className
    )}>
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-cyan-500 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-24 h-24 bg-purple-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-emerald-500 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-md">
        {/* Main icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
            <Palette size={32} className="text-zinc-400" />
          </div>
          <div className="absolute -top-2 -right-2 w-8 h-8 bg-cyan-500/20 rounded-full flex items-center justify-center animate-bounce">
            <Zap size={16} className="text-cyan-400" />
          </div>
        </div>

        {/* Title and description */}
        <h3 className="text-2xl font-bold mb-3 text-zinc-100">
          Comece criando seu primeiro quadro
        </h3>
        <p className="text-zinc-400 mb-8 leading-relaxed">
          Transforme suas ideias em realidade com nosso quadro branco digital. 
          Perfeito para mapas mentais, fluxos de trabalho e brainstorming.
        </p>

        {/* Create board button */}
        {onCreateBoard && (
          <Button
            onClick={onCreateBoard}
            className="mb-8 bg-gradient-to-r from-[#ff3333] to-red-700 hover:from-red-700 hover:to-red-800 text-white shadow-lg hover:shadow-[#ff3333]/25 transition-all duration-300 group"
            size="lg"
          >
            <Palette className="w-5 h-5 mr-2" />
            Criar Primeiro Quadro
            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
          </Button>
        )}

        {/* Quick tips */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 text-sm text-zinc-500 mb-4">
            <Lightbulb className="w-4 h-4" />
            <span>Dicas rápidas:</span>
          </div>
          
          <div className="grid gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="flex items-center gap-3 p-3 bg-zinc-800/30 rounded-lg border border-zinc-800/50 hover:bg-zinc-800/50 transition-colors"
              >
                <div className="w-8 h-8 bg-zinc-700/50 rounded-lg flex items-center justify-center text-zinc-400">
                  {feature.icon}
                </div>
                <div className="text-left">
                  <div className="text-sm font-medium text-zinc-300">
                    {feature.title}
                  </div>
                  <div className="text-xs text-zinc-500">
                    {feature.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Additional info */}
        <div className="mt-8 p-4 bg-cyan-950/20 border border-cyan-900/30 rounded-lg">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <Lightbulb className="w-3 h-3 text-cyan-400" />
            </div>
            <div className="text-left">
              <p className="text-xs text-cyan-300 font-medium mb-1">
                Salvamento automático
              </p>
              <p className="text-xs text-cyan-400/70">
                Suas alterações são salvas automaticamente. Você pode criar até 10 quadros diferentes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Canvas empty state with interactive elements
export function CanvasEmptyState() {
  return (
    <div className="flex-1 flex items-center justify-center p-8 relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `
            radial-gradient(circle at 25% 25%, #06b6d4 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)
          `,
          backgroundSize: '100px 100px',
          animation: 'float 6s ease-in-out infinite'
        }} />
      </div>

      <div className="text-center text-zinc-400 relative z-10 max-w-lg">
        <div className="relative mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-zinc-800 to-zinc-900 rounded-2xl flex items-center justify-center mx-auto shadow-2xl">
            <Type size={28} className="text-zinc-400" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 bg-cyan-500/20 rounded-full flex items-center justify-center">
            <MousePointer size={12} className="text-cyan-400" />
          </div>
        </div>
        
        <h3 className="text-xl font-semibold mb-3 text-zinc-200">
          Canvas vazio - Pronto para suas ideias!
        </h3>
        
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <MousePointer className="w-4 h-4" />
            <span>Clique duplo para adicionar texto</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <Image className="w-4 h-4" />
            <span>Cole imagens com</span>
            <kbd className="px-2 py-1 bg-zinc-700 rounded text-xs">Ctrl+V</kbd>
          </div>
          <div className="flex items-center justify-center gap-2 text-zinc-500">
            <Shapes className="w-4 h-4" />
            <span>Arraste das bordas para conectar elementos</span>
          </div>
        </div>

        {/* Interactive demo area */}
        <div className="mt-8 p-6 border-2 border-dashed border-zinc-700 rounded-xl hover:border-zinc-600 transition-colors cursor-pointer group">
          <div className="flex items-center justify-center gap-2 text-zinc-500 group-hover:text-zinc-400 transition-colors">
            <MousePointer className="w-5 h-5" />
            <span className="text-sm">Clique duplo aqui para começar</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-10px) rotate(1deg); }
        }
      `}</style>
    </div>
  )
}