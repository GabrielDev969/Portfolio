import { test as base, type Browser, type BrowserContext } from '@playwright/test'

/**
 * Every spec but swarm.spec.ts reads the finished page: the build the swarm plays on a first
 * visit (design/COMMIT-SHEET.md §6) is marked as already seen this session, as for a reader
 * coming back. swarm.spec.ts imports @playwright/test directly and watches the build itself.
 */
const seen = () => sessionStorage.setItem('swarm:built', '1')

async function prepare(context: BrowserContext) {
  await context.addInitScript(seen)
  return context
}

export const test = base.extend<object, { browser: Browser }>({
  context: async ({ context }, provide) => provide(await prepare(context)),
  browser: [
    async ({ browser }, provide) => {
      const newContext = browser.newContext.bind(browser)
      browser.newContext = async (options) => prepare(await newContext(options))
      browser.newPage = async (options) => (await browser.newContext(options)).newPage()
      await provide(browser)
    },
    { scope: 'worker' },
  ],
})

export { expect } from '@playwright/test'
