/**
 * Commentary selection is allowed to be random because it does not affect gameplay outcome.
 */
const LINES = {
  W: [
    'Oh no! Clean bowled!',
    'That one kept low… wicket!',
    'Edge and gone! Huge breakthrough.',
  ],
  0: [
    'Dot ball. Solid bowling.',
    'No run there—good fielding.',
    'Beaten! But survives.',
  ],
  1: ['Just a single. Keeps the strike moving.', 'Tucked away for one.', 'Easy run.'],
  2: ['Good running—two runs.', 'Placed nicely for a couple.', 'Two more to the total.'],
  3: ['Three! Great placement and hustle.', 'They come back for three.', 'Excellent running between wickets.'],
  4: ['Cracked! That races to the boundary.', 'Four! Pierces the gap.', 'Glorious timing—four runs.'],
  6: ['SIX! That’s out of the park!', 'Maximum! Clean strike.', 'Launched! Six runs.'],
}

export function pickCommentary(outcome) {
  const arr = LINES[outcome] ?? ['']
  const i = Math.floor(Math.random() * arr.length)
  return arr[i]
}

