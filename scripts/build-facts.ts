/**
 * Runs after `next build` (postbuild). Writes the facts the swarm and its dock show to
 * src/content/build-facts.json (for review) and out/build-facts.json (what the page fetches):
 * - the commit hash and date (git);
 * - the deploy target (GitHub Pages, the site URL);
 * - the first-paint JS of each locale, gzipped, measured in out/ like pnpm measure:js;
 * - the tests per spec file: unit tests by running them, e2e tests by listing them;
 * - the section component of each section, read from the page;
 * - the contrast of every text pairing, from the palette in globals.css.
 * Nothing here is typed in by hand (design/COMMIT-SHEET.md, Non-negotiables).
 */
import { execFileSync, spawnSync } from 'node:child_process'
import { readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { locales } from '../src/lib/i18n'
import { siteUrl } from '../src/lib/site'
import { factsFile, type BuildFacts } from '../src/swarm/facts'
import { contrast } from './lib/color'
import { budgetKb, firstPaintJs } from './lib/first-paint-js'

const root = join(import.meta.dirname, '..')
const git = (...args: string[]) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim()

/** Unit tests per file, by running each file (they take well under a second). */
function unitTests() {
  const dir = join(root, 'tests', 'unit')
  return Object.fromEntries(
    readdirSync(dir)
      .filter((f) => f.endsWith('.test.ts'))
      .sort()
      .map((file) => {
        const run = spawnSync(
          process.execPath,
          ['--import', 'tsx', '--test', '--test-reporter=tap', join(dir, file)],
          { cwd: root, encoding: 'utf8' },
        )
        const count = Number(run.stdout.match(/^# tests (\d+)$/m)?.[1])
        if (!Number.isInteger(count)) throw new Error(`could not count the tests in ${file}`)
        return [file, count]
      }),
  )
}

/** E2E tests per spec file, as Playwright lists them (nothing is run). */
function e2eTests() {
  const list = execFileSync(
    process.execPath,
    [join(root, 'node_modules', '@playwright', 'test', 'cli.js'), 'test', '--list'],
    { cwd: root, encoding: 'utf8' },
  )
  const counts: Record<string, number> = {}
  for (const [, file] of list.matchAll(/›\s+([\w.-]+\.spec\.ts):\d+:\d+\s+›/g)) {
    counts[file!] = (counts[file!] ?? 0) + 1
  }
  if (Object.keys(counts).length === 0) throw new Error('playwright listed no tests')
  return Object.fromEntries(Object.entries(counts).sort(([a], [b]) => a.localeCompare(b)))
}

/** The page's sections in order, and the component that renders each (src/app/[locale]/page.tsx). */
export function sections() {
  const page = readFileSync(join(root, 'src', 'app', '[locale]', 'page.tsx'), 'utf8')
  const dir = join(root, 'src', 'components', 'sections')
  const files = new Set(readdirSync(dir))
  return [
    ...page.matchAll(
      /<(\w+) locale=\{locale\} content=\{content\} \/>|<(\w+) content=\{content\} \/>/g,
    ),
  ]
    .map((m) => m[1] ?? m[2]!)
    .filter((name) => files.has(`${name}.tsx`))
    .map((name) => {
      const source = readFileSync(join(dir, `${name}.tsx`), 'utf8')
      const id = source.match(/<section\s+id="([\w-]+)"/)?.[1]
      if (!id) throw new Error(`no section id in ${name}.tsx`)
      return { id, file: `${name}.tsx` }
    })
}

export function collectFacts(): Omit<BuildFacts, 'js'> {
  const pairings = [
    ['ink', 'screen'],
    ['ink', 'screen-2'],
    ['ink-2', 'screen'],
    ['ink-2', 'screen-2'],
    ['screen', 'crimson'],
    ['crimson', 'screen'],
    ['screen', 'ink'],
  ] as const
  return {
    commit: { hash: git('rev-parse', '--short', 'HEAD'), date: git('log', '-1', '--format=%cI') },
    deploy: { target: 'GitHub Pages', url: `${siteUrl}/` },
    tests: { unit: unitTests(), e2e: e2eTests() },
    sections: sections(),
    contrast: Object.fromEntries(
      pairings.map(([fg, bg]) => [`${fg}/${bg}`, Math.round(contrast(fg, bg) * 10) / 10]),
    ),
    locales: [...locales],
  }
}

if (import.meta.url === pathToFileURL(process.argv[1]!).href) {
  const facts: BuildFacts = {
    ...collectFacts(),
    js: {
      kb: Object.fromEntries(locales.map((l) => [l, Math.round(firstPaintJs(l).kb * 10) / 10])),
      budgetKb,
    },
  }
  const json = `${JSON.stringify(facts, null, 2)}\n`
  writeFileSync(join(root, 'src', 'content', factsFile), json)
  writeFileSync(join(root, 'out', factsFile), json)
  console.log(
    `build facts: ${facts.commit.hash}, JS ${facts.js.kb.en} KB, ${facts.sections.length} sections`,
  )
}
