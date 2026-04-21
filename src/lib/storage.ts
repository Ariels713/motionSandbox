import type { SandboxId, StoredSandboxState } from './types'

const KEY_ACTIVE_TAB = 'sandbox:activeTab'

function filesKey(id: SandboxId): string {
  return `sandbox:${id}:files`
}

export function getStoredFiles(id: SandboxId): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(filesKey(id))
    if (!raw) return null
    const parsed: StoredSandboxState = JSON.parse(raw)
    return parsed.files ?? null
  } catch {
    return null
  }
}

export function setStoredFiles(id: SandboxId, files: Record<string, string>): void {
  try {
    const state: StoredSandboxState = { files, savedAt: Date.now() }
    localStorage.setItem(filesKey(id), JSON.stringify(state))
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function clearStoredFiles(id: SandboxId): void {
  try {
    localStorage.removeItem(filesKey(id))
  } catch {
    // ignore
  }
}

export function getStoredActiveTab(): SandboxId | null {
  try {
    const raw = localStorage.getItem(KEY_ACTIVE_TAB)
    if (raw === 'react' || raw === 'motion') return raw
    return null
  } catch {
    return null
  }
}

export function setStoredActiveTab(id: SandboxId): void {
  try {
    localStorage.setItem(KEY_ACTIVE_TAB, id)
  } catch {
    // ignore
  }
}
