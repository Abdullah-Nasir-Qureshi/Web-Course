export function Scoreboard({
  runs,
  wickets,
  maxWickets,
  ballIndex,
  totalBalls,
  totalOvers,
  lastOutcome,
  style,
  phase,
}) {
  const oversDone = Math.floor(ballIndex / 6)
  const ballsInOver = ballIndex % 6
  const ballsRemaining = Math.max(0, totalBalls - ballIndex)

  return (
    <div className="scoreboard" role="region" aria-label="Scoreboard">
      <div className="scoreboard__top">
        <div className="scoreboard__title">2D Cricket</div>
        <div className="pill">
          {style === 'aggressive' ? 'Aggressive' : 'Defensive'}
        </div>
      </div>

      <div className="scoreboard__grid">
        <div className="metric">
          <div className="metric__label">Runs</div>
          <div className="metric__value">{runs}</div>
        </div>
        <div className="metric">
          <div className="metric__label">Wickets</div>
          <div className="metric__value">
            {wickets}/{maxWickets}
          </div>
        </div>
        <div className="metric">
          <div className="metric__label">Overs</div>
          <div className="metric__value">
            {oversDone}.{ballsInOver} / {totalOvers}.0
          </div>
        </div>
        <div className="metric">
          <div className="metric__label">Balls left</div>
          <div className="metric__value">{ballsRemaining}</div>
        </div>
      </div>

      <div className="scoreboard__bottom">
        <div className="status">
          <span className="status__label">Status</span>
          <span className="status__value">
            {phase === 'gameover'
              ? 'Game Over'
              : phase === 'aim'
                ? 'Aim — lock slider to play'
                : phase === 'bowling'
                  ? 'Bowling…'
                  : phase === 'result'
                    ? 'Shot…'
                    : 'Ready'}
          </span>
        </div>
        <div className="status">
          <span className="status__label">Last</span>
          <span className="status__value">{lastOutcome ?? '—'}</span>
        </div>
      </div>
    </div>
  )
}

