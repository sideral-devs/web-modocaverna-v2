'use client'

import { GuidedTour, TutorialStep } from './guided-tour'

const steps: TutorialStep[] = [
  {
    id: 1,
    title: 'Cadastro na Plataforma de Afiliados',
    description:
      'Antes de tudo, é necessário criar sua conta na plataforma de afiliação. Esse é o primeiro passo para liberar seu código exclusivo e começar a faturar com o Modo Caverna. Clique em “Solicite sua Afiliação” para ser redirecionado.',
    elementId: undefined,
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'Solicite e aguarde aprovação',
    description:
      'Após criar sua conta, solicite a afiliação diretamente pelo botão. Você só poderá acessar as métricas e gerar comissões após essa aprovação. Esse processo é rápido e essencial para o próximo passo.',
    elementId: 'solicitar-afiliacao',
    dialogPosition: 'bottom',
  },
  {
    id: 3,
    title: 'Entre no grupo de WhatsApp',
    description:
      'O grupo é o seu canal direto com nosso time e comunidade de afiliados. Receba atualizações, dicas, modelos prontos e muito mais. Clique em “Grupo no WhatsApp” e entre agora.',
    elementId: 'grupo-whatsapp',
    dialogPosition: 'left',
  },
  {
    id: 4,
    title: 'Materiais e Mapas de Divulgação',
    description:
      'Você não precisa começar do zero. Encontre artes, vídeos e copys prontos na seção de Materiais. Use também o Mapa do Público Alvo para entender com quem falar e como abordar.',
    elementId: 'materiais-divulgacao',
    dialogPosition: 'left',
  },
  {
    id: 5,
    title: 'Insira seu código de afiliação',
    description:
      'Com a afiliação aprovada, insira seu código no painel principal para liberar suas métricas. Acompanhe suas vendas, comissões e resultados dos últimos dias.',
    elementId: 'inserir-codigo',
    dialogPosition: 'right',
  },
  {
    id: 6,
    title: 'Assista aos tutoriais e comece da maneira certa',
    description:
      'Tudo pronto! Agora desça a tela e veja a seção de vídeos estratégicos: Comece por aqui, Tutoriais, Venda sem investir, Tráfego pago. Assista com atenção e execute com ação.',
    elementId: undefined,
    dialogPosition: 'center',
  },
]
export function AffiliatesTour({
  active,
  setIsActive,
}: {
  active: boolean
  setIsActive: (arg: boolean) => void
}) {
  return (
    <GuidedTour
      data={steps}
      active={active}
      setIsActive={setIsActive}
      redirect={false}
      origin="/indique-e-ganhe"
    />
  )
}
