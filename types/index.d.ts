export type Reading = {
  context?: number
  session?: number
  week?: number
  sessionResets?: string
  weekResets?: string
}

declare module 'claude-code' {
  interface PluginState {
    'usage-bar': { reading: Reading | null }
  }
}
