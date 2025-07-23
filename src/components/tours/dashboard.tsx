'use client'

import { GuidedTour, TutorialStep } from './guided-tour'

const centralCavernaSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Bem vindo ao Tutorial Caverna',
    description:
      'Aqui você vai conhecer as principais funções do sistema e aprender a usar cada ferramenta com estratégia e propósito.',
    elementId: undefined,
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'Perfil e configurações',
    description: 'Personalize sua experiência e acompanhe sua evolução.',
    elementId: 'perfil',
    dialogPosition: 'bottomLeft',
  },
  {
    id: 3,
    title: 'HUBS de ferramentas',
    description:
      'Os HUBS organizam suas ferramentas por objetivo. Navegue entre eles para acessar diferentes áreas de desenvolvimento.',
    elementId: 'hubs',
    dialogPosition: 'bottom',
  },
  {
    id: 4,
    title: 'Central Caverna',
    description:
      'A CENTRAL CAVERNA é o coração do sistema. É onde tudo começa e  onde você sempre retorna para progredir!',
    elementId: 'central-caverna',
    dialogPosition: 'right',
  },
  {
    id: 5,
    title: 'Streak',
    description:
      'Seu streak mostra sua consistência! Manter a chama acesa diariamente é o reflexo da sua transformação diária.',
    elementId: 'streak',
    dialogPosition: 'right',
  },
  {
    id: 6,
    title: 'Rituais',
    description:
      'Seus rituais moldam sua evolução. A forma como você inicia e encerra o dia define quem você se torna.',
    elementId: 'rituais',
    dialogPosition: 'right',
  },
  {
    id: 7,
    title: 'Sua Rotina Cavernosa',
    description:
      'Organize seus dias com intenção. Agenda de compromissos, treinos, refeições e rituais — tudo em um só lugar, pra manter a  disciplina e o controle da sua evolução.',
    elementId: 'rotina-cavernosa',
    dialogPosition: 'left',
  },
  {
    id: 8,
    title: 'Desafio Caverna',
    description:
      'O Desafio Caverna é uma jornada de 40 dias rumo à sua transformação. Um período intenso de disciplina, renúncia e evolução.',
    elementId: 'desafio-caverna',
    dialogPosition: 'right',
  },
  {
    id: 9,
    title: 'Flow Produtividade',
    description:
      'Entre no estado de FLOW! Sessões de foco máximo com bloqueio de distrações para você produzir em alta performance.',
    elementId: 'flow-produtividade',
    dialogPosition: 'right',
  },
  {
    id: 10,
    title: 'Dúvidas?',
    description:
      'Fale comigo direto no chat. Sou eu mesmo, o Capitão Caverna, pronto pra te destravar.',
    elementId: 'chat',
    dialogPosition: 'topLeft',
  },
]

const orderInChaosSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Ordem no Caos',
    description:
      'Esse hub é o seu mapa de clareza. Aqui você organiza sua mente, define metas, organiza seu acervo de conhecimento, controla suas finanças e manifesta seu futuro. É onde você estrutura o que pensa… pra conquistar o que quer.',
    elementId: 'ordem-no-caos',
    dialogPosition: 'center',
  },
  {
    id: 2,
    title: 'Lei da Atração',
    description:
      'Visualize o que te move. Aqui você adiciona imagens que representam seus sonhos, metas e desejos mais profundos. É o espaço pra manifestar o futuro que você quer viver.',
    elementId: 'lei-atracao',
    dialogPosition: 'right',
  },
  {
    id: 3,
    title: 'Metas',
    description:
      'Defina com clareza o que você quer conquistar. Crie metas poderosas, conectadas ao seu propósito, e acompanhe sua evolução com foco e direção.',
    elementId: 'metas',
    dialogPosition: 'right',
  },
  {
    id: 4,
    title: 'Fontes de Conhecimento',
    description:
      'Tudo começa com a mente certa. Aqui você organiza seus livros, vídeos, cursos e materiais que moldam sua mentalidade e ampliam sua visão. O que entra, transforma.',
    elementId: 'fontes-conhecimento',
    dialogPosition: 'left',
  },
  {
    id: 5,
    title: 'Minhas Finanças',
    description:
      'Controle é liberdade. Aqui você registra seus ganhos, gastos e investimentos. Assuma o comando da sua vida financeira e rompa com a escassez.',
    elementId: 'financas',
    dialogPosition: 'top',
  },
  {
    id: 6,
    title: 'Lembretes',
    description:
      'Não perca o que importa. Anote pequenas tarefas, ideias e lembretes rápidos para manter sua mente leve e sua rotina sob controle.',
    elementId: 'lembretes',
    dialogPosition: 'top',
  },
  {
    id: 7,
    title: 'Anotações',
    description:
      'Aqui é onde suas ideias ganham forma. Escreva insights, reflexões, planos e tudo que merece ser registrado na sua jornada de evolução.',
    elementId: 'anotacoes',
    dialogPosition: 'left',
  },
  {
    id: 8,
    title: 'Pronto pra colocar ordem no caos?',
    description:
      'Você já tem as ferramentas. Agora é hora de usá-las com propósito. Organize a mente, defina o caminho e transforme confusão em clareza. A revolução começa por dentro. E começa agora.',
    elementId: undefined,
    dialogPosition: 'center',
  },
]

const templeForgeSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Forja do Templo',
    description:
      'Aqui você fortalece o corpo e molda a mente. Registre treinos, refeições e acompanhe seu progresso físico com disciplina. O templo se constrói na rotina - é nela que a transformação acontece.',
    elementId: 'forja-do-templo',
    dialogPosition: 'bottom',
  },
  {
    id: 2,
    title: 'Treinos',
    description:
      'A constância vence o cansaço. Organize seus treinos da semana e acompanhe sua evolução com clareza. Comece hoje… mesmo que devagar, só não permaneça parado.',
    elementId: 'treinos',
    dialogPosition: 'right',
  },
  {
    id: 3,
    title: 'Refeições',
    description:
      'Corpo forte começa com escolha certa. Defina e controle suas refeições diárias para manter a disciplina alimentar e evitar decisões impulsivas.',
    elementId: 'refeicoes',
    dialogPosition: 'left',
  },
  {
    id: 4,
    title: 'Seu corpo é seu templo',
    description:
      'Agora você tem as ferramentas pra treinar, se alimentar melhor e criar uma rotina física alinhada com sua mente. Construa. Molde. Supere-se.',
    elementId: undefined,
    dialogPosition: 'center',
  },
]

const coursesSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Cursos & Networking',
    description:
      'Aprenda com quem vive o que ensina. Acesse conteúdos poderosos, aulas transformadoras e conecte-se com uma comunidade que respira evolução.',
    elementId: 'cursos-networking',
    dialogPosition: 'bottom',
  },
  {
    id: 2,
    title: 'Cursos & Conteúdos',
    description:
      'Aqui estão os cursos que vão forjar sua mentalidade e disciplina. Muito além do Modo Caverna e Cave Focus — cada aula é um passo na direção certa.',
    elementId: 'cursos',
    dialogPosition: 'right',
  },
  {
    id: 3,
    title: 'Comunidade Alcateia',
    description:
      'Você não precisa trilhar essa jornada sozinho. Compartilhe sua evolução, conecte-se com quem está no mesmo caminho e aprenda com quem já venceu o caos interno.',
    elementId: 'comunidade',
    dialogPosition: 'left',
  },
  {
    id: 4,
    title: 'O conhecimento abre portas',
    description:
      'A conexão te leva além. Use esse espaço pra aprender com profundidade e caminhar com quem tem sede de evolução.',
    elementId: undefined,
    dialogPosition: 'center',
  },
]

const benefitSteps: TutorialStep[] = [
  {
    id: 1,
    title: 'Área de Benefícios',
    description:
      'Aqui você é recompensado por evoluir e indicar o caminho. Ganhe prêmios, suba no ranking, e multiplique seus resultados levando o Modo Caverna pra mais pessoas.',
    elementId: 'area-de-beneficios',
    dialogPosition: 'bottom',
  },
  {
    id: 2,
    title: 'Ranking & Premiações',
    description:
      'Seu esforço agora tem reconhecimento. Acompanhe sua posição, pontue com ações dentro do sistema e desbloqueie prêmios exclusivos.',
    elementId: 'ranking',
    dialogPosition: 'right',
  },
  {
    id: 3,
    title: 'Indique & Ganhe',
    description:
      'Indicar é transformar. Aplique nossas estratégias validadas, compartilhe sua experiência e seja bem recompensado por cada nova vida impactada.',
    elementId: 'indicacao',
    dialogPosition: 'left',
  },
  {
    id: 4,
    title: 'Você cresce',
    description:
      'Você compartilha. Você é recompensado. Use essa área com inteligência e veja o Modo Caverna trabalhar por você, dentro e fora da caverna.',
    elementId: undefined,
    dialogPosition: 'center',
  },
]

export function DashboardTour({
  tab,
  active,
  setIsActive,
  redirect,
}: {
  tab: string
  active: boolean
  setIsActive: (arg: boolean) => void
  redirect?: boolean
}) {
  function getData() {
    switch (tab) {
      case 'ordem-no-caos':
        return orderInChaosSteps
      case 'forja-do-templo':
        return templeForgeSteps
      case 'cursos-e-conhecimentos':
        return coursesSteps
      case 'area-de-beneficios':
        return benefitSteps
      default:
        return centralCavernaSteps
    }
  }

  return (
    <GuidedTour
      data={getData()}
      active={active}
      setIsActive={setIsActive}
      redirect={redirect}
      origin="/dashboard"
    />
  )
}
