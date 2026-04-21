'use client'

import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { setStoredFiles } from '@/lib/storage'
import type { SandboxId } from '@/lib/types'

interface StorageSyncerProps {
  sandboxId: SandboxId
}

export function StorageSyncer({ sandboxId }: StorageSyncerProps) {
  const { sandpack } = useSandpack()

  const save = useDebouncedCallback(
    (files: Record<string, string>) => {
      setStoredFiles(sandboxId, files)
    },
    600
  )

  useEffect(() => {
    const plainFiles: Record<string, string> = {}
    for (const [path, file] of Object.entries(sandpack.files)) {
      plainFiles[path] = file.code
    }
    save(plainFiles)
  }, [sandpack.files, save])

  return null
}
