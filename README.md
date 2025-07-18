# Modo Caverna 🐺

> **Desperte a sua melhor versão** - Ative o MODO CAVERNA e acelere a conquista dos seus sonhos.

Uma plataforma completa de produtividade e desenvolvimento pessoal que combina desafios estruturados, ferramentas de produtividade e engajamento comunitário em um ambiente gamificado.

![Next.js](https://img.shields.io/badge/Next.js-15.3.2-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4.2-blue?logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4.1-38B2AC?logo=tailwind-css)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)

## 🚀 Visão Geral

**Modo Caverna** é uma aplicação web moderna que oferece um ecossistema completo para transformação pessoal e profissional:

### 🎯 Principais Funcionalidades

- **🏆 Desafio Caverna**: Programa estruturado de transformação pessoal
- **⏰ Produtividade**: Timer Pomodoro, gestão de tarefas e flow states
- **🎯 Gestão de Metas**: Sistema de definição e acompanhamento de metas
- **💰 Controle Financeiro**: Gerenciador de finanças pessoais
- **📚 Base de Conhecimento**: Biblioteca de cursos, livros e vídeos
- **📝 Anotações**: Editor de texto rico com recursos avançados
- **👥 Comunidade**: Rede social com feed, perfis e interações
- **📅 Agenda**: Integração completa com Google Calendar
- **🏅 Gamificação**: Sistema de pontos, rankings e conquistas
- **💸 Programa de Afiliados**: "Indique e Ganhe" com comissões

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


## 🐺 Sobre o Modo Caverna

O Modo Caverna representa um estado mental de foco total, onde eliminamos distrações e nos dedicamos completamente aos nossos objetivos. Nossa plataforma foi criada para facilitar essa transformação, oferecendo as ferramentas necessárias para:

- Reduzir procrastinação, ansiedade e distrações
- Aumentar propósito, foco e produtividade
- Acelerar a conquista de sonhos e objetivos
- Construir uma comunidade de pessoas em transformação

---

**Ative o MODO CAVERNA e desperte sua melhor versão! 🐺**
