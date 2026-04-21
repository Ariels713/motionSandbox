export type SandboxId = 'react' | 'motion'

export interface SandboxTemplate {
  id: SandboxId
  label: string
  files: Record<string, string>
  dependencies: Record<string, string>
}

export interface StoredSandboxState {
  files: Record<string, string>
  savedAt: number
}

export interface SandboxTabsProps {
  activeTab: SandboxId
  onChange: (tab: SandboxId) => void
}

export interface SandboxWorkspaceProps {
  template: SandboxTemplate
  isVisible: boolean
}

export interface PreviewToolbarProps {
  onReset: () => void
  showLineNumbers: boolean
  onToggleLineNumbers: () => void
  onFormat: () => void
  isFormatting: boolean
  showConsole: boolean
  onToggleConsole: () => void
  isFullscreen: boolean
  onToggleFullscreen: () => void
}

export interface UseFullscreenReturn {
  isFullscreen: boolean
  toggle: () => void
}

export interface UseFormatCodeReturn {
  format: () => Promise<void>
  isFormatting: boolean
  error: string | null
}
