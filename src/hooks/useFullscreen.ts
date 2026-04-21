'use client'

import { useState, useEffect, useCallback, type RefObject } from 'react'
import type { UseFullscreenReturn } from '@/lib/types'

export function useFullscreen(ref: RefObject<HTMLElement | null>): UseFullscreenReturn {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    const handler = () => {
      setIsFullscreen(document.fullscreenElement !== null)
    }
    document.addEventListener('fullscreenchange', handler)
    return () => {
      document.removeEventListener('fullscreenchange', handler)
    }
  }, [])

  const toggle = useCallback(async () => {
    if (!ref.current) return
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await ref.current.requestFullscreen()
    }
  }, [ref])

  return { isFullscreen, toggle }
}
