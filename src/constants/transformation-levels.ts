export const TRANSFORMATION_LEVELS: TransformationLevel[] = [
  {
    id: 1,
    name: "O Despertar",
    theme: "Reconhecimento e Consciência",
    description: "O primeiro passo da jornada. Hora de despertar para seu potencial.",
    min_points: 0,
    max_points: 1000,
    color: "#6B7280", // Gray
    icon: "👁️",
    milestones: [
      {
        id: "onboarding_complete",
        name: "Primeiro Passo",
        description: "Complete o onboarding do Modo Caverna",
        points_reward: 20,
        badge_reward: "explorador",
        level_required: 1,
        category: "special",
        requirements: [{ type: "login_streak", target_value: 1 }]
      },
      {
        id: "first_week_streak",
        name: "Primeira Semana",
        description: "Mantenha um streak de 7 dias consecutivos",
        points_reward: 30,
        level_required: 1,
        category: "weekly",
        requirements: [{ type: "login_streak", target_value: 7 }]
      },
      {
        id: "explore_all_hubs",
        name: "Explorador Completo",
        description: "Visite todos os 5 hubs do dashboard",
        points_reward: 25,
        level_required: 1,
        category: "special",
        requirements: [{ type: "login_streak", target_value: 3 }]
      }
    ],
    capitao_messages: [
      {
        id: "despertar_welcome",
        level: 1,
        trigger: "level_up",
        message: "Bem-vindo à caverna, explorador! Sua jornada de transformação começa agora. Cada passo que você der aqui dentro te levará mais perto da sua melhor versão.",
        tone: "encouraging"
      },
      {
        id: "despertar_daily",
        level: 1,
        trigger: "daily_checkin",
        message: "Mais um dia na caverna! Lembre-se: grandes transformações começam com pequenos passos consistentes.",
        tone: "motivational"
      }
    ]
  },
  {
    id: 2,
    name: "A Ruptura",
    theme: "Rompendo Padrões Limitantes",
    description: "Hora de romper com velhos padrões e criar hábitos transformadores.",
    min_points: 1001,
    max_points: 2500,
    color: "#DC2626", // Red
    icon: "🔥",
    milestones: [
      {
        id: "two_week_streak",
        name: "Disciplina Forjada",
        description: "Mantenha um streak de 14 dias consecutivos",
        points_reward: 50,
        badge_reward: "disciplinado",
        level_required: 2,
        category: "weekly",
        requirements: [{ type: "login_streak", target_value: 14 }]
      },
      {
        id: "first_ritual",
        name: "Ritual Estabelecido",
        description: "Complete seu primeiro ritual matinal ou noturno",
        points_reward: 40,
        level_required: 2,
        category: "special",
        requirements: [{ type: "login_streak", target_value: 10 }]
      },
      {
        id: "pomodoro_sessions",
        name: "Foco Inicial",
        description: "Complete 5 sessões de Pomodoro",
        points_reward: 35,
        level_required: 2,
        category: "weekly",
        requirements: [{ type: "pomodoro_sessions", target_value: 5 }]
      }
    ],
    capitao_messages: [
      {
        id: "compromisso_levelup",
        level: 2,
        trigger: "level_up",
        message: "Vejo que você está levando a sério! A disciplina é a chave para sair da escuridão. Continue forjando seus hábitos, guerreiro.",
        tone: "congratulatory"
      },
      {
        id: "compromisso_encouragement",
        level: 2,
        trigger: "encouragement",
        message: "A disciplina não é punição, é liberdade. Cada hábito que você constrói te liberta das amarras da mediocridade.",
        tone: "motivational"
      }
    ]
  },
  {
    id: 3,
    name: "O Chamado",
    theme: "Respondendo ao Chamado Interior",
    description: "Hora de responder ao chamado da sua verdadeira missão.",
    min_points: 2501,
    max_points: 5000,
    color: "#2563EB", // Blue
    icon: "📯",
    milestones: [
      {
        id: "pomodoro_master",
        name: "Mestre do Foco",
        description: "Complete 30 sessões de Pomodoro",
        points_reward: 80,
        badge_reward: "focado",
        level_required: 3,
        category: "monthly",
        requirements: [{ type: "pomodoro_sessions", target_value: 30 }]
      },
      {
        id: "organized_week",
        name: "Organização Total",
        description: "Mantenha sua agenda organizada por 1 semana completa",
        points_reward: 60,
        level_required: 3,
        category: "weekly",
        requirements: [{ type: "login_streak", target_value: 21 }]
      },
      {
        id: "small_goals",
        name: "Conquistador",
        description: "Complete 3 metas pequenas",
        points_reward: 70,
        level_required: 3,
        category: "monthly",
        requirements: [{ type: "goals_achieved", target_value: 3 }]
      }
    ],
    capitao_messages: [
      {
        id: "foco_levelup",
        level: 3,
        trigger: "level_up",
        message: "Excelente foco! Você está dominando as ferramentas como um verdadeiro caverneiro. Sua concentração está afiada como uma lâmina.",
        tone: "congratulatory"
      },
      {
        id: "foco_daily",
        level: 3,
        trigger: "daily_checkin",
        message: "Foco é como um músculo - quanto mais você treina, mais forte fica. Continue exercitando sua concentração!",
        tone: "motivational"
      }
    ]
  },
  {
    id: 4,
    name: "A Descoberta",
    theme: "Descobrindo Seu Verdadeiro Potencial",
    description: "O momento da verdadeira descoberta. Hora de encontrar sua essência.",
    min_points: 5001,
    max_points: 8500,
    color: "#7C3AED", // Purple
    icon: "🔍",
    milestones: [
      {
        id: "challenge_complete",
        name: "Desafio Conquistado",
        description: "Complete o Desafio Caverna de 40 dias",
        points_reward: 200,
        badge_reward: "transformado",
        level_required: 4,
        category: "special",
        requirements: [{ type: "challenge_complete", target_value: 1 }]
      },
      {
        id: "month_streak",
        name: "Consistência Absoluta",
        description: "Mantenha um streak de 30 dias",
        points_reward: 100,
        level_required: 4,
        category: "monthly",
        requirements: [{ type: "login_streak", target_value: 30 }]
      },
      {
        id: "dream_board",
        name: "Visionário",
        description: "Crie seu quadro dos sonhos completo",
        points_reward: 80,
        level_required: 4,
        category: "special",
        requirements: [{ type: "goals_achieved", target_value: 5 }]
      }
    ],
    capitao_messages: [
      {
        id: "transformacao_levelup",
        level: 4,
        trigger: "level_up",
        message: "Chegou a hora do grande desafio! Você está pronto para a transformação mais profunda da sua vida. Confio em você, guerreiro!",
        tone: "motivational"
      },
      {
        id: "transformacao_challenge",
        level: 4,
        trigger: "challenge_start",
        message: "40 dias que podem mudar sua vida para sempre. Eu estarei com você em cada passo dessa jornada. Vamos juntos!",
        tone: "supportive"
      }
    ]
  },
  {
    id: 5,
    name: "O Discernimento",
    theme: "Sabedoria e Discernimento",
    description: "Desenvolva sabedoria profunda e discernimento aguçado.",
    min_points: 8501,
    max_points: 15000,
    color: "#059669", // Green
    icon: "🧠",
    milestones: [
      {
        id: "two_month_streak",
        name: "Mestre da Consistência",
        description: "Mantenha um streak de 60 dias",
        points_reward: 150,
        badge_reward: "mestre",
        level_required: 5,
        category: "monthly",
        requirements: [{ type: "login_streak", target_value: 60 }]
      },
      {
        id: "big_goals",
        name: "Grande Conquistador",
        description: "Complete 10 metas grandes",
        points_reward: 200,
        level_required: 5,
        category: "special",
        requirements: [{ type: "goals_achieved", target_value: 10 }]
      },
      {
        id: "community_leader",
        name: "Líder Comunitário",
        description: "Ajude outros usuários na comunidade",
        points_reward: 120,
        level_required: 5,
        category: "monthly",
        requirements: [{ type: "community_posts", target_value: 20 }]
      }
    ],
    capitao_messages: [
      {
        id: "maestria_levelup",
        level: 5,
        trigger: "level_up",
        message: "Você se tornou um mestre! Agora é hora de guiar outros na jornada. Sua experiência é um farol para quem ainda está na escuridão.",
        tone: "congratulatory"
      },
      {
        id: "maestria_daily",
        level: 5,
        trigger: "daily_checkin",
        message: "Um mestre nunca para de aprender. Continue refinando suas habilidades e inspirando outros com seu exemplo.",
        tone: "encouraging"
      }
    ]
  },
  {
    id: 6,
    name: "A Ascensão",
    theme: "Ascendendo a Novos Patamares",
    description: "Use sua transformação para ascender e impactar outros positivamente.",
    min_points: 15001,
    max_points: 25000,
    color: "#EA580C", // Orange
    icon: "🚀",
    milestones: [
      {
        id: "hundred_day_streak",
        name: "Lenda da Consistência",
        description: "Mantenha um streak de 100 dias",
        points_reward: 300,
        badge_reward: "influenciador",
        level_required: 6,
        category: "special",
        requirements: [{ type: "login_streak", target_value: 100 }]
      },
      {
        id: "referral_master",
        name: "Multiplicador",
        description: "Indique e ajude 5 novos usuários ativos",
        points_reward: 250,
        level_required: 6,
        category: "special",
        requirements: [{ type: "community_posts", target_value: 50 }]
      },
      {
        id: "transformation_story",
        name: "Inspirador",
        description: "Compartilhe sua história de transformação",
        points_reward: 200,
        level_required: 6,
        category: "special",
        requirements: [{ type: "community_posts", target_value: 30 }]
      }
    ],
    capitao_messages: [
      {
        id: "influencia_levelup",
        level: 6,
        trigger: "level_up",
        message: "Sua luz inspira outros a saírem de suas cavernas! Você se tornou um farol de esperança. Continue brilhando e iluminando o caminho.",
        tone: "celebratory"
      },
      {
        id: "influencia_encouragement",
        level: 6,
        trigger: "encouragement",
        message: "Lembre-se: sua jornada não é só sua. Cada passo que você dá inspira alguém a dar o primeiro passo também.",
        tone: "motivational"
      }
    ]
  },
  {
    id: 7,
    name: "A Lenda",
    theme: "Legado Eterno",
    description: "O nível mais alto. Você se tornou uma lenda e agora cria um legado duradouro.",
    min_points: 25001,
    max_points: 999999,
    color: "#FBBF24", // Gold
    icon: "🏆",
    milestones: [
      {
        id: "year_streak",
        name: "Imortal da Disciplina",
        description: "Mantenha um streak de 365 dias",
        points_reward: 500,
        badge_reward: "transcendente",
        level_required: 7,
        category: "special",
        requirements: [{ type: "login_streak", target_value: 365 }]
      },
      {
        id: "life_transformation",
        name: "Transformação Completa",
        description: "Documente sua transformação de vida completa",
        points_reward: 1000,
        level_required: 7,
        category: "special",
        requirements: [{ type: "challenge_complete", target_value: 3 }]
      },
      {
        id: "legacy_builder",
        name: "Construtor de Legado",
        description: "Inspire centenas de pessoas em sua jornada",
        points_reward: 750,
        level_required: 7,
        category: "special",
        requirements: [{ type: "community_posts", target_value: 100 }]
      }
    ],
    capitao_messages: [
      {
        id: "transcendencia_levelup",
        level: 7,
        trigger: "level_up",
        message: "Você transcendeu! Agora é um Caverna Mestre, um exemplo eterno de transformação. Seu legado inspirará gerações.",
        tone: "celebratory"
      },
      {
        id: "transcendencia_daily",
        level: 7,
        trigger: "daily_checkin",
        message: "Mestre, sua presença aqui é um presente para todos. Continue sendo o exemplo vivo de que a transformação é possível.",
        tone: "encouraging"
      }
    ]
  }
]

export const BADGES: Badge[] = [
  {
    id: "explorador",
    name: "Explorador",
    description: "Deu os primeiros passos na jornada",
    icon: "🗺️",
    color: "#6B7280",
    rarity: "common",
    points_reward: 20,
    level_required: 1,
    category: "milestone"
  },
  {
    id: "disciplinado",
    name: "Disciplinado",
    description: "Estabeleceu hábitos consistentes",
    icon: "⚔️",
    color: "#DC2626",
    rarity: "common",
    points_reward: 50,
    level_required: 2,
    category: "streak"
  },
  {
    id: "focado",
    name: "Focado",
    description: "Dominou as ferramentas de produtividade",
    icon: "🎯",
    color: "#2563EB",
    rarity: "rare",
    points_reward: 80,
    level_required: 3,
    category: "productivity"
  },
  {
    id: "transformado",
    name: "Transformado",
    description: "Completou o Desafio Caverna",
    icon: "⚡",
    color: "#7C3AED",
    rarity: "epic",
    points_reward: 200,
    level_required: 4,
    category: "challenge"
  },
  {
    id: "mestre",
    name: "Mestre",
    description: "Alcançou excelência em todas as áreas",
    icon: "👑",
    color: "#059669",
    rarity: "epic",
    points_reward: 150,
    level_required: 5,
    category: "milestone"
  },
  {
    id: "influenciador",
    name: "Influenciador",
    description: "Inspira outros com sua transformação",
    icon: "🌟",
    color: "#EA580C",
    rarity: "legendary",
    points_reward: 300,
    level_required: 6,
    category: "community"
  },
  {
    id: "transcendente",
    name: "Transcendente",
    description: "Atingiu o nível mais alto de consciência",
    icon: "🏆",
    color: "#FBBF24",
    rarity: "legendary",
    points_reward: 500,
    level_required: 7,
    category: "milestone"
  }
]

export const POINTS_ACTIVITIES = {
  // Daily Activities (1-5 points)
  login: { points: 1, description: "Login diário" },
  ritual_complete: { points: 2, description: "Ritual completado" },
  pomodoro_session: { points: 1, description: "Sessão Pomodoro" },
  exercise_logged: { points: 2, description: "Exercício registrado" },
  meal_planned: { points: 1, description: "Refeição planejada" },

  // Weekly Activities (5-20 points)
  weekly_streak: { points: 5, description: "Streak semanal mantido" },
  weekly_goals_complete: { points: 10, description: "Metas semanais completas" },
  community_participation: { points: 8, description: "Participação ativa na comunidade" },
  course_lesson: { points: 15, description: "Aula de curso completada" },

  // Monthly Activities (20-100 points)
  challenge_complete: { points: 100, description: "Desafio Caverna completado" },
  monthly_streak: { points: 25, description: "Streak mensal mantido" },
  big_goal_achieved: { points: 50, description: "Meta grande alcançada" },
  referral_active: { points: 30, description: "Usuário indicado ativo" },

  // Special Milestones (50-500 points)
  first_challenge: { points: 200, description: "Primeiro Desafio Caverna" },
  hundred_day_streak: { points: 300, description: "Streak de 100 dias" },
  transformation_documented: { points: 500, description: "Transformação documentada" },
  community_leadership: { points: 400, description: "Liderança comunitária" }
}