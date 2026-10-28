/**
 * pnpm lighthouse — the three Lighthouse configs in lighthouse/ (see its README), one after the
 * other, then a table of the median run per page and config: on stdout, and in the run summary
 * on CI. Exits non-zero if a gated config fails its assertions. Needs `pnpm build`.
 *
 * The phone's CPU is calibrated to the machine first: a short run reads Lighthouse's
 * benchmarkIndex, and the slowdown is benchmarkIndex / 500, the mid-tier phone (Moto G4) of
 * Lighthouse's throttling table (docs/throttling.md: 4× from a 2000 desktop, 2× from a 1000
 * one). A fixed 4× emulated a fast phone on this Mac (index about 4000) and a slow one on a CI
 * runner, so the same page scored 98 here and 78 there.
 *
 * On CI the phone's Performance score warns instead of failing (Gabriel's call, 2026-10-28):
 * calibrated or not, the same commit scores 98 on this Mac and 88–89 on GitHub's shared runners,
 * where TBT measures four times higher. Its LCP and CLS, and every other category, still fail the
 * run, and any score below target is raised as a warning in the run, never left in a log.
 * Locally it stays gated.
 */
import { spawnSync } from 'node:child_process'
import { appendFileSync, existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const root = join(import.meta.dirname, '..')
const ci = Boolean(process.env.CI)
const configs = [
  { name: 'mobile', label: 'Mobile, applied throttling', gate: true, phone: true, warnOnCi: true },
  { name: 'desktop', label: 'Desktop', gate: true, phone: false, warnOnCi: false },
  {
    name: 'mobile-simulated',
    label: 'Mobile, simulated (PageSpeed)',
    gate: false,
    phone: true,
    warnOnCi: false,
  },
]

/** The config file to run: on CI, a copy whose Performance assertion warns instead of failing. */
function configFile(config: (typeof configs)[number]) {
  const file = join(root, 'lighthouse', `${config.name}.json`)
  if (!ci || !config.warnOnCi) return file
  const rc = JSON.parse(readFileSync(file, 'utf8')) as {
    ci: { assert: { assertions: Record<string, [string, unknown]> } }
  }
  rc.ci.assert.assertions['categories:performance']![0] = 'warn'
  const copy = join(tmpdir(), `lighthouse-${config.name}-ci.json`)
  writeFileSync(copy, JSON.stringify(rc))
  return copy
}

function calibrate() {
  spawnSync(
    'pnpm',
    [
      'exec',
      'lhci',
      'collect',
      '--config=lighthouse/desktop.json',
      '--url=http://localhost:4173/Portfolio/en/',
      '--numberOfRuns=1',
      '--settings.onlyCategories=performance',
    ],
    { cwd: root, stdio: 'ignore' },
  )
  const dir = join(root, '.lighthouseci')
  const file = readdirSync(dir).find((f) => f.startsWith('lhr-') && f.endsWith('.json'))
  if (!file) throw new Error('Calibration run produced no report.')
  const lhr = JSON.parse(readFileSync(join(dir, file), 'utf8')) as {
    environment: { benchmarkIndex: number }
  }
  const index = lhr.environment.benchmarkIndex
  return { index, slowdown: Math.min(12, Math.max(1, Math.round((index / 500) * 10) / 10)) }
}

const { index, slowdown } = calibrate()
console.log(`benchmarkIndex ${Math.round(index)}: phone CPU slowdown ${slowdown}×`)

type Lhr = {
  finalDisplayedUrl: string
  categories: Record<string, { score: number }>
  audits: Record<string, { numericValue?: number }>
}

let failed = false
const rows: string[] = []
const warnings: string[] = []
for (const config of configs) {
  const run = spawnSync(
    'pnpm',
    [
      'exec',
      'lhci',
      'autorun',
      `--config=${configFile(config)}`,
      ...(config.phone ? [`--collect.settings.throttling.cpuSlowdownMultiplier=${slowdown}`] : []),
    ],
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
    const page = new URL(entry.url).pathname
    if (config.gate && score('performance') < 90)
      warnings.push(`${config.label} ${page}: Performance ${score('performance')} (target 90)`)
    if (config.gate && ms('total-blocking-time') > 200)
      warnings.push(
        `${config.label} ${page}: TBT ${Math.round(ms('total-blocking-time'))} ms (target 200)`,
      )
    rows.push(
      `| ${config.label} | ${page} | ${score('performance')} | ${score('accessibility')} | ${score('best-practices')} | ${score('seo')} | ${(ms('largest-contentful-paint') / 1000).toFixed(2)} s | ${ms('cumulative-layout-shift').toFixed(3)} | ${Math.round(ms('total-blocking-time'))} ms |`,
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
  `Gated: mobile with applied throttling and desktop${ci ? ' (on CI the mobile Performance score warns)' : ''}. The simulated row is reported only. Phone CPU slowdown ${slowdown}× (benchmarkIndex ${Math.round(index)}; lighthouse/README.md).`,
  ...(warnings.length ? ['', '**Below target:**', '', ...warnings.map((w) => `- ${w}`)] : []),
].join('\n')
console.log(`\n${table}`)
if (ci) for (const w of warnings) console.log(`::warning title=Lighthouse::${w}`)
if (process.env.GITHUB_STEP_SUMMARY) appendFileSync(process.env.GITHUB_STEP_SUMMARY, `${table}\n`)
process.exit(failed ? 1 : 0)
