import { defineConfig, devices } from '@playwright/test'

const port = 4173

// End-to-end tests run against the production static export, served like GitHub Pages.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  // CI retries once, so a timing blip does not fail the build, but nothing is hidden: the
  // retry records a trace, and scripts/flaky-report.ts lists every test that only passed on
  // its second try in the run summary and as a warning on the commit.
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI
    ? [
        ['github'],
        ['html', { open: 'never' }],
        ['json', { outputFile: 'test-results/results.json' }],
      ]
    : 'list',
  use: {
    baseURL: `http://localhost:${port}/Portfolio/`,
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: 'pnpm preview',
    url: `http://localhost:${port}/Portfolio/en/`,
    reuseExistingServer: !process.env.CI,
  },
})
