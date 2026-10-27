/**
 * pnpm flaky — after a CI run of `pnpm test:e2e`, lists every test that failed and then passed
 * on its retry (Playwright's "flaky"), so a retry never hides a failure:
 * - a Markdown table in the run summary ($GITHUB_STEP_SUMMARY; stdout when run locally);
 * - a ::warning:: annotation per test on stdout, which GitHub shows on the commit;
 * - flaky=<count> in $GITHUB_OUTPUT, so the workflow keeps the report when it is not zero.
 * Reads test-results/results.json (the json reporter in playwright.config.ts).
 */
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

type Result = { status: string; error?: { message?: string } }
type Spec = {
  title: string
  file: string
  line: number
  tests: { status: string; results: Result[] }[]
}
type Suite = { title: string; specs?: Spec[]; suites?: Suite[] }

const file = join(import.meta.dirname, '..', 'test-results', 'results.json')
if (!existsSync(file)) {
  console.log('No Playwright results to read.')
  process.exit(0)
}

const flaky: { where: string; title: string; error: string }[] = []
const walk = (suite: Suite, path: string[]) => {
  for (const spec of suite.specs ?? []) {
    for (const test of spec.tests) {
      if (test.status !== 'flaky') continue
      const failed = test.results.find((r) => r.status !== 'passed')
      const error = (failed?.error?.message ?? '').replace(/\u001b\[[0-9;]*m/g, '').split('\n')[0]!
      flaky.push({
        where: `${spec.file}:${spec.line}`,
        title: [...path, spec.title].filter(Boolean).join(' › '),
        error,
      })
    }
  }
  for (const child of suite.suites ?? []) walk(child, [...path, child.title])
}
for (const suite of JSON.parse(readFileSync(file, 'utf8')).suites as Suite[]) walk(suite, [])

if (process.env.GITHUB_OUTPUT) appendFileSync(process.env.GITHUB_OUTPUT, `flaky=${flaky.length}\n`)

const summary = (text: string) =>
  process.env.GITHUB_STEP_SUMMARY
    ? appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${text}\n`)
    : console.log(text)

if (flaky.length === 0) {
  summary('### End-to-end\n\nNo test needed its retry.')
  process.exit(0)
}

const cell = (s: string) => s.replace(/\|/g, '\\|')
summary(
  [
    `### End-to-end: ${flaky.length} test(s) passed only on retry`,
    '',
    '| Test | Where | First failure |',
    '| --- | --- | --- |',
    ...flaky.map((f) => `| ${cell(f.title)} | \`${f.where}\` | ${cell(f.error)} |`),
    '',
    'The traces of the retries are in the playwright-report artifact.',
  ].join('\n'),
)
for (const f of flaky) {
  const [path, line] = f.where.split(':')
  console.log(
    `::warning file=tests/e2e/${path},line=${line},title=Passed only on retry::${f.title}`,
  )
}
