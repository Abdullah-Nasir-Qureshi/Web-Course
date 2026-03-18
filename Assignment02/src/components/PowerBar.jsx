import { useMemo } from 'react'
import { buildRanges } from '../game/probabilities'

export function PowerBar({
  segments,
  sliderPos01,
  disabled = false,
  onShoot,
}) {
  const ranges = useMemo(() => buildRanges(segments), [segments])

  return (
    <div className={`powerBar ${disabled ? 'isDisabled' : ''}`}>
      <div className="powerBar__labelRow">
        <div className="powerBar__title">Probability Power Bar</div>
        <div className="powerBar__hint">
          Slider position determines outcome (no randomness)
        </div>
      </div>

      <div className="powerBar__track" role="img" aria-label="Power bar">
        {ranges.map((r) => (
          <div
            key={`${r.outcome}-${r.start}`}
            className="powerBar__seg"
            style={{
              width: `${(r.end - r.start) * 100}%`,
              background: r.segment.color,
            }}
            title={`${r.segment.label} (${r.segment.p.toFixed(2)})`}
          >
            <span className="powerBar__segText">{r.segment.label}</span>
          </div>
        ))}

        <div
          className="powerBar__slider"
          style={{ left: `${sliderPos01 * 100}%` }}
          aria-hidden="true"
        >
          <div className="powerBar__sliderKnob" />
          <div className="powerBar__sliderStem" />
        </div>
      </div>

      <button
        className="btn btnPrimary"
        type="button"
        onClick={onShoot}
        disabled={disabled}
      >
        Play Shot
      </button>
    </div>
  )
}

