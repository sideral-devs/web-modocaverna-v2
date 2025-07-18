# Project Structure

## Next.js App Router Architecture

```
src/
├── app/                    # Next.js App Router
│   ├── (protected)/        # Protected routes group
│   │   ├── (main)/        # Main app features
│   │   │   ├── agenda/    # Calendar/scheduling
│   │   │   ├── anotacoes/ # Notes system
│   │   │   ├── comunidade/# Community features
│   │   │   ├── conhecimento/# Knowledge/courses
│   │   │   ├── dashboard/ # Main dashboard with 5 hubs
│   │   │   ├── desafio-caverna/# Challenge system
│   │   │   ├── exercicios/# Exercise tracking
│   │   │   ├── financeiro/# Financial tracking
│   │   │   ├── flow-produtividade/# Productivity flow
│   │   │   ├── indique-e-ganhe/# Affiliate program
│   │   │   ├── lei-da-atracao/# Law of attraction
│   │   │   ├── members-area/# Member exclusive content
│   │   │   ├── metas/     # Goals/objectives
│   │   │   ├── refeicoes/ # Meal planning
│   │   │   └── settings/  # User settings
│   │   └── onboarding/    # User onboarding flow
│   ├── (public)/          # Public routes (auth, landing)
│   │   ├── login/         # Authentication
│   │   ├── sign-up/       # Registration
│   │   ├── forgot-password/# Password recovery
│   │   └── trial/         # Trial signup
│   └── api/               # API routes
├── components/            # Reusable React components
│   ├── ui/               # Base UI components (shadcn/ui style)
│   ├── charts/           # Data visualization components
│   ├── community/        # Community-specific components
│   ├── dreamboard/       # Dream board functionality
│   ├── exercicios/       # Exercise tracking components
│   ├── modals/           # Modal dialogs
│   ├── plans/            # Subscription plan components
│   ├── refeicoes/        # Meal planning components
│   ├── tip-tap/          # Rich text editor components
│   └── tours/            # User onboarding tours
├── lib/                  # Utility libraries
│   ├── api/             # API client functions
│   ├── utils.ts         # Common utilities
│   ├── constants.ts     # App constants
│   └── env.ts           # Environment configuration
├── store/               # Zustand state stores
├── hooks/               # Custom React hooks
│   └── queries/         # TanStack Query hooks
├── types/               # TypeScript type definitions
└── constants/           # App-wide constants
```

## Key Conventions

### Route Organization
- **Route Groups**: Use `(protected)` and `(public)` for auth-based organization
- **Feature Folders**: Each major feature has its own folder under `(main)/`
- **Nested Layouts**: Each feature can have its own `layout.tsx`
- **Dashboard Hubs**: Central dashboard organized into 5 main hubs

### Component Structure
- **UI Components**: Base components in `components/ui/` following shadcn/ui patterns
- **Feature Components**: Organized by feature domain (exercicios, refeicoes, etc.)
- **Naming**: PascalCase for components, kebab-case for files and folders

### State Management
- **Zustand Stores**: One store per feature/domain in `src/store/`
- **Server State**: TanStack Query hooks in `src/hooks/queries/`
- **Form State**: React Hook Form with Zod validation

### File Naming Patterns
- **Pages**: `page.tsx` (Next.js App Router convention)
- **Layouts**: `layout.tsx` (Next.js App Router convention)
- **Components**: `ComponentName.tsx` or `component-name.tsx`
- **Hooks**: `use-feature-name.ts`
- **Stores**: `feature-store.ts`

### Import Aliases
- `@/*` maps to `src/*` for clean imports
- Prefer absolute imports over relative for better maintainability

### Asset Organization
- **Images**: Organized by feature in `public/images/`
  - `banners/` - Marketing and promotional images
  - `members-area/` - Member-exclusive content images
  - `home/` - Homepage assets
  - `empty-states/` - Empty state illustrations
- **Icons**: SVG icons in `public/icons/`
- **Audio**: Sound files in `public/audio/` (Pomodoro sounds)

## Language & Localization
- **User Interface**: All user-facing content in Portuguese (Brazil)
- **Code**: Component names, variables, and functions in English
- **Comments**: Can be in Portuguese or English
- **Locale**: `pt_BR` for date formatting and localization