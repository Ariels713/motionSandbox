import { useRef, useEffect, useCallback } from 'react'

export function useDebouncedCallback<T extends (...args: never[]) => void>(
  fn: T,
  delay: number
): T {
  const fnRef = useRef(fn)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    fnRef.current = fn
  }, [fn])

  useEffect(() => {
    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return useCallback(
    (...args: Parameters<T>) => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current)
      }
      timerRef.current = setTimeout(() => {
        fnRef.current(...args)
      }, delay)
    },
    [delay]
  ) as T
}
