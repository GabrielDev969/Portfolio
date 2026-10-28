/**
 * pnpm lighthouse — the three Lighthouse configs in lighthouse/ (see its README), one after the
 * other, then a table of the median run per page and config: on stdout, and in the run summary
 * on CI. Exits non-zero if a gated config fails its assertions. Needs `pnpm build`.
 */
import { spawnSync } from 'node:child_process'
import { appendFileSync, existsSync, readFileSync } from 'node:fs'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const configs = [
  { name: 'mobile', label: 'Mobile, applied throttling', gate: true },
  { name: 'desktop', label: 'Desktop', gate: true },
  { name: 'mobile-simulated', label: 'Mobile, simulated (PageSpeed)', gate: false },
]

type Lhr = {
  finalDisplayedUrl: string
  categories: Record<string, { score: number }>
  audits: Record<string, { numericValue?: number }>
}

let failed = false
const rows: string[] = []
for (const config of configs) {
  const run = spawnSync(
    'pnpm',
    ['exec', 'lhci', 'autorun', `--config=lighthouse/${config.name}.json`],
    { cwd: root, stdio: 'inherit' },
  )
  if (run.status !== 0 && config.gate) failed = true

  const dir = join(root, '.lighthouseci', config.name)
  if (!existsSync(dir)) continue
  const manifest = JSON.parse(readFileSync(join(dir, 'manifest.json'), 'utf8')) as {
    url: string
    isRepresentativeRun: boolean
    jsonPath: string
  }[]
  for (const entry of manifest.filter((e) => e.isRepresentativeRun)) {
    const lhr = JSON.parse(readFileSync(entry.jsonPath, 'utf8')) as Lhr
    const score = (k: string) => Math.round(lhr.categories[k]!.score * 100)
    const ms = (k: string) => lhr.audits[k]!.numericValue ?? 0
    rows.push(
      `| ${config.label} | ${new URL(entry.url).pathname} | ${score('performance')} | ${score('accessibility')} | ${score('best-practices')} | ${score('seo')} | ${(ms('largest-contentful-paint') / 1000).toFixed(2)} s | ${ms('cumulative-layout-shift').toFixed(3)} | ${Math.round(ms('total-blocking-time'))} ms |`,
    )
  }
}

const table = [
  '### Lighthouse (median run)',
  '',
  '| Run | Page | Perf | A11y | Best practices | SEO | LCP | CLS | TBT |',
  '| --- | --- | --- | --- | --- | --- | --- | --- | --- |',
  ...rows,
  '',
  'Gated: mobile with applied throttling and desktop. The simulated row is reported only (lighthouse/README.md).',
].join('\n')
console.log(`\n${table}`)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`)
process.exit(failed ? 1 : 0)
