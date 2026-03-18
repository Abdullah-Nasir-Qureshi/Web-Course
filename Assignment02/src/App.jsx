import './App.css'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { Pitch } from './components/Pitch'
import { PowerBar } from './components/PowerBar'
import { Scoreboard } from './components/Scoreboard'
import { pickCommentary } from './game/commentary'
import {
  STYLE_CONFIGS,
  outcomeFromSlider,
  runsForOutcome,
  sumProbabilities,
} from './game/probabilities'
import { useRaf } from './game/useRaf'

function App() {
  const totalOvers = 2
  const totalBalls = totalOvers * 6
  const maxWickets = 2

  const [style, setStyle] = useState('aggressive')
  const styleConfig = STYLE_CONFIGS[style]

  const [runs, setRuns] = useState(0)
  const [wickets, setWickets] = useState(0)
  const [ballIndex, setBallIndex] = useState(0) // balls already faced

  // Flow:
  // idle -> aim (slider moving, choose shot) -> bowling (ball travels in) -> result (bat swing + ball away) -> idle
  const [phase, setPhase] = useState('idle') // idle | aim | bowling | result | gameover
  const [lastOutcome, setLastOutcome] = useState(null)
  const [lastRawOutcome, setLastRawOutcome] = useState(null)
  const [commentary, setCommentary] = useState('Select a style, then click Next Ball.')

  const [sliderPos, setSliderPos] = useState(0.6)
  const [sliderDir, setSliderDir] = useState(1)

  const isGameOver = phase === 'gameover'
  const isInningsDone = ballIndex >= totalBalls || wickets >= maxWickets

  const probsOk = useMemo(() => {
    const s = sumProbabilities(styleConfig.segments)
    return Math.abs(s - 1) < 1e-9
  }, [styleConfig.segments])

  useRaf(
    (dtMs) => {
      if (isGameOver) return
      if (phase !== 'aim') return
      const speedPerSecond = 0.55 // ~1.8s per full sweep
      const delta = (dtMs / 1000) * speedPerSecond * sliderDir
      let next = sliderPos + delta
      let dir = sliderDir
      if (next >= 1) {
        next = 1 - (next - 1)
        dir = -1
      } else if (next <= 0) {
        next = -next
        dir = 1
      }
      setSliderPos(next)
      if (dir !== sliderDir) setSliderDir(dir)
    },
    true,
  )

  const restart = useCallback(() => {
    setRuns(0)
    setWickets(0)
    setBallIndex(0)
    setLastOutcome(null)
    setLastRawOutcome(null)
    setCommentary('Select a style, then click Next Ball.')
    setPhase('idle')
    setSliderPos(0.6)
    setSliderDir(1)
    setStyle('aggressive')
  }, [])

  const startBall = useCallback(() => {
    if (isGameOver) return
    if (isInningsDone) {
      setPhase('gameover')
      return
    }
    setPhase('aim')
    setCommentary('Aim your shot: click Play Shot to lock the slider.')
  }, [isGameOver, isInningsDone])

  const onBowlingArrived = useCallback(() => {
    setPhase((p) => (p === 'bowling' ? 'result' : p))
    setCommentary((c) => c)
  }, [])

  const finishIfNeeded = useCallback(
    (nextBallIndex, nextWickets) => {
      if (nextBallIndex >= totalBalls || nextWickets >= maxWickets) {
        setPhase('gameover')
        setCommentary('Game over. Restart to play again.')
        return true
      }
      return false
    },
    [totalBalls, maxWickets],
  )

  const playShot = useCallback(() => {
    if (phase !== 'aim') return
    if (!probsOk) {
      setCommentary('Error: probabilities do not sum to 1.')
      return
    }

    const out = outcomeFromSlider(styleConfig, sliderPos)
    const addRuns = runsForOutcome(out)

    setLastRawOutcome(out)
    setLastOutcome(out === 'W' ? 'Wicket' : `${out} run${out === '1' ? '' : 's'}`)
    setCommentary(pickCommentary(out))
    setPhase('bowling')

    setRuns((r) => r + addRuns)
    setWickets((w) => (out === 'W' ? w + 1 : w))
    setBallIndex((b) => b + 1)
  }, [phase, probsOk, sliderPos, styleConfig])

  const onBattingFinished = useCallback(() => {
    // After bat swing, move to "ready" for the next ball unless game is over.
    setPhase((p) => {
      if (p !== 'result') return p
      return 'idle'
    })
    setCommentary((c) => c)
  }, [])

  // when state advances (ball/wickets), check for game over
  useEffect(() => {
    if (phase === 'gameover') return
    if (ballIndex === 0 && wickets === 0) return
    finishIfNeeded(ballIndex, wickets)
  }, [ballIndex, wickets, finishIfNeeded, phase])

  const primaryAction = useMemo(() => {
    if (isGameOver) return { label: 'Restart', onClick: restart, disabled: false }
    if (phase === 'aim') return { label: 'Play Shot', onClick: playShot, disabled: false }
    if (phase === 'bowling') return { label: 'Bowling…', onClick: () => {}, disabled: true }
    if (phase === 'result') return { label: 'Result…', onClick: () => {}, disabled: true }
    return {
      label: ballIndex === 0 ? 'Start Ball' : 'Next Ball',
      onClick: startBall,
      disabled: false,
    }
  }, [isGameOver, phase, restart, playShot, ballIndex, startBall])

  return (
    <div className="app">
      <header className="topRow">
        <Scoreboard
          runs={runs}
          wickets={wickets}
          maxWickets={maxWickets}
          ballIndex={ballIndex}
          totalBalls={totalBalls}
          totalOvers={totalOvers}
          lastOutcome={lastOutcome}
          style={style}
          phase={phase}
        />

        <div className="controls">
          <div className="controls__title">Batting style</div>
          <div className="segmented" role="group" aria-label="Batting style">
            <button
              type="button"
              className={`segBtn ${style === 'aggressive' ? 'isActive' : ''}`}
              onClick={() => setStyle('aggressive')}
              disabled={phase === 'aim' || phase === 'bowling' || phase === 'result'}
            >
              Aggressive
            </button>
            <button
              type="button"
              className={`segBtn ${style === 'defensive' ? 'isActive' : ''}`}
              onClick={() => setStyle('defensive')}
              disabled={phase === 'aim' || phase === 'bowling' || phase === 'result'}
            >
              Defensive
            </button>
          </div>

          <div className="controls__actions">
            <button
              type="button"
              className={`btn ${isGameOver ? 'btnDanger' : 'btnPrimary'}`}
              onClick={primaryAction.onClick}
              disabled={primaryAction.disabled}
            >
              {primaryAction.label}
            </button>

            <button
              type="button"
              className="btn btnGhost"
              onClick={restart}
              disabled={phase === 'aim' || phase === 'bowling' || phase === 'result'}
            >
              Restart
            </button>
          </div>

          <div className={`note ${probsOk ? '' : 'note--bad'}`}>
            {probsOk
              ? 'Probabilities sum to 1.00'
              : 'Probabilities invalid (must sum exactly to 1)'}
          </div>

          <div className="commentary" aria-live="polite">
            {commentary}
          </div>
        </div>
      </header>

      <main className="mainGrid">
        <Pitch
          phase={phase}
          outcome={lastRawOutcome}
          onBowlingArrived={onBowlingArrived}
          onBattingFinished={onBattingFinished}
        />

        <div className="rightCol">
          <PowerBar
            segments={styleConfig.segments}
            sliderPos01={sliderPos}
            disabled={phase !== 'aim' || isGameOver}
            onShoot={playShot}
          />

          {isGameOver ? (
            <div className="gameOver" role="region" aria-label="Game over">
              <div className="gameOver__title">Game Over</div>
              <div className="gameOver__score">
                Final Score: <b>{runs}</b> / <b>{wickets}</b>
              </div>
              <button className="btn btnPrimary" type="button" onClick={restart}>
                Restart Game
              </button>
            </div>
          ) : null}
        </div>
      </main>
    </div>
  )
}

export default App
