import { useMemo } from 'react'
import type { SandboxId } from '@/lib/types'
import { getInstanceFiles } from '@/lib/storage'
import { TEMPLATES } from '@/lib/templates'

export function useSandboxStorage(templateId: SandboxId, instanceId: string): Record<string, string> {
  return useMemo(() => {
    const stored = getInstanceFiles(instanceId)
    if (stored) return stored
    return TEMPLATES[templateId].files
  }, [templateId, instanceId])
}
