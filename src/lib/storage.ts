import type { SandboxId, SandboxInstance, StoredSandboxState } from './types'

const KEY_ACTIVE_TAB = 'sandbox:activeTab'

function instancesKey(templateId: SandboxId): string {
  return `sandbox:${templateId}:instances`
}

function activeInstanceKey(templateId: SandboxId): string {
  return `sandbox:${templateId}:activeInstance`
}

function instanceFilesKey(instanceId: string): string {
  return `sandbox:instance:${instanceId}:files`
}

export function getInstances(templateId: SandboxId): SandboxInstance[] {
  try {
    const raw = localStorage.getItem(instancesKey(templateId))
    if (!raw) return []
    return JSON.parse(raw) as SandboxInstance[]
  } catch {
    return []
  }
}

export function saveInstances(templateId: SandboxId, instances: SandboxInstance[]): void {
  try {
    localStorage.setItem(instancesKey(templateId), JSON.stringify(instances))
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function getActiveInstanceId(templateId: SandboxId): string | null {
  try {
    return localStorage.getItem(activeInstanceKey(templateId))
  } catch {
    return null
  }
}

export function setActiveInstanceId(templateId: SandboxId, id: string): void {
  try {
    localStorage.setItem(activeInstanceKey(templateId), id)
  } catch {
    // ignore
  }
}

export function getInstanceFiles(instanceId: string): Record<string, string> | null {
  try {
    const raw = localStorage.getItem(instanceFilesKey(instanceId))
    if (!raw) return null
    const parsed: StoredSandboxState = JSON.parse(raw)
    return parsed.files ?? null
  } catch {
    return null
  }
}

export function setInstanceFiles(instanceId: string, files: Record<string, string>): void {
  try {
    const state: StoredSandboxState = { files, savedAt: Date.now() }
    localStorage.setItem(instanceFilesKey(instanceId), JSON.stringify(state))
  } catch {
    // QuotaExceededError — silently ignore
  }
}

export function clearInstanceFiles(instanceId: string): void {
  try {
    localStorage.removeItem(instanceFilesKey(instanceId))
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
