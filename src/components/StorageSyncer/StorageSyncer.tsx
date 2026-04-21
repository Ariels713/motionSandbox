'use client'

import { useEffect } from 'react'
import { useSandpack } from '@codesandbox/sandpack-react'
import { useDebouncedCallback } from '@/hooks/useDebouncedCallback'
import { setInstanceFiles } from '@/lib/storage'

interface StorageSyncerProps {
  instanceId: string
}

export function StorageSyncer({ instanceId }: StorageSyncerProps) {
  const { sandpack } = useSandpack()

  const save = useDebouncedCallback(
    (files: Record<string, string>) => {
      setInstanceFiles(instanceId, files)
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
