import { todo } from './schema'

/**
 * The behind-the-scenes facts Gabriel has not given yet. Every locale uses these same
 * placeholders, so `pnpm todos` lists each one once; a translation keeps its placeholder
 * until the English fact arrives and is translated.
 */
export const missing = {
  problem: () => todo('the problem this project solved'),
  role: () => todo('what you owned in this project'),
  decision: () => ({ what: todo('a key technical decision'), why: todo('why you made it') }),
  testing: () => todo('how it is tested'),
  deploy: () => todo('how it is deployed'),
  outcome: () => todo('the outcome, ideally with a number'),
}
