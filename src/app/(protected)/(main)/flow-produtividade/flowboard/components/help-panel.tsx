'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { 
  HelpCircle, 
  X, 
  MousePointer, 
  Keyboard, 
  Image, 
  Move, 
  RotateCcw,
  Save,
  Trash2,
  ZoomIn,
  ZoomOut,
  Maximize,
  Copy,
  Palette
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useOnboardingTour } from './onboarding-tour'

interface HelpSection {
  id: string
  title: string
  icon: React.ReactNode
  items: Array<{
    action: string
    description: string
    shortcut?: string
    icon?: React.ReactNode
  }>
}

const HELP_SECTIONS: HelpSection[] = [
  {
    id: 'basics',
    title: 'Básico',
    icon: <MousePointer className="w-4 h-4" />,
    items: [
      {
        action: 'Clique duplo',
        description: 'Adicionar novo elemento de texto',
        icon: <MousePointer className="w-4 h-4" />
      },
      {
        action: 'Arrastar',
        description: 'Mover elementos pelo canvas',
        icon: <Move className="w-4 h-4" />
      },
      {
        action: 'Colar imagem',
        description: 'Cole imagens diretamente no canvas',
        shortcut: 'Ctrl+V',
        icon: <Image className="w-4 h-4" />
      },
      {
        action: 'Selecionar',
        description: 'Clique em um elemento para selecioná-lo',
        icon: <MousePointer className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'shortcuts',
    title: 'Atalhos do Teclado',
    icon: <Keyboard className="w-4 h-4" />,
    items: [
      {
        action: 'Desfazer',
        shortcut: 'Ctrl+Z',
        description: 'Desfaz a última ação',
        icon: <RotateCcw className="w-4 h-4" />
      },
      {
        action: 'Salvar',
        shortcut: 'Ctrl+S',
        description: 'Força o salvamento manual',
        icon: <Save className="w-4 h-4" />
      },
      {
        action: 'Excluir',
        shortcut: 'Delete',
        description: 'Remove o elemento selecionado',
        icon: <Trash2 className="w-4 h-4" />
      },
      {
        action: 'Copiar',
        shortcut: 'Ctrl+C',
        description: 'Copia o elemento selecionado',
        icon: <Copy className="w-4 h-4" />
      },
      {
        action: 'Colar',
        shortcut: 'Ctrl+V',
        description: 'Cola elemento ou imagem',
        icon: <Image className="w-4 h-4" />
      }
    ]
  },
  {
    id: 'navigation',
    title: 'Navegação',
    icon: <ZoomIn className="w-4 h-4" />,
    items: [
      {
        action: 'Zoom in',
        shortcut: 'Ctrl++',
        description: 'Aumenta o zoom do canvas',
        icon: <ZoomIn className="w-4 h-4" />
      },
      {
        action: 'Zoom out',
        shortcut: 'Ctrl+-',
        description: 'Diminui o zoom do canvas',
        icon: <ZoomOut className="w-4 h-4" />
      },
      {
        action: 'Ajustar à tela',
        shortcut: 'Ctrl+0',
        description: 'Ajusta o zoom para mostrar todos os elementos',
        icon: <Maximize className="w-4 h-4" />
      },
      {
        action: 'Arrastar canvas',
        description: 'Segure espaço + arrastar para mover o canvas',
        shortcut: 'Espaço'
      }
    ]
  },
  {
    id: 'features',
    title: 'Recursos',
    icon: <Palette className="w-4 h-4" />,
    items: [
      {
        action: 'Salvamento automático',
        description: 'Suas alterações são salvas automaticamente a cada 2 segundos'
      },
      {
        action: 'Múltiplos quadros',
        description: 'Crie até 10 quadros diferentes para organizar seus projetos'
      },
      {
        action: 'Otimização de imagens',
        description: 'Imagens são automaticamente otimizadas para melhor performance'
      },
      {
        action: 'Conexões',
        description: 'Conecte elementos arrastando das bordas dos nós'
      }
    ]
  }
]

interface HelpPanelProps {
  visible?: boolean
  onClose?: () => void
}

export function HelpPanel({ visible = false, onClose }: HelpPanelProps) {
  const [activeSection, setActiveSection] = useState('basics')
  const { restartTour } = useOnboardingTour()

  if (!visible) return null

  const activeHelpSection = HELP_SECTIONS.find(section => section.id === activeSection)

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              <HelpCircle className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-zinc-100">
                Central de Ajuda
              </h2>
              <p className="text-sm text-zinc-400">
                Aprenda a usar o FlowBoard
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors p-2 hover:bg-zinc-800 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex h-[500px]">
          {/* Sidebar */}
          <div className="w-48 border-r border-zinc-800 p-4 space-y-2">
            {HELP_SECTIONS.map((section) => (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={cn(
                  "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-all duration-200",
                  activeSection === section.id
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
                )}
              >
                {section.icon}
                <span className="text-sm font-medium">{section.title}</span>
              </button>
            ))}

            {/* Restart Tour Button */}
            <div className="pt-4 border-t border-zinc-800">
              <Button
                variant="outline"
                size="sm"
                onClick={restartTour}
                className="w-full bg-zinc-800 border-zinc-700 hover:bg-zinc-700 text-zinc-300"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Refazer Tutorial
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeHelpSection && (
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-8 h-8 bg-cyan-500/20 rounded-lg flex items-center justify-center">
                    {activeHelpSection.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {activeHelpSection.title}
                  </h3>
                </div>

                <div className="space-y-3">
                  {activeHelpSection.items.map((item, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-4 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800/70 transition-colors"
                    >
                      {item.icon && (
                        <div className="w-8 h-8 bg-zinc-700 rounded-lg flex items-center justify-center text-zinc-400 flex-shrink-0">
                          {item.icon}
                        </div>
                      )}
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-sm font-medium text-zinc-200">
                            {item.action}
                          </h4>
                          {item.shortcut && (
                            <kbd className="px-2 py-1 bg-zinc-700 text-zinc-300 text-xs rounded border border-zinc-600">
                              {item.shortcut}
                            </kbd>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800 bg-zinc-950/50">
          <div className="flex items-center justify-between">
            <div className="text-xs text-zinc-500">
              Precisa de mais ajuda? Entre em contato com o suporte.
            </div>
            <Button
              onClick={onClose}
              className="bg-cyan-600 hover:bg-cyan-700 text-white"
            >
              Entendi
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Help button component
export function HelpButton() {
  const [showHelp, setShowHelp] = useState(false)

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowHelp(true)}
        className="text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800"
        title="Ajuda"
      >
        <HelpCircle className="w-4 h-4" />
      </Button>
      
      <HelpPanel
        visible={showHelp}
        onClose={() => setShowHelp(false)}
      />
    </>
  )
}