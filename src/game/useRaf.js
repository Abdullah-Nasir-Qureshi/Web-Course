import { useEffect, useRef } from 'react'

/**
 * requestAnimationFrame loop that calls `onFrame(dtMs, nowMs)`.
 * @param {(dtMs: number, nowMs: number) => void} onFrame
 * @param {boolean} enabled
 */
export function useRaf(onFrame, enabled = true) {
  const cbRef = useRef(onFrame)
  cbRef.current = onFrame

  const rafRef = useRef(0)
  const lastRef = useRef(0)

  useEffect(() => {
    if (!enabled) return
    let mounted = true

    function tick(now) {
      if (!mounted) return
      const last = lastRef.current || now
      const dt = Math.min(64, Math.max(0, now - last))
      lastRef.current = now
      cbRef.current(dt, now)
      rafRef.current = requestAnimationFrame(tick)
    }

    rafRef.current = requestAnimationFrame(tick)
    return () => {
      mounted = false
      cancelAnimationFrame(rafRef.current)
      rafRef.current = 0
      lastRef.current = 0
    }
  }, [enabled])
}

