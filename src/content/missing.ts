import { todo } from './schema'

/**
 * The project facts Gabriel has not given yet. Every locale uses these same placeholders, so
 * `pnpm todos` lists each one once; a translation keeps its placeholder until the English fact
 * arrives and is translated.
 */
export const missing = {
  problem: () => todo('the problem this project solved'),
  built: () => todo('what you built, your role and the key decision with its reason'),
  result: () => todo('the result, ideally with a number'),
}
