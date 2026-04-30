import { useEffect, useMemo, useRef } from 'react'

const clamp01 = (x) => Math.max(0, Math.min(1, x))

export function Pitch({
  phase,
  outcome,
  onBowlingArrived,
  onBattingFinished,
}) {
  const ballRef = useRef(null)
  const batRef = useRef(null)
  const trailRef = useRef(null)

  const isWicket = outcome === 'W'
  const isBoundary = outcome === '4' || outcome === '6'

  const ballTarget = useMemo(() => {
    // x: 0 is bowler end, 1 is batsman end
    if (phase === 'bowling') return { x: 0.88, y: 0.58 }
    if (phase === 'result') {
      if (isWicket) return { x: 0.92, y: 0.62 } // past bat / stumps
      if (isBoundary) return { x: 0.1, y: 0.22 } // "launched" away
      return { x: 0.25, y: 0.5 } // gentle shot
    }
    return { x: 0.12, y: 0.42 } // idle at bowler hand
  }, [phase, isWicket, isBoundary])

  useEffect(() => {
    const el = ballRef.current
    if (!el) return

    const start = { x: 0.12, y: 0.42 }
    const end = ballTarget

    el.style.setProperty('--bx', `${start.x}`)
    el.style.setProperty('--by', `${start.y}`)
    // force layout so transition applies consistently
    // eslint-disable-next-line no-unused-expressions
    el.offsetHeight
    el.style.setProperty('--bx', `${clamp01(end.x)}`)
    el.style.setProperty('--by', `${clamp01(end.y)}`)
  }, [ballTarget])

  useEffect(() => {
    if (phase !== 'bowling') return
    const t = setTimeout(() => onBowlingArrived?.(), 850)
    return () => clearTimeout(t)
  }, [phase, onBowlingArrived])

  useEffect(() => {
    const bat = batRef.current
    if (!bat) return
    if (phase !== 'result') return

    bat.classList.remove('isSwing')
    // eslint-disable-next-line no-unused-expressions
    bat.offsetHeight
    bat.classList.add('isSwing')
    const t = setTimeout(() => onBattingFinished?.(), 550)
    return () => clearTimeout(t)
  }, [phase, onBattingFinished])

  useEffect(() => {
    const trail = trailRef.current
    if (!trail) return
    trail.classList.toggle('isOn', phase === 'result' && isBoundary)
  }, [phase, isBoundary])

  return (
    <div className="pitch" role="img" aria-label="Cricket pitch">
      <div className="field">
        <div className="field__oval" />
        <div className="field__strip" />
        <div className="stumps stumps--left" />
        <div className="stumps stumps--right" />

        <div className="batsman">
          <div className="batsman__body" />
          <div ref={batRef} className="batsman__bat" />
        </div>

        <div ref={trailRef} className="ballTrail" aria-hidden="true" />
        <div ref={ballRef} className="ball" aria-hidden="true" />
      </div>
    </div>
  )
}

