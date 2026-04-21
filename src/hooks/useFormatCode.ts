'use client'

import { useState, useRef } from 'react'
import { useActiveCode, useSandpack } from '@codesandbox/sandpack-react'
import type { UseFormatCodeReturn } from '@/lib/types'

export function useFormatCode(): UseFormatCodeReturn {
  const { code, updateCode } = useActiveCode()
  const { sandpack } = useSandpack()
  const [isFormatting, setIsFormatting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const isMountedRef = useRef(true)

  // track mount state
  useState(() => {
    isMountedRef.current = true
    return () => {
      isMountedRef.current = false
    }
  })

  const format = async (): Promise<void> => {
    setIsFormatting(true)
    setError(null)
    try {
      const isCss = sandpack.activeFile.endsWith('.css')
      const prettier = await import('prettier/standalone')
      let formatted: string
      if (isCss) {
        const postcssPlugin = await import('prettier/plugins/postcss')
        formatted = await prettier.format(code, {
          parser: 'css',
          plugins: [postcssPlugin],
          printWidth: 80,
        })
      } else {
        const [babelPlugin, estreePlugin] = await Promise.all([
          import('prettier/plugins/babel'),
          import('prettier/plugins/estree'),
        ])
        formatted = await prettier.format(code, {
          parser: 'babel',
          plugins: [babelPlugin, estreePlugin],
          semi: false,
          singleQuote: true,
          printWidth: 80,
          trailingComma: 'es5',
        })
      }
      if (isMountedRef.current) {
        updateCode(formatted)
      }
    } catch (err) {
      if (isMountedRef.current) {
        setError(err instanceof Error ? err.message : 'Format failed')
      }
    } finally {
      if (isMountedRef.current) {
        setIsFormatting(false)
      }
    }
  }

  return { format, isFormatting, error }
}
