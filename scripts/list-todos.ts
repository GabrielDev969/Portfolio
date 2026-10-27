/**
 * pnpm todos — every fact Gabriel still has to provide, grouped by where it shows:
 * todo() values in the content, TODO(gabriel) comments in the source, missing
 * public files, and architecture diagrams not yet confirmed.
 */
import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { getContent } from '../src/content'
import { isTodo } from '../src/content/schema'
import { locales } from '../src/lib/i18n'

const root = join(import.meta.dirname, '..')
const groups = new Map<string, string[]>()

function add(group: string, item: string) {
  const items = groups.get(group) ?? []
  if (!items.includes(item)) groups.set(group, [...items, item])
}

function collect(value: unknown, path: string[], out: Map<string, string>) {
  if (isTodo(value)) return void out.set(path.join('.'), value.todo)
  if (Array.isArray(value)) return value.forEach((v, i) => collect(v, [...path, String(i)], out))
  if (value && typeof value === 'object') {
    for (const [key, v] of Object.entries(value)) collect(v, [...path, key], out)
  }
}

const en = getContent('en')
const todosByLocale = new Map(
  locales.map((locale) => {
    const out = new Map<string, string>()
    collect(getContent(locale), [], out)
    return [locale, out]
  }),
)

function groupOf([section, index]: string[]) {
  if (section === 'projects' && index !== undefined)
    return `Project: ${en.projects[Number(index)]?.title}`
  return `Content: ${section}`
}

// English is the source; the other locales only add what differs from it.
for (const [locale, todos] of todosByLocale) {
  for (const [path, what] of todos) {
    if (locale !== 'en' && todosByLocale.get('en')?.get(path) === what) continue
    add(groupOf(path.split('.')), locale === 'en' ? what : `${what} (${locale})`)
  }
}

for (const project of en.projects) {
  if (!project.behindTheScenes.architecture.confirmed) {
    add(`Project: ${project.title}`, 'confirm the architecture diagram (boxes and arrows)')
  }
}

for (const locale of locales) {
  const { cv } = getContent(locale).contact
  if (!existsSync(join(root, 'public', cv.href))) add('Files', `public/${cv.href}`)
}

function sourceFiles(dir: string): string[] {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name)
    if (statSync(full).isDirectory()) return sourceFiles(full)
    return /\.(tsx?|css)$/.test(name) ? [full] : []
  })
}

// Only comments count: `// TODO(gabriel): …`, `/* TODO(gabriel) … */`, `{/* TODO(gabriel) */}`.
const comment = /(?:\/\/|\/\*|^\s*\*)\s*TODO\(gabriel\):?\s*(.*?)\s*(?:\*\/)?$/
for (const file of sourceFiles(join(root, 'src'))) {
  readFileSync(file, 'utf8')
    .split('\n')
    .forEach((line, i) => {
      const match = line.match(comment)
      if (match) add('Source', `${match[1] || 'see comment'} (${relative(root, file)}:${i + 1})`)
    })
}

const total = [...groups.values()].reduce((n, items) => n + items.length, 0)
console.log(`${total} open TODO(gabriel) items\n`)
for (const [group, items] of groups) {
  console.log(`${group}`)
  for (const item of items) console.log(`  - ${item}`)
}
