# Assignment02 Implementation Report (2D Cricket SPA)

## 1. Overview
`Assignment02` is a standalone front-end project built with **React + Vite**. The UI runs as a single-page application (SPA) that simulates a short **2D cricket** batting innings.

Core gameplay features:
- Batting style selection: **Aggressive** or **Defensive**
- A **probability power bar** that visualizes outcome ranges
- A **slider “aim” phase** where the slider position determines the next ball outcome
- Cricket-like **commentary** for each outcome
- Animated pitch scene (ball movement + bat swing)
- Automatic innings end (game over) after a fixed number of balls or wickets

## 2. Runtime / Entry Points

### 2.1 HTML entrypoint
The browser loads `index.html`:
- Contains `<div id="root"></div>`
- Loads `src/main.jsx` as the entry script

### 2.2 React bootstrap
`src/main.jsx`:
- Creates the React root (`createRoot(document.getElementById('root'))`)
- Wraps the app in `StrictMode`
- Renders `App`

## 3. High-Level Architecture

The application is split into:

### 3.1 App state machine (main gameplay controller)
`src/App.jsx` owns the gameplay state and orchestrates the components:
- Score: `runs`, `wickets`
- Progress: `ballIndex` (balls already faced)
- Mode/phase: `phase` (`idle` | `aim` | `bowling` | `result` | `gameover`)
- Input/aim: `sliderPos` and `sliderDir`
- Outputs: `lastOutcome` (human label) and `lastRawOutcome` (raw result like `W`, `4`, etc.)

### 3.2 UI components
- `src/components/Scoreboard.jsx`
  - Displays runs, wickets, overs/balls remaining, current phase, and last outcome
- `src/components/PowerBar.jsx`
  - Renders colored segments representing outcome probability ranges
  - Displays a slider indicator at the current aim position
  - Contains the `Play Shot` button
- `src/components/Pitch.jsx`
  - Renders the 2D cricket scene (ball, bat, trail, stumps)
  - Animates ball travel and bat swing based on `phase` and `outcome`

### 3.3 Game logic helpers (probabilities + commentary + animation loop)
- `src/game/probabilities.js`
  - Defines outcome segments for each batting style
  - Builds slider ranges that map slider position to outcomes
  - Provides the deterministic mapping used for ball results
- `src/game/commentary.js`
  - Holds commentary lines for each outcome
  - Selects a random commentary line (does not affect gameplay outcome)
- `src/game/useRaf.js`
  - A custom `requestAnimationFrame` hook used for smooth slider motion

## 4. Gameplay Implementation Details

### 4.1 Constants (innings limits)
Inside `App.jsx`:
- `totalOvers = 2`
- `totalBalls = totalOvers * 6` (so 12 balls total)
- `maxWickets = 2`

Game over occurs when either:
- `ballIndex >= totalBalls`, or
- `wickets >= maxWickets`

### 4.2 Phase transitions (state machine)
The main loop is driven by user actions plus timed animations.

Phase meaning:
- `idle`: waiting for the user to start the next ball
- `aim`: slider moves automatically; user triggers the shot
- `bowling`: ball travels toward the bat (visual-only phase)
- `result`: bat swing + ball outcome presentation
- `gameover`: innings ended; restart required

Key transition logic in `App.jsx`:
- `Start Ball` / `Next Ball`:
  - sets `phase` to `aim` and updates commentary
- `Play Shot`:
  - only allowed during `aim`
  - maps `sliderPos` to an outcome deterministically
  - updates `runs`, `wickets`, `lastOutcome` and sets `phase` to `bowling`
- `Pitch` callbacks:
  - `onBowlingArrived` moves `bowling` -> `result` after a delay
  - `onBattingFinished` moves `result` -> `idle` after a delay
- `finishIfNeeded`:
  - checks `ballIndex` and `wickets` and sets `phase = gameover` when done

### 4.3 Slider motion with `useRaf`
`App.jsx` uses `useRaf` while in the `aim` phase to animate `sliderPos`:
- `useRaf` provides `dtMs` (~time between frames) from `requestAnimationFrame`
- `App` converts `dtMs` into a delta and moves `sliderPos` forward/backward
- When `sliderPos` hits the [0, 1] bounds, it “bounces” by flipping `sliderDir`

Important implementation detail: `Pitch` and outcome selection do not use random physics; animation is visual only.

### 4.4 Deterministic outcome selection from slider position
Outcome selection happens in `App.jsx` when the user clicks `Play Shot`.

1. Each batting style defines probability segments in `STYLE_CONFIGS` (`probabilities.js`)
2. `PowerBar` uses `buildRanges(segments)` to convert probabilities to contiguous slider intervals
3. `App` uses `outcomeFromSlider(styleConfig, sliderPos)` to find the interval containing the slider value

Implementation details in `src/game/probabilities.js`:
- `buildRanges(segments)`
  - Accumulates `start`/`end` boundaries for each segment using the segment probabilities
  - Forces the last interval `end = 1` to avoid floating point drift
- `outcomeFromSlider(styleConfig, sliderPos01)`
  - clamps slider input
  - scans ranges and returns the first interval where `x >= start && x < end`

Gameplay determinism:
- The **ball outcome is deterministic**: same slider position => same outcome (given the same style config).
- The only randomness is in **commentary selection**, not the scoring outcome.

### 4.5 Scoring rules
`runsForOutcome(outcome)`:
- If outcome is `W` (wicket), runs added is `0`
- Otherwise, runs added is the numeric outcome (`'1'`, `'2'`, `'4'`, `'6'`, etc.)

Wickets update:
- `out === 'W'` increments `wickets` by 1

### 4.6 Pitch animation decisions (ball path + trail + bat swing)
`Pitch.jsx` computes a target position based on both:
- `phase`
- the `outcome` (raw outcome like `W`, `4`, `6`)

Examples of mapping rules:
- During `bowling`, the ball moves toward the bat/stumps area
- During `result`:
  - `W` sends the ball to a wicket/stumps area
  - `4` or `6` sends the ball toward a boundary area and enables a ball trail
  - other run outcomes send the ball to a “gentle shot” area

Animation mechanics:
- Ball movement:
  - Uses CSS variables (`--bx`, `--by`) and transitions
  - `Pitch` forces a layout recalculation (`el.offsetHeight`) to ensure the transition triggers reliably
- Bat swing:
  - During `result`, `Pitch` toggles the bat’s CSS class to trigger the `@keyframes batSwing`
- Callbacks:
  - `onBowlingArrived` fires after ~850ms
  - `onBattingFinished` fires after ~550ms

## 5. Probability Power Bar Visualization
`PowerBar.jsx`:
- Calls `buildRanges(segments)` to transform probability segments into a list of range items
- For each range:
  - Sets a colored segment width proportional to `(end - start)`
  - Shows labels + probabilities via `title`
- Positions a slider indicator at `sliderPos01 * 100%`
- Uses `disabled` to prevent shot attempts when not in the `aim` phase

This ensures the UI communicates how slider selection maps to possible results.

## 6. Styling and Layout
Styling is primarily handled in:
- `src/index.css` (global layout + most component styles)
- `src/App.css` (grid layout, control panel, buttons)

Notable UI behaviors:
- Responsive grid:
  - at smaller widths the layout collapses from 2 columns to 1 column
- Visual emphasis:
  - scoreboard + controls panel have distinct backgrounds and borders
- Animated pitch:
  - driven by CSS transitions and keyframes in `index.css`

## 7. Accessibility Notes
The implementation includes several helpful attributes:
- `Scoreboard` uses `role="region"` and labels
- Commentary is updated in an `aria-live="polite"` container to announce changes
- Pitch has `role="img"` and an `aria-label` for the scene

## 8. How to Run
From inside `Assignment02`:
1. Install dependencies (if needed):
   - `npm install`
2. Start dev server:
   - `npm run dev`
3. Open the shown local URL in a browser.

Other scripts from `package.json`:
- `npm run build`
- `npm run preview`
- `npm run lint`

## 9. Related Module: `task03/AI-emplementation` (Separate Backend)
This repository also contains a separate backend module under `task03/AI-emplementation` that provides **Node.js + Express + MongoDB** authentication:
- `server.js`
  - connects to MongoDB (`studentDB`)
  - configures `express-session`
  - exposes:
    - `POST /register`
    - `POST /login`
    - `GET /dashboard` (protected by `requireAuth`)
    - `GET /logout`
- `user.js`
  - defines the Mongoose `User` model
  - implements:
    - `register()` using `bcrypt` hashing
    - `login()` using `bcrypt.compare`

This backend is not automatically integrated into `Assignment02` as currently written (they appear as independent tasks).

## GitHub Link
https://github.com/Abdullah-Nasir-Qureshi/Web-Course/tree/main/Assignment02

