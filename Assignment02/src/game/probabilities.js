export const OUTCOMES = /** @type {const} */ ([
  'W',
  '0',
  '1',
  '2',
  '3',
  '4',
  '6',
])

/**
 * @typedef {'aggressive' | 'defensive'} BattingStyle
 * @typedef {'W' | '0' | '1' | '2' | '3' | '4' | '6'} Outcome
 *
 * @typedef {{ outcome: Outcome, p: number, color: string, label: string }} Segment
 * @typedef {{ style: BattingStyle, segments: Segment[] }} StyleConfig
 */

/**
 * Notes:
 * - Outcome selection is deterministic: based ONLY on slider position.
 * - Each style's total probability sums exactly to 1.
 */
export const STYLE_CONFIGS = /** @type {const} */ ({
  aggressive: {
    style: 'aggressive',
    segments: [
      { outcome: 'W', p: 0.4, color: '#cf2f2f', label: 'Wicket' },
      { outcome: '0', p: 0.1, color: '#777', label: '0' },
      { outcome: '1', p: 0.1, color: '#2aa84a', label: '1' },
      { outcome: '2', p: 0.1, color: '#2f8fdd', label: '2' },
      { outcome: '3', p: 0.05, color: '#8b5cf6', label: '3' },
      { outcome: '4', p: 0.1, color: '#f59e0b', label: '4' },
      { outcome: '6', p: 0.15, color: '#4c1d95', label: '6' },
    ],
  },
  defensive: {
    style: 'defensive',
    segments: [
      { outcome: 'W', p: 0.2, color: '#cf2f2f', label: 'Wicket' },
      { outcome: '0', p: 0.2, color: '#777', label: '0' },
      { outcome: '1', p: 0.2, color: '#2aa84a', label: '1' },
      { outcome: '2', p: 0.15, color: '#2f8fdd', label: '2' },
      { outcome: '3', p: 0.1, color: '#8b5cf6', label: '3' },
      { outcome: '4', p: 0.1, color: '#f59e0b', label: '4' },
      { outcome: '6', p: 0.05, color: '#4c1d95', label: '6' },
    ],
  },
})

export function sumProbabilities(segments) {
  return segments.reduce((acc, s) => acc + s.p, 0)
}

/**
 * @param {Segment[]} segments
 */
export function buildRanges(segments) {
  /** @type {{ outcome: Segment['outcome'], start: number, end: number, segment: Segment }[]} */
  const ranges = []
  let start = 0
  for (const seg of segments) {
    const end = start + seg.p
    ranges.push({ outcome: seg.outcome, start, end, segment: seg })
    start = end
  }
  // ensure last end is exactly 1 (avoid floating point drift)
  if (ranges.length) ranges[ranges.length - 1].end = 1
  return ranges
}

/**
 * Deterministic outcome mapping: slider position ∈ [0,1) maps to a segment.
 * @param {StyleConfig} styleConfig
 * @param {number} sliderPos01
 * @returns {import('./probabilities.js').Outcome}
 */
export function outcomeFromSlider(styleConfig, sliderPos01) {
  const x = clamp01(sliderPos01)
  const ranges = buildRanges(styleConfig.segments)
  for (const r of ranges) {
    if (x >= r.start && x < r.end) return r.outcome
  }
  return ranges[ranges.length - 1]?.outcome ?? '0'
}

export function runsForOutcome(outcome) {
  if (outcome === 'W') return 0
  return Number(outcome)
}

function clamp01(x) {
  if (Number.isNaN(x)) return 0
  return Math.max(0, Math.min(0.999999, x))
}

