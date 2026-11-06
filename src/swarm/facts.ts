/**
 * Every number the swarm and its dock may show, read from the real repo and the real build by
 * scripts/build-facts.ts (design/COMMIT-SHEET.md, Non-negotiables). The swarm fetches it after
 * first paint; when it is missing (pnpm dev), the swarm shows no number at all.
 */
export type BuildFacts = {
  commit: { hash: string; date: string }
  deploy: { target: 'GitHub Pages'; url: string }
  /** First-paint JS of each locale, gzipped (what pnpm measure:js measures). */
  js: { kb: Record<string, number>; budgetKb: number }
  /** Tests per spec file: unit tests by running them, e2e by listing them. */
  tests: { unit: Record<string, number>; e2e: Record<string, number> }
  /** Each section of the page and the component file that renders it, in page order. */
  sections: { id: string; file: string }[]
  /** WCAG contrast of the pairings the page sets text in, from the palette. */
  contrast: Record<string, number>
  locales: string[]
}

export const factsFile = 'build-facts.json'
