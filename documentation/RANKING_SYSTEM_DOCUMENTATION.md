# Modo Caverna - Sistema de Ranking e Jornada de Transformação

## Análise do Sistema Atual

### Estrutura de Usuário e Pontuação
Baseado na análise do código, o sistema atual possui:

**Campos de Usuário Relacionados ao Ranking:**
- `score: string` - Pontuação atual do usuário
- `level: string` - Nível atual do usuário
- `login_streak: string` - Sequência de logins consecutivos
- `login_tag: string` - Tag relacionada ao login

**Sistema de Desafios:**
- Desafio Caverna com 40 dias de duração
- Sistema de pontos baseado em metas (`challenge.meta`)
- Tracking de dias completados vs. dias alvo
- Visualização de progresso com barras e troféus

**Gamificação Existente:**
- Sistema de pontos no componente `ChallengePoints`
- Ranking de prêmios mencionado nos planos
- Sistema de streak de login
- Badges e troféus visuais

### Hubs Atuais do Dashboard
1. **Central Caverna** - Hub principal com streak, rituais, eventos, desafios
2. **Ordem no Caos** - Organização e planejamento
3. **Forja do Templo** - Desenvolvimento pessoal e wellness
4. **Cursos & Networking** - Educação e comunidade
5. **Área de Benefícios** - Programa de afiliados e recompensas

## Proposta: Os 7 Níveis de Transformação com Capitão Caverna

### Conceito Central
Uma jornada progressiva de transformação pessoal guiada pelo **Capitão Caverna**, um AI mentor que acompanha o usuário através de 7 níveis distintos de consciência e desenvolvimento.

### Os 7 Níveis da Jornada

#### Nível 1: **Despertar** (0-100 pontos)
- **Tema:** Reconhecimento e Consciência
- **Foco:** Primeiro contato com o Modo Caverna
- **Atividades Principais:**
  - Completar onboarding
  - Primeiro login streak (7 dias)
  - Explorar todos os 5 hubs
  - Definir primeira meta
- **Capitão Caverna:** Apresenta-se como guia, explica a jornada
- **Recompensas:** Badge "Explorador", acesso básico às ferramentas

#### Nível 2: **Compromisso** (101-300 pontos)
- **Tema:** Estabelecimento de Disciplina
- **Foco:** Criar hábitos consistentes
- **Atividades Principais:**
  - Login streak de 14 dias
  - Completar primeiro ritual matinal/noturno
  - Usar Pomodoro por 5 sessões
  - Fazer primeira anotação
- **Capitão Caverna:** Ensina sobre disciplina e consistência
- **Recompensas:** Badge "Disciplinado", unlock de recursos avançados

#### Nível 3: **Foco** (301-600 pontos)
- **Tema:** Concentração e Produtividade
- **Foco:** Dominar ferramentas de produtividade
- **Atividades Principais:**
  - 30 sessões de Pomodoro completadas
  - Organizar agenda por 1 semana completa
  - Completar 3 metas pequenas
  - Participar da comunidade (5 posts/comentários)
- **Capitão Caverna:** Orienta sobre gestão de tempo e prioridades
- **Recompensas:** Badge "Focado", acesso a recursos premium

#### Nível 4: **Transformação** (601-1000 pontos)
- **Tema:** Mudanças Profundas
- **Foco:** Iniciar o Desafio Caverna
- **Atividades Principais:**
  - Completar Desafio Caverna (40 dias)
  - Manter streak de 30 dias
  - Criar quadro dos sonhos completo
  - Completar curso do Modo Caverna
- **Capitão Caverna:** Acompanha intensivamente durante o desafio
- **Recompensas:** Badge "Transformado", status especial na comunidade

#### Nível 5: **Maestria** (1001-1500 pontos)
- **Tema:** Excelência e Liderança
- **Foco:** Dominar todas as ferramentas
- **Atividades Principais:**
  - Streak de 60 dias
  - Completar 10 metas grandes
  - Mentorear outros usuários
  - Criar conteúdo para comunidade
- **Capitão Caverna:** Reconhece como líder em formação
- **Recompensas:** Badge "Mestre", privilégios de moderação

#### Nível 6: **Influência** (1501-2500 pontos)
- **Tema:** Impacto e Inspiração
- **Foco:** Influenciar positivamente outros
- **Atividades Principais:**
  - Streak de 100 dias
  - Indicar e ajudar 5 novos usuários
  - Liderar grupos na comunidade
  - Compartilhar transformações
- **Capitão Caverna:** Celebra como exemplo para outros
- **Recompensas:** Badge "Influenciador", acesso a eventos exclusivos

#### Nível 7: **Transcendência** (2501+ pontos)
- **Tema:** Sabedoria e Legado
- **Foco:** Criar impacto duradouro
- **Atividades Principais:**
  - Streak de 365 dias
  - Transformar vida completamente
  - Inspirar centenas de pessoas
  - Contribuir para evolução da plataforma
- **Capitão Caverna:** Reconhece como "Caverna Mestre"
- **Recompensas:** Badge "Transcendente", status lendário

### Sistema de Pontuação Detalhado

#### Atividades Diárias (1-5 pontos)
- Login diário: 1 ponto
- Completar ritual: 2 pontos
- Sessão Pomodoro: 1 ponto
- Exercício registrado: 2 pontos
- Refeição planejada: 1 ponto

#### Atividades Semanais (5-20 pontos)
- Manter streak semanal: 5 pontos
- Completar todas as metas da semana: 10 pontos
- Participar ativamente na comunidade: 8 pontos
- Completar aula de curso: 15 pontos

#### Atividades Mensais (20-100 pontos)
- Completar Desafio Caverna: 100 pontos
- Manter streak mensal: 25 pontos
- Alcançar meta grande: 50 pontos
- Indicar novo usuário ativo: 30 pontos

#### Marcos Especiais (50-500 pontos)
- Primeiro Desafio Caverna: 200 pontos
- Streak de 100 dias: 300 pontos
- Transformação documentada: 500 pontos
- Liderança comunitária: 400 pontos

### Capitão Caverna - Persona AI

#### Características da Persona
- **Nome:** Capitão Caverna
- **Personalidade:** Sábio, encorajador, direto mas compassivo
- **Estilo:** Linguagem motivacional brasileira, usa metáforas de caverna/montanha
- **Função:** Mentor, guia, celebrador de conquistas

#### Interações por Nível
1. **Despertar:** "Bem-vindo à caverna, explorador! Sua jornada de transformação começa agora."
2. **Compromisso:** "Vejo que você está levando a sério. A disciplina é a chave para sair da escuridão."
3. **Foco:** "Excelente foco! Você está dominando as ferramentas como um verdadeiro caverneiro."
4. **Transformação:** "Chegou a hora do grande desafio. Confio em você, guerreiro!"
5. **Maestria:** "Você se tornou um mestre. Agora é hora de guiar outros."
6. **Influência:** "Sua luz inspira outros a saírem de suas cavernas. Continue brilhando!"
7. **Transcendência:** "Você transcendeu. Agora é um Caverna Mestre, um exemplo eterno."

#### Mensagens Contextuais
- **Streak perdido:** "Todo mestre já tropeçou. O importante é levantar e continuar."
- **Meta alcançada:** "Mais uma conquista! Você está provando que é capaz de qualquer coisa."
- **Desafio iniciado:** "40 dias que podem mudar sua vida para sempre. Estou com você!"
- **Nível subido:** "Parabéns! Você evoluiu para o próximo nível da jornada."

### Implementação Técnica

#### Estrutura de Dados
```typescript
interface UserLevel {
  current_level: number
  current_points: number
  points_to_next_level: number
  level_name: string
  level_theme: string
  badges_earned: Badge[]
  milestones_completed: Milestone[]
}

interface Badge {
  id: string
  name: string
  description: string
  icon: string
  earned_at: Date
  level_required: number
}

interface Milestone {
  id: string
  name: string
  description: string
  points_reward: number
  completed: boolean
  completed_at?: Date
}
```

#### Componentes Necessários
1. **LevelProgressBar** - Barra de progresso do nível atual
2. **CapitaoCavernaChat** - Interface de chat com o mentor AI
3. **BadgeCollection** - Coleção de badges conquistados
4. **MilestoneTracker** - Acompanhamento de marcos
5. **LevelUpModal** - Modal de celebração de subida de nível
6. **TransformationJourney** - Visualização da jornada completa

### Integração com Sistema Atual

#### Dashboard Central
- Adicionar widget de progresso de nível
- Integrar Capitão Caverna como assistente sempre presente
- Mostrar próximos marcos e objetivos

#### Sistema de Desafios
- Integrar pontuação com níveis
- Capitão Caverna como guia durante desafios
- Marcos especiais para conclusão de desafios

#### Comunidade
- Badges visíveis nos perfis
- Ranking por níveis
- Mentoria entre níveis diferentes

### Roadmap de Implementação

#### Fase 1: Fundação (2 semanas)
- Implementar sistema básico de níveis e pontos
- Criar componente de progresso
- Integrar com dados existentes do usuário

#### Fase 2: Capitão Caverna (3 semanas)
- Desenvolver persona AI
- Implementar sistema de mensagens contextuais
- Criar interface de chat/interação

#### Fase 3: Gamificação Completa (4 semanas)
- Sistema completo de badges e marcos
- Integração com todas as atividades
- Celebrações e recompensas

#### Fase 4: Refinamento (2 semanas)
- Balanceamento de pontuação
- Otimização de performance
- Testes e ajustes finais

### Métricas de Sucesso
- Aumento no engagement diário (meta: +40%)
- Maior retenção de usuários (meta: +60%)
- Aumento na conclusão de desafios (meta: +50%)
- Maior participação na comunidade (meta: +80%)
- Redução na taxa de churn (meta: -30%)

### Considerações Especiais
- Sistema deve ser retroativo para usuários existentes
- Balanceamento cuidadoso para não ser muito fácil nem difícil
- Capitão Caverna deve ser consistente com a marca Modo Caverna
- Integração suave com funcionalidades existentes
- Possibilidade de reset/recomeço da jornada