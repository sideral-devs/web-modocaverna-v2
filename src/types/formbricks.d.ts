export {}

declare global {
  interface Window {
    formbricks?: {
      setup: (config: { environmentId: string; appUrl?: string }) => void
      identify: (userId: string, traits?: Record<string, unknown>) => void
      logout: () => void
    }
  }
}
