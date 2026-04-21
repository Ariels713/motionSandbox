import { useMemo } from 'react'
import type { SandboxId } from '@/lib/types'
import { getStoredFiles } from '@/lib/storage'
import { TEMPLATES } from '@/lib/templates'

export function useSandboxStorage(id: SandboxId): Record<string, string> {
  return useMemo(() => {
    const stored = getStoredFiles(id)
    if (stored) return stored
    return TEMPLATES[id].files
  }, [id])
}
