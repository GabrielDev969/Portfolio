import { test as base, type BrowserContext } from '@playwright/test'

/** Mark the cold open as already seen, the state of every visit after the first. */
export async function skipColdOpen(context: BrowserContext) {
  await context.addInitScript(() => sessionStorage.setItem('introSeen', '1'))
}

/**
 * Tests start as a repeat visit (no cold open) unless they opt in with test.use({ intro: true }),
 * so the intro never covers what another test is checking.
 */
export const test = base.extend<{ intro: boolean }>({
  intro: [false, { option: true }],
  context: async ({ context, intro }, provide) => {
    if (!intro) await skipColdOpen(context)
    await provide(context)
  },
})

export { expect } from '@playwright/test'
