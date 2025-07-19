# Modo Caverna 🐺

> **Desperte a sua melhor versão** - Ative o MODO CAVERNA e acelere a conquista dos seus sonhos.

Uma plataforma completa de produtividade e desenvolvimento pessoal que combina desafios estruturados, ferramentas de produtividade e engajamento comunitário em um ambiente gamificado com sistema de transformação em 7 níveis.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11.18.0-ff69b4?logo=framer)

## ✨ Novidades Recentes

### 🏆 Sistema de Ranking e Transformação
- **7 Níveis de Transformação**: O Despertar → A Ruptura → O Chamado → A Descoberta → O Discernimento → A Ascensão → A Lenda
- **CavePoints (CP)**: Sistema de pontuação gamificado com 55+ atividades que geram pontos
- **Rankings em Tempo Real**: Competição saudável entre usuários com leaderboards dinâmicos
- **Animações Fluidas**: Contadores animados e transições suaves para engajamento máximo
- **Área de Benefícios**: Hub dedicado com widget de ranking integrado

## 🚀 Visão Geral

**Modo Caverna** é uma aplicação web moderna que oferece um ecossistema completo para transformação pessoal e profissional:

### 🎯 Principais Funcionalidades

#### 🏆 Sistema de Transformação Gamificado
- **7 Níveis Evolutivos**: Jornada estruturada de crescimento pessoal
- **CavePoints (CP)**: Sistema de pontuação com 55+ atividades recompensadas
- **Rankings Dinâmicos**: Competição saudável com leaderboards em tempo real
- **Área de Benefícios**: Hub exclusivo com descontos e recompensas por nível

#### ⚡ Produtividade & Foco
- **Timer Pomodoro**: Técnica de foco com sessões cronometradas
- **Flow States**: Monitoramento de estados de alta performance
- **Gestão de Tarefas**: Sistema Kanban integrado com drag & drop
- **Analytics**: Métricas detalhadas de produtividade

#### 🎯 Desenvolvimento Pessoal
- **Desafio Caverna**: Programa de 40 dias de transformação
- **Gestão de Metas**: Sistema completo de objetivos e sonhos
- **Dream Board**: Quadro visual de metas com upload de imagens
- **Acompanhamento**: Progress tracking com gráficos e insights

#### 💡 Conhecimento & Aprendizado
- **Base de Conhecimento**: Biblioteca de cursos, livros e vídeos
- **Editor Rico**: Anotações com Tiptap e recursos avançados
- **Members Area**: Conteúdo exclusivo para assinantes
- **Streaming**: Integração com Mux para vídeos de alta qualidade

#### 👥 Comunidade & Social
- **Feed Social**: Posts, comentários e interações
- **Perfis Personalizados**: Sistema completo de perfis de usuário
- **Notificações**: Sistema de notificações em tempo real
- **Programa de Afiliados**: "Indique e Ganhe" com comissões

#### 🔧 Ferramentas Integradas
- **Agenda**: Integração completa com Google Calendar
- **Controle Financeiro**: Gerenciador de finanças pessoais
- **Exercícios**: Tracking de atividades físicas e medidas corporais
- **Refeições**: Planejamento nutricional e controle alimentar

## 🛠️ Stack Tecnológica

### Core Framework
```
Next.js 15.3.2      # React framework com App Router
React 18.2.0        # Biblioteca de UI
TypeScript 5.4.2    # Tipagem estática
Node.js             # Runtime JavaScript
```

### Styling & UI
```
Tailwind CSS 3.4.1    # Framework CSS utility-first
Radix UI               # Componentes headless acessíveis
Framer Motion 11.18.0  # Animações e transições
Lucide React           # Biblioteca de ícones
```

### Estado e Dados
```
Zustand 5.0.3          # Gerenciamento de estado leve
TanStack Query 5.66.0  # Cache e sincronização de dados
React Hook Form 7.54.2 # Gerenciamento de formulários
Zod 3.24.1             # Validação de schemas
```

### Autenticação e APIs
```
NextAuth.js 5.0.0-beta.25  # Autenticação
Google OAuth               # Provedor de autenticação
Axios 1.7.9               # Cliente HTTP
Google Calendar API        # Integração de calendário
```

### Recursos Avançados
```
Tiptap 2.11.5      # Editor de texto rico
Mux Player 3.5.0   # Streaming de vídeo
React Dropzone     # Upload de arquivos
HTML2Canvas        # Captura de tela
FullCalendar 6.1.15 # Componente de calendário
DnD Kit            # Drag and drop
Recharts 2.15.0    # Gráficos e visualizações
```

## 🚀 Início Rápido

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Conta Google (para OAuth)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/modo-caverna.git
cd modo-caverna

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais

# Execute em modo de desenvolvimento
npm run dev
```

### Variáveis de Ambiente Necessárias

```env
# Autenticação Google
AUTH_GOOGLE_ID=your_google_client_id
AUTH_GOOGLE_SECRET=your_google_client_secret
NEXTAUTH_SECRET=your_nextauth_secret

# APIs
NEXT_PUBLIC_API_URL=your_api_url
NEXT_PUBLIC_GOOGLE_METRIC_ID=your_ga_id

# Mux (Streaming de Vídeo)
MUX_TOKEN_ID=your_mux_token
MUX_TOKEN_SECRET=your_mux_secret
```

## 📁 Estrutura do Projeto

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Rotas protegidas
│   │   ├── (main)/        # Funcionalidades principais
│   │   │   ├── agenda/    # Sistema de calendário
│   │   │   ├── anotacoes/ # Editor de notas
│   │   │   ├── comunidade/# Rede social
│   │   │   ├── dashboard/ # Dashboard principal
│   │   │   ├── financeiro/# Controle financeiro
│   │   │   └── metas/     # Gestão de objetivos
│   │   └── onboarding/    # Fluxo de integração
│   ├── (public)/          # Rotas públicas
│   └── api/               # API routes
├── components/            # Componentes React
│   ├── ui/               # Componentes base (shadcn/ui)
│   ├── charts/           # Visualizações de dados
│   └── [feature]/        # Componentes por funcionalidade
├── lib/                  # Utilitários e configurações
├── store/               # Estados globais (Zustand)
├── hooks/               # Custom hooks
└── types/               # Definições TypeScript
```

## 🎯 Funcionalidades Detalhadas

### Desafio Caverna
Sistema gamificado de transformação pessoal com:
- Desafios diários estruturados
- Acompanhamento de progresso
- Sistema de pontuação e rankings
- Comunidade de participantes

### Produtividade
- **Timer Pomodoro**: Técnica de foco com intervalos
- **Gestão de Tarefas**: Sistema Kanban integrado
- **Flow States**: Monitoramento de estados de alta performance
- **Métricas**: Analytics detalhados de produtividade

### Comunidade
- Feed social com posts e interações
- Sistema de curtidas e comentários
- Perfis de usuário personalizáveis
- Programa de afiliados integrado

## 🔧 Scripts Disponíveis

```bash
npm run dev          # Servidor de desenvolvimento (com Turbo)
npm run build        # Build de produção
npm run start        # Servidor de produção
npm run lint         # Verificação de código
```

## 🎮 Sistema de CavePoints (CP)

### Como Ganhar Pontos
O sistema de CavePoints recompensa 55+ atividades diferentes:

#### 📈 Atividades Diárias (1-5 CP)
- **Login diário**: 1 CP
- **Sessão Pomodoro**: 5 CP  
- **Exercício registrado**: 2 CP
- **Refeição planejada**: 1 CP

#### 🏆 Desafios & Metas (25-200 CP)
- **Desafio completado**: 100 CP
- **Meta alcançada**: 50 CP
- **Streak de 7 dias**: 3 CP
- **Mandamento cumprido**: 5 CP

#### 👥 Engajamento Comunitário (2-25 CP)
- **Post criado**: 15 CP
- **Comentário útil**: 10 CP
- **Curtida recebida**: 2 CP
- **Top 5 comunidade**: 10 CP

#### 📚 Aprendizado (10-200 CP)
- **Curso finalizado**: 50-100 CP
- **Aula assistida**: 5-10 CP
- **Livro concluído**: 5 CP
- **Vídeo assistido**: 10 CP

### 🏅 Níveis de Transformação

| Nível | Nome | CP Necessários | Benefícios |
|-------|------|----------------|------------|
| 1 | **O Despertar** | 0-500 CP | Acesso básico, 5% desconto |
| 2 | **A Ruptura** | 501-1.200 CP | 10% desconto, conteúdo extra |
| 3 | **O Chamado** | 1.201-2.000 CP | 15% desconto, eventos mensais |
| 4 | **A Descoberta** | 2.001-3.500 CP | 20% desconto, suporte prioritário |
| 5 | **O Discernimento** | 3.501-5.000 CP | 25% desconto, acesso beta |
| 6 | **A Ascensão** | 5.001-8.000 CP | 30% desconto, coaching mensal |
| 7 | **A Lenda** | 8.000+ CP | 40% desconto, programas exclusivos |

## 🎨 Interface & Experiência

### 🌟 Animações & Interações
- **Contadores Animados**: CavePoints contam de 0 até o valor real
- **Transições Suaves**: Hover effects e micro-interações
- **Feedback Visual**: Celebrações de conquistas e level-ups
- **Responsivo**: Design adaptativo para todos os dispositivos

### 🎯 Gamificação Inteligente
- **Progresso Visual**: Barras de progresso para próximo nível
- **Conquistas**: Sistema de badges e reconhecimentos
- **Competição Saudável**: Rankings que motivam sem pressionar
- **Recompensas Tangíveis**: Benefícios reais por engajamento

## 📚 Documentação

Para documentação técnica detalhada, consulte a pasta [`documentation/`](./documentation/):

- [Sistema de Ranking e Transformação](./documentation/RANKING_SYSTEM_DOCUMENTATION.md)
- [Análise do Sistema de Pontos Existente](./documentation/EXISTING_POINTS_ANALYSIS.md)
- [Plano de Integração de Recompensas](./documentation/REWARDS_SYSTEM_INTEGRATION_PLAN.md)
- [Documentação de APIs](./documentation/API_ENDPOINTS_DOCUMENTATION.md)

## 🐺 Sobre o Modo Caverna

O Modo Caverna representa um estado mental de foco total, onde eliminamos distrações e nos dedicamos completamente aos nossos objetivos. Nossa plataforma foi criada para facilitar essa transformação, oferecendo as ferramentas necessárias para:

- Reduzir procrastinação, ansiedade e distrações
- Aumentar propósito, foco e produtividade
- Acelerar a conquista de sonhos e objetivos
- Construir uma comunidade de pessoas em transformação

---

**Ative o MODO CAVERNA e desperte sua melhor versão! 🐺**