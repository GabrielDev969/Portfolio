import type { SiteContent } from '@/content/schema'
import { asset } from '@/lib/site'
import { smoothScroll } from '@/motion/tokens'
import { factsFile, type BuildFacts } from './facts'

/**
 * The swarm (design/COMMIT-SHEET.md §6): fifteen agents and Gabriel build the page as it is
 * read. It is a simulation laid over content that is already complete: it outlines, underlines,
 * traces and points, and never hides a word. Loaded after first paint, only in the full view
 * with motion allowed; Quick view, reduced motion, print and no-JS get the finished page.
 *
 * One overlay in page coordinates holds every cursor and mark; one requestAnimationFrame loop
 * moves them on its own clock, which stops while the tab is hidden. Cursors ease toward their
 * targets; nothing goes through React.
 */

type Labels = SiteContent['swarm']
type Rect = { x: number; y: number; w: number; h: number }

const roles = [
  'planner',
  'architect',
  'layout',
  'typography',
  'copy',
  'data',
  'diagram',
  'mockup',
  'i18n',
  'a11y',
  'perf',
  'tests',
  'security',
  'motion',
  'deploy',
  'gabriel',
] as const
type Role = (typeof roles)[number]

type Kind = 'hero' | 'experience' | 'project' | 'how' | 'contact'

/** The e2e specs that test each kind of section, for the Tests agent's count. */
const specs: Record<Kind, string[]> = {
  hero: ['hero.spec.ts'],
  experience: ['experience.spec.ts'],
  project: ['projects.spec.ts', 'mockups.spec.ts'],
  how: ['how-i-work.spec.ts'],
  contact: ['contact.spec.ts'],
}

/** Who works on each kind of section, most needed first; the budget takes the first few. */
const crews: Record<Kind, Role[]> = {
  hero: ['planner', 'perf', 'a11y', 'tests', 'i18n', 'motion'],
  experience: ['layout', 'copy', 'architect', 'typography', 'data', 'i18n', 'tests'],
  project: ['layout', 'copy', 'architect', 'typography', 'diagram'],
  how: ['layout', 'copy', 'architect', 'typography', 'diagram', 'motion', 'tests'],
  contact: ['layout', 'copy', 'architect', 'typography', 'security', 'tests', 'deploy', 'a11y'],
}
/** Projects share the rest in turn, so each of the five gets a different pair. */
const projectExtras: Role[] = ['mockup', 'data', 'tests', 'a11y', 'perf']

/** The text pairing each kind of section is mostly set in, for the A11y agent. */
const pairing: Record<Kind, string> = {
  hero: 'ink/screen',
  experience: 'ink/screen',
  project: 'ink-2/screen',
  how: 'ink/screen',
  contact: 'screen/velvet',
}

type Cursor = {
  role: Role
  name: string
  el: HTMLDivElement
  label: HTMLSpanElement
  x: number
  y: number
  path: { x: number; y: number }[]
  on: boolean
  leaving: boolean
  quiet: boolean
  busy: Unit | null
  text: string
  /** How it came down into the hero, so it can go back up the same free way. */
  way: { x: number; y: number }[]
  /** The label's measured width; 0 until it has been shown with its current text. */
  labelWidth: number
  /** On its way to a spot in the hero: the label waits until it gets there. */
  arriving: boolean
}

type Unit = {
  kind: Kind
  el: HTMLElement
  index: number
  state: 'waiting' | 'queued' | 'building' | 'built'
  marks: HTMLElement[]
  undo: (() => void)[]
  crew: Cursor[]
  /** Engine time when its last job ends: Gabriel reviews after that. */
  until: number
  /** Text not typed yet, line by line, under a veil that keeps it readable. */
  veils: Map<Element, { lines: Rect[]; divs: HTMLElement[] }>
}

type Effect = { start: number; dur: number; update: (p: number) => void; done?: () => void }
type Task = { at: number; run: () => void }

const ease = (p: number) => 1 - (1 - p) ** 3
const round = (n: number) => Math.round(n)
const all = <T extends Element>(root: ParentNode, selector: string) => [
  ...root.querySelectorAll<T>(selector),
]

function pageRect(el: Element): Rect {
  const r = el.getBoundingClientRect()
  return { x: r.left + scrollX, y: r.top + scrollY, w: r.width, h: r.height }
}

function overlaps(a: Rect, b: Rect, pad = 0) {
  return (
    a.x < b.x + b.w + pad && a.x + a.w + pad > b.x && a.y < b.y + b.h + pad && a.y + a.h + pad > b.y
  )
}

/** The rectangles of an element's text, one per line (its text nodes only, not its boxes). */
function lineRects(el: Element): Rect[] {
  const lines: Rect[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    range.selectNodeContents(node)
    for (const r of range.getClientRects()) {
      if (r.width < 2 || r.height < 4) continue
      const y = r.top + scrollY
      const line = lines.find((l) => Math.abs(l.y - y) < r.height / 2)
      if (line) {
        const right = Math.max(line.x + line.w, r.right + scrollX)
        line.x = Math.min(line.x, r.left + scrollX)
        line.w = right - line.x
        line.h = Math.max(line.h, r.height)
      } else lines.push({ x: r.left + scrollX, y, w: r.width, h: r.height })
    }
  }
  return lines.sort((p, q) => p.y - q.y)
}

/** Where each word of an element ends, in reading order: the typing caret's stops. */
function wordEnds(el: Element) {
  const out: { x: number; y: number; h: number }[] = []
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT)
  const range = document.createRange()
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (const m of (node.textContent ?? '').matchAll(/\S+/g)) {
      range.setStart(node, m.index)
      range.setEnd(node, m.index + m[0].length)
      const r = [...range.getClientRects()].at(-1)
      if (r) out.push({ x: r.right + scrollX, y: r.top + scrollY, h: r.height })
    }
  }
  return out
}

function words(els: Element[]) {
  return els.reduce((n, el) => n + (el.textContent ?? '').split(/\s+/).filter(Boolean).length, 0)
}

const arrow =
  '<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M1 1v15.5l4.2-4 2.9 6.6 2.6-1.1-2.9-6.5H14z" style="fill: var(--c); stroke: var(--color-screen)" stroke-width="1.2" stroke-linejoin="round"/></svg>'
const check =
  '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9.5" style="fill: var(--c)"/><path d="m5.5 10.2 3 3 6-6.4" fill="none" style="stroke: var(--color-screen)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export function startSwarm(labels: Labels, locale: string): () => void {
  const html = document.documentElement
  const phone = matchMedia('(max-width: 767px)').matches
  const maxActive = phone ? 6 : 8
  // Seven at work and Gabriel make eight on a desktop; three and Gabriel on a phone.
  const budget = phone ? 3 : 7
  let facts: BuildFacts | null = null
  let stopped = false
  let done = false

  // ---- The overlay and the dock ----
  const root = document.createElement('div')
  root.className = 'swarm'
  root.setAttribute('aria-hidden', 'true')
  document.body.append(root)
  const fitRoot = () => (root.style.height = `${document.body.offsetHeight}px`)
  fitRoot()

  const dock = document.createElement('div')
  dock.className = 'swarm-dock'
  dock.innerHTML = `<div class="swarm-dock-row" aria-hidden="true"><span class="swarm-dot"></span><span data-k="status"></span><span data-k="active"></span><span data-k="progress"></span><span data-k="js"></span><span data-k="commit"></span><span data-k="host"></span></div><div class="swarm-dock-log" aria-hidden="true" data-k="log"></div>`
  const skip = document.createElement('button')
  skip.type = 'button'
  skip.className = 'swarm-skip'
  skip.textContent = labels.skip
  dock.append(skip)
  document.body.append(dock)
  html.dataset.swarm = 'booting'
  const slot = (k: string) => dock.querySelector<HTMLElement>(`[data-k="${k}"]`)!
  const setSlot = (k: string, text: string) => {
    const el = slot(k)
    if (el.textContent !== text) el.textContent = text
  }
  setSlot('status', labels.booting)
  const log = (who: Cursor, what: string) => setSlot('log', `${who.name} › ${what}`)

  // ---- Clock, tasks and effects ----
  let time = 0
  let last = 0
  let frame = 0
  let paused = document.hidden
  const tasks: Task[] = []
  const effects: Effect[] = []
  const at = (delay: number, run: () => void) => {
    tasks.push({ at: time + delay, run })
    wake()
  }
  const animate = (dur: number, update: (p: number) => void, done?: () => void) => {
    effects.push({ start: time, dur, update, ...(done ? { done } : {}) })
    update(0)
    wake()
  }

  // ---- Cursors ----
  const cursors = roles.map((role, i): Cursor => {
    const el = document.createElement('div')
    el.className = 'swarm-cursor'
    el.style.setProperty('--c', `var(--color-agent-${i + 1})`)
    el.innerHTML = arrow
    const label = document.createElement('span')
    label.className = 'swarm-label'
    const name = labels.agents[i] ?? role
    label.textContent = name
    el.append(label)
    el.hidden = true
    root.append(el)
    return {
      role,
      name,
      el,
      label,
      x: 0,
      y: 0,
      path: [],
      on: false,
      leaving: false,
      quiet: false,
      busy: null,
      text: name,
      way: [],
      labelWidth: 0,
      arriving: false,
    }
  })
  const agent = (role: Role) => cursors.find((c) => c.role === role)!
  /** At work: on screen and not on its way out. */
  const active = () => cursors.filter((c) => c.on && !c.leaving).length

  const say = (c: Cursor, what?: string) => {
    c.text = what ? `${c.name} · ${what}` : c.name
    if (c.label.textContent !== c.text) {
      c.label.textContent = c.text
      c.labelWidth = 0
    }
    if (what) log(c, what)
  }
  const go = (c: Cursor, x: number, y: number) => {
    c.path = [{ x, y }]
    c.leaving = false
    wake()
  }
  /** Fly in from the nearer side of the screen, unless already on it. */
  const enter = (c: Cursor, x: number, y: number) => {
    c.quiet = false
    c.arriving = false
    if (!c.on) {
      c.on = true
      c.el.hidden = false
      c.x = x - scrollX < innerWidth / 2 ? scrollX - 40 : scrollX + innerWidth + 40
      c.y = y
    }
    go(c, x, y)
  }
  /** Back up the free column it came down, and away under the top bar: the hero's way out. */
  const leaveUp = (c: Cursor) => {
    if (!c.on) return
    c.busy = null
    c.leaving = true
    const back = c.way.length ? [...c.way].reverse().slice(1) : [{ x: c.x, y: scrollY + 28 }]
    c.way = []
    c.path = [...back, { x: scrollX + innerWidth + 60, y: scrollY + 28 }]
    wake()
  }
  const leave = (c: Cursor) => {
    if (!c.on) return
    c.busy = null
    c.leaving = true
    c.path = [
      { x: c.x - scrollX < innerWidth / 2 ? scrollX - 60 : scrollX + innerWidth + 60, y: c.y },
    ]
    wake()
  }

  // ---- Marks: boxes, lines, highlights, ripples, checks ----
  const mark = (unit: Unit | null, className: string, role: Role, r: Rect) => {
    const el = document.createElement('div')
    el.className = className
    el.style.setProperty('--c', `var(--color-agent-${roles.indexOf(role) + 1})`)
    Object.assign(el.style, {
      transform: `translate(${r.x}px, ${r.y}px)`,
      width: `${r.w}px`,
      height: `${r.h}px`,
    })
    root.append(el)
    unit?.marks.push(el)
    return el
  }
  const fadeOut = (el: HTMLElement, dur = 300) =>
    animate(
      dur,
      (p) => (el.style.opacity = String(1 - p)),
      () => el.remove(),
    )
  /**
   * Text not yet typed sits under a veil of the ground at 45%, which keeps body ink at 5.4:1:
   * dimmer, still readable (design/COMMIT-SHEET.md §6). Only text in full ink is veiled;
   * muted text would drop below AA.
   */
  const ink = getComputedStyle(document.body).color
  const veil = (u: Unit, el: Element) => {
    if (u.veils.has(el) || getComputedStyle(el).color !== ink) return
    const lines = lineRects(el)
    const divs = lines.map((l) =>
      mark(u, 'swarm-veil', 'copy', { x: l.x - 1, y: l.y, w: l.w + 3, h: l.h }),
    )
    u.veils.set(el, { lines, divs })
  }
  const unveil = (u: Unit, el: Element) => {
    for (const d of u.veils.get(el)?.divs ?? []) d.remove()
    u.veils.delete(el)
  }
  const ripple = (unit: Unit, role: Role, target: Element) => {
    const r = pageRect(target)
    const cx = r.x + r.w / 2
    const cy = r.y + r.h / 2
    const ring = mark(unit, 'swarm-ring', role, { x: cx, y: cy, w: 0, h: 0 })
    animate(
      520,
      (p) => {
        const d = 8 + ease(p) * 56
        Object.assign(ring.style, {
          transform: `translate(${cx - d / 2}px, ${cy - d / 2}px)`,
          width: `${d}px`,
          height: `${d}px`,
          opacity: String(1 - p),
        })
      },
      () => ring.remove(),
    )
  }
  const approveMark = (x: number, y: number) => {
    // Not one of the unit's marks: the check stays a moment after the others fade.
    const el = mark(null, 'swarm-check', 'gabriel', { x: x - 10, y: y - 10, w: 20, h: 20 })
    el.innerHTML = check
    // Scale inside the transform: the separate `scale` property would scale the offset too.
    animate(
      220,
      (p) => (el.style.transform = `translate(${x - 10}px, ${y - 10}px) scale(${ease(p)})`),
    )
    at(1100, () => fadeOut(el))
  }

  // ---- Where cursors can rest without covering text ----
  // Words by their lines (a paragraph's box spans the column, its text may not); controls,
  // pictures and panels by their boxes. The hero name by its box: at boot its lines are still
  // rising into place, so their own rectangles are not where they will be.
  const textRects = (scope: Element) => [
    ...all(scope, 'h2, h3, p, li, dt, dd').flatMap(lineRects),
    ...all(scope, 'h1, a, button, img, svg, .project-stack').map(pageRect),
  ]
  /**
   * A free w × h spot inside the visible part of `scope`, scanning from the right, starting
   * `from` of the way down (0–1) and wrapping round to the top.
   */
  const freeSpot = (
    scope: Element,
    w: number,
    h: number,
    taken: Rect[],
    fromTop = false,
    from = 0,
  ) => {
    const view = { x: scrollX, y: scrollY + 64, w: innerWidth, h: innerHeight - 64 - dockHeight() }
    const area = pageRect(scope)
    const avoid = [...textRects(scope), ...taken]
    const top = Math.max(view.y, area.y) + 8
    const bottom = Math.min(view.y + view.h, area.y + area.h) - h
    if (bottom < top) return null
    const rows: number[] = []
    for (let y = top; y <= bottom; y += 20) rows.push(y)
    const first = Math.floor(rows.length * from)
    for (const y of [...rows.slice(first), ...rows.slice(0, first)]) {
      for (let x = view.x + view.w - w - 12; x > view.x + 8; x -= 24) {
        const spot = { x, y, w, h }
        if (avoid.some((r) => overlaps(spot, r, 10))) continue
        if (!fromTop) return { ...spot, way: [] }
        // Boot cursors come down from under the top bar, straight or by the right-hand gutter
        // and then across: either way must be free too.
        const top = scrollY + 56
        const gutter = scrollX + innerWidth - 22
        const free = (r: Rect) => !avoid.some((a) => overlaps(r, a, 6))
        if (free({ x, y: top, w: 22, h: y - top }))
          return {
            ...spot,
            way: [
              { x, y: scrollY + 30 },
              { x, y },
            ],
          }
        if (
          free({ x: gutter, y: top, w: 22, h: y - top }) &&
          free({ x, y, w: gutter + 22 - x, h: 22 })
        )
          return {
            ...spot,
            way: [
              { x: gutter, y: scrollY + 30 },
              { x: gutter, y },
              { x, y },
            ],
          }
      }
    }
    return null
  }
  const dockHeight = () => dock.getBoundingClientRect().height + 16

  // ---- Units: the sections, and each project on its own ----
  const units: Unit[] = []
  const add = (kind: Kind, el: Element | null, index = 0) => {
    if (el instanceof HTMLElement) {
      units.push({
        kind,
        el,
        index,
        state: 'waiting',
        marks: [],
        undo: [],
        crew: [],
        until: 0,
        veils: new Map(),
      })
      el.dataset.swarmUnit = 'waiting'
    }
  }
  add('hero', document.getElementById('top'))
  add('experience', document.getElementById('experience'))
  all<HTMLElement>(document, '#projects article').forEach((el, i) => add('project', el, i))
  add('how', document.getElementById('how-i-work'))
  add('contact', document.getElementById('contact'))

  const parts = (u: Unit) => {
    const q = <T extends Element = HTMLElement>(s: string) => all<T>(u.el, s)
    switch (u.kind) {
      case 'experience':
        return {
          headings: q('h2'),
          blocks: q('.timeline-item'),
          texts: q('.timeline-summary'),
          cards: q('.timeline-item').filter((_, i) => i % 2 === 1),
          items: q('.timeline-start'),
        }
      case 'project':
        return {
          headings: [
            ...(u.index === 0 ? all<HTMLElement>(document, '#projects-title') : []),
            ...q('h3'),
          ],
          blocks: q('.project-image, .project-head, .project-built, .project-architecture'),
          texts: q('.project-part > dd').filter((dd) => !dd.querySelector('svg')),
          cards: q('.project-image, .project-stack'),
          items: q('.stack-line > span'),
          links: q<HTMLAnchorElement>('a[href^="http"]'),
          buttons: q('a[href^="http"]'),
          diagram: u.el.querySelector<SVGSVGElement>('.diagram svg'),
          image: u.el.querySelector<HTMLElement>('.project-image'),
        }
      case 'how':
        return {
          headings: q('h2'),
          blocks: q('.step'),
          texts: q('.page-grid > p'),
          cards: q('.step').filter((_, i) => i === 1 || i === 4),
          drawings: q('.step-drawing'),
        }
      case 'contact':
        return {
          headings: q('h2'),
          blocks: q('.page-grid > div'),
          texts: q('.page-grid > div:first-child > p'),
          cards: q('.contact-photo'),
          items: q('.skill-group dt'),
          links: q<HTMLAnchorElement>('a[href^="http"]'),
          buttons: q('a[href^="mailto"], a[download]'),
        }
      default:
        return { headings: [] as HTMLElement[] }
    }
  }

  const fact = {
    js: () => (facts ? facts.js.kb[locale] : undefined),
    tests: (kind: Kind) =>
      facts ? specs[kind].reduce((n, s) => n + (facts!.tests.e2e[s] ?? 0), 0) : undefined,
    contrast: (kind: Kind) => (facts ? facts.contrast[pairing[kind]] : undefined),
  }

  /** What an agent reports, from build-facts.json or the page; undefined when it cannot know. */
  const codes = () =>
    (facts?.locales ?? all(document, 'header.top-bar nav a').map((a) => a.textContent ?? ''))
      .map((l) => l.toUpperCase())
      .join(' · ')
  const output: Partial<Record<Role, (u: Unit) => string | undefined>> = {
    planner: () =>
      `${facts?.sections.length ?? all(document, '[data-section]').length} ${labels.units.sections}`,
    perf: () => (fact.js() === undefined ? undefined : `JS ${fact.js()} KB`),
    a11y: (u) =>
      fact.contrast(u.kind) === undefined ? undefined : `AA ${fact.contrast(u.kind)}:1`,
    tests: (u) => (fact.tests(u.kind) === undefined ? undefined : `${fact.tests(u.kind)} e2e`),
    i18n: () => codes(),
    motion: () => `lerp ${smoothScroll.lerp}`,
    deploy: () => facts?.deploy.target,
  }
  /** An agent that only reports: it comes beside the heading, says its number, and goes. */
  const report = (u: Unit, p: Parts, c: Cursor, i: number) => {
    const text = output[c.role]?.(u)
    if (text === undefined) return 0
    const spot = near(p, u, i)
    enter(c, spot.x, spot.y)
    say(c, text)
    return 700
  }

  // ---- What each agent does on a unit; each returns how long it takes (ms) ----
  type Parts = ReturnType<typeof parts> & {
    blocks?: HTMLElement[]
    texts?: HTMLElement[]
    cards?: HTMLElement[]
    items?: HTMLElement[]
    links?: HTMLAnchorElement[]
    buttons?: HTMLElement[]
    diagram?: SVGSVGElement | null
    image?: HTMLElement | null
    drawings?: HTMLElement[]
  }
  const near = (p: Parts, u: Unit, i: number) => {
    const h = p.headings.at(-1) ?? u.el
    const r = pageRect(h)
    const line = lineRects(h).at(-1) ?? r
    return { x: Math.min(line.x + line.w + 24, scrollX + innerWidth - 180), y: r.y + 8 + i * 30 }
  }

  const jobs: Record<Role, (u: Unit, p: Parts, c: Cursor, slot: number) => number> = {
    planner: (u, p, c, i) => {
      const files = facts?.sections.map((x) => x.file) ?? []
      if (files.length) at(300, () => log(c, files.join(' · ')))
      return report(u, p, c, i)
    },
    architect: (u, p, c) => {
      const blocks = (p.blocks ?? []).slice(0, phone ? 3 : 5)
      blocks.forEach((b, i) =>
        at(i * 150, () => {
          // A card Layout is about to drag in is outlined where it belongs.
          const r = slots.get(b) ?? pageRect(b)
          enter(c, r.x - 4, r.y - 4)
          const size = `${round(r.w)} × ${round(r.h)}`
          say(c, size)
          const box = mark(u, 'swarm-box', 'architect', {
            x: r.x - 4,
            y: r.y - 4,
            w: r.w + 8,
            h: r.h + 8,
          })
          const badge = document.createElement('span')
          badge.className = 'swarm-badge'
          badge.textContent = size
          box.append(badge)
          animate(280, (q) => {
            const e = (1 - ease(q)) * 100
            box.style.clipPath = `inset(-24px ${e}% ${e}% -2px)`
          })
          at(160, () => go(c, r.x + r.w, r.y + r.h))
        }),
      )
      return blocks.length * 150 + 300
    },
    copy: (u, p, c) => {
      const texts = (p.texts ?? []).slice(0, phone ? 1 : 2)
      say(c, `${words(texts)} ${labels.units.words}`)
      let t = 0
      for (const el of texts) {
        const ends = wordEnds(el)
        if (ends.length === 0) continue
        // Streamed a word at a time, as an agent types: about 35 ms a word.
        const dur = Math.min(Math.max(ends.length * 35, 450), 1300)
        at(t, () => {
          const veiled = u.veils.get(el)
          const caret = mark(u, 'swarm-mark', 'copy', {
            x: ends[0]!.x,
            y: ends[0]!.y,
            w: 2,
            h: ends[0]!.h,
          })
          enter(c, ends[0]!.x, ends[0]!.y + ends[0]!.h)
          animate(
            dur,
            (q) => {
              const k = Math.max(1, Math.ceil(q * ends.length))
              const end = ends[k - 1]!
              caret.style.transform = `translate(${end.x + 1}px, ${end.y}px)`
              caret.style.height = `${end.h}px`
              c.path = [{ x: end.x + 4, y: end.y + end.h }]
              veiled?.lines.forEach((line, i) => {
                const div = veiled.divs[i]!
                if (line.y + line.h / 2 < end.y) div.style.width = '0px'
                else if (Math.abs(line.y - end.y) < line.h / 2) {
                  const from = end.x + 2
                  div.style.transform = `translate(${from}px, ${line.y}px)`
                  div.style.width = `${Math.max(line.x + line.w + 2 - from, 0)}px`
                }
              })
            },
            () => {
              caret.remove()
              unveil(u, el)
            },
          )
        })
        t += dur + 80
      }
      return Math.max(t, 300) + 100
    },
    layout: (u, p, c) => {
      const cards = (p.cards ?? []).slice(0, phone ? 1 : 2)
      let t = 0
      cards.forEach((card) => {
        const [dx, dy] = offsets.get(card) ?? [0, 0]
        const slot = slots.get(card)
        const dur = Math.abs(dx) > 0 ? 650 : 460
        at(t, () => {
          const r = pageRect(card)
          enter(c, r.x + Math.min(r.w / 2, 60), r.y + 14)
          say(c, `${round(Math.hypot(dx, dy))} px`)
          if (slot) {
            const ghost = mark(u, 'swarm-ghost', 'layout', slot)
            at(dur + 260, () => fadeOut(ghost, 200))
          }
        })
        at(t + 220, () =>
          animate(
            dur,
            (q) => {
              const e = 1 - ease(q)
              card.style.translate = `${dx * e}px ${dy * e}px`
              const r = pageRect(card)
              c.path = [{ x: r.x + Math.min(r.w / 2, 60), y: r.y + 14 }]
            },
            () => (card.style.translate = ''),
          ),
        )
        t += dur + 300
      })
      return t
    },
    typography: (u, p, c) => {
      const heads = p.headings.slice(-1)
      const head = heads[0]
      if (!head) return 0
      const style = getComputedStyle(head)
      say(c, `${round(parseFloat(style.fontSize))} px / ${style.fontWeight}`)
      const lines = lineRects(head)
      lines.forEach((line, i) =>
        at(i * 180, () => {
          const sel = mark(u, 'swarm-select', 'typography', { ...line, w: 0 })
          enter(c, line.x, line.y + line.h)
          animate(260, (q) => {
            sel.style.width = `${line.w * ease(q)}px`
            c.path = [{ x: line.x + line.w * ease(q), y: line.y + line.h }]
          })
          at(700, () => fadeOut(sel))
        }),
      )
      return lines.length * 180 + 500
    },
    data: (u, p, c) => {
      const items = (p.items ?? []).slice(0, 9)
      say(c, `${(p.items ?? []).length} ${labels.units.items}`)
      items.forEach((item, i) =>
        at(i * 90, () => {
          const r = pageRect(item)
          enter(c, r.x - 4, r.y + r.h / 2)
          unveil(u, item)
          const tick = mark(u, 'swarm-tick', 'data', {
            x: r.x - 16,
            y: r.y + r.h / 2 - 5,
            w: 10,
            h: 10,
          })
          animate(160, (q) => (tick.style.opacity = String(q)))
        }),
      )
      return items.length * 90 + 250
    },
    diagram: (u, p, c) => {
      if (p.drawings?.length) {
        say(c, `${p.drawings.length} ${labels.units.drawings}`)
        p.drawings.forEach((d, i) =>
          at(i * 140, () => {
            const r = pageRect(d)
            enter(c, r.x + r.w / 2, r.y + r.h / 2)
          }),
        )
        return p.drawings.length * 140 + 200
      }
      const svg = p.diagram
      if (!svg) return 0
      const strokes = all<SVGGeometryElement>(svg, 'g > rect:not(.diagram-plate), g > line')
      const boxes = all(svg, 'g > rect:not(.diagram-plate)').length
      const arrows = all(svg, 'g > line[marker-end]').length
      say(c, `${boxes} ${labels.units.boxes} · ${arrows} ${labels.units.arrows}`)
      const step = Math.min(110, 1000 / Math.max(strokes.length, 1))
      strokes.forEach((s, i) =>
        at(i * step, () => {
          // The trace is drawn over a copy: the diagram itself stays whole the whole time.
          const trace = s.cloneNode() as SVGGeometryElement
          trace.removeAttribute('class')
          trace.removeAttribute('marker-end')
          trace.setAttribute('class', 'swarm-trace')
          trace.style.setProperty('--c', 'var(--color-agent-7)')
          s.after(trace)
          u.undo.push(() => trace.remove())
          const length = s.getTotalLength()
          trace.style.strokeDasharray = `${length}`
          const matrix = s.getScreenCTM()
          animate(
            step * 1.6,
            (q) => {
              trace.style.strokeDashoffset = `${length * (1 - q)}`
              if (!matrix) return
              const pt = s.getPointAtLength(length * q).matrixTransform(matrix)
              c.path = [{ x: pt.x + scrollX, y: pt.y + scrollY }]
            },
            () => fadeOut(trace as unknown as HTMLElement, 400),
          )
          if (i === 0 && matrix) {
            const pt = s.getPointAtLength(0).matrixTransform(matrix)
            enter(c, pt.x + scrollX, pt.y + scrollY)
          }
        }),
      )
      return strokes.length * step + 300
    },
    mockup: (u, p, c) => {
      const frame = p.image
      if (!frame) return 0
      const svg = frame.querySelector('svg')
      const img = frame.querySelector('img')
      const size = svg
        ? `${svg.viewBox.baseVal.width} × ${svg.viewBox.baseVal.height}`
        : img
          ? `${img.naturalWidth} × ${img.naturalHeight}`
          : ''
      say(c, size)
      const full = pageRect(frame)
      const x0 = Math.max(full.x, scrollX)
      const r = { ...full, x: x0, w: Math.min(full.x + full.w, scrollX + innerWidth) - x0 }
      const paint = mark(u, 'swarm-paint', 'mockup', { ...r, w: 0 })
      enter(c, r.x, r.y + r.h / 2)
      animate(
        700,
        (q) => {
          paint.style.width = `${r.w * q}px`
          c.path = [{ x: r.x + r.w * q, y: r.y + r.h * (0.5 + 0.3 * Math.sin(q * 9)) }]
        },
        () => fadeOut(paint, 400),
      )
      return 800
    },
    i18n: report,
    a11y: report,
    perf: report,
    tests: (u, p, c, i) => {
      const targets = (p.buttons ?? []).slice(0, 3)
      if (targets.length === 0) return report(u, p, c, i)
      const text = output.tests!(u)
      if (text) say(c, text)
      targets.forEach((b, k) =>
        at(k * 260, () => {
          const r = pageRect(b)
          enter(c, r.x + r.w / 2, r.y + r.h / 2)
          at(180, () => ripple(u, 'tests', b))
        }),
      )
      return targets.length * 260 + 400
    },
    security: (u, p, c) => {
      const links = p.links ?? []
      if (links.length === 0) return 0
      const safe = links.every((a) => /noopener/.test(a.rel) && /noreferrer/.test(a.rel))
      say(c, `${links.length} ${labels.units.links}${safe ? ' · noopener' : ''}`)
      links.slice(0, 4).forEach((a, k) =>
        at(k * 200, () => {
          const r = pageRect(a)
          enter(c, r.x + r.w, r.y + r.h)
        }),
      )
      return Math.min(links.length, 4) * 200 + 300
    },
    motion: (u, p, c, i) => {
      const spot = near(p, u, i)
      say(c, `lerp ${smoothScroll.lerp}`)
      enter(c, spot.x, spot.y)
      for (let k = 1; k <= 8; k++) {
        at(200 + k * 70, () => {
          const a = (k / 8) * Math.PI * 2
          c.path = [{ x: spot.x + Math.cos(a) * 18, y: spot.y + Math.sin(a) * 12 }]
        })
      }
      return 900
    },
    deploy: report,
    gabriel: () => 0,
  }

  /** Where Layout's cards belong, and how far out they start. */
  const slots = new WeakMap<Element, Rect>()
  const offsets = new WeakMap<Element, [number, number]>()

  // ---- Building a unit ----
  const queue: Unit[] = []
  let current: Unit | null = null

  const crewFor = (u: Unit): Role[] => {
    let list = crews[u.kind]
    if (u.kind === 'project') {
      const extras = [0, 1].map((k) => projectExtras[(u.index * 2 + k) % projectExtras.length]!)
      if (u.index % 2 === 0 && !extras.includes('mockup')) extras[1] = 'mockup'
      if (u.el.querySelector('a[href^="http"]')) extras[1] = 'security'
      list = [...list, ...extras]
    }
    return list.slice(0, budget)
  }

  const setState = (u: Unit, state: Unit['state']) => {
    u.state = state
    u.el.dataset.swarmUnit = state
  }

  const build = (u: Unit) => {
    current = u
    setState(u, 'building')
    html.dataset.swarm = 'building'
    setSlot('status', labels.building)
    const p = parts(u) as Parts
    const crew = crewFor(u)
    // Layout's cards start out of their slots and are dragged in: an image from further away,
    // a panel the last few pixels. CSS translate, so nothing around them moves.
    if (crew.includes('layout')) {
      ;(p.cards ?? []).slice(0, phone ? 1 : 2).forEach((card, i) => {
        const far = card.matches('.project-image, .contact-photo')
        const offset: [number, number] = far ? [phone ? -28 : -56, 40] : [0, 16 + i * 6]
        slots.set(card, pageRect(card))
        offsets.set(card, offset)
        card.style.translate = `${offset[0]}px ${offset[1]}px`
        u.undo.push(() => (card.style.translate = ''))
      })
    }
    // What Copy will type, and what Data will fill, waits under its veil.
    if (crew.includes('copy')) for (const el of (p.texts ?? []).slice(0, phone ? 1 : 2)) veil(u, el)
    if (crew.includes('data')) for (const el of (p.items ?? []).slice(0, 9)) veil(u, el)
    let slot = 0
    const starts: Partial<Record<Role, number>> = {
      architect: 0,
      layout: 150,
      copy: 260,
      diagram: 380,
      data: 450,
      typography: 650,
      mockup: 1050,
    }
    u.until = time + 900
    for (const role of crew) {
      const c = agent(role)
      if (c.busy && c.busy !== u) continue
      // On screen or already claimed, leaving ones included; one place is kept for Gabriel.
      const taken = cursors.filter((x) => x.busy || (x.on && !x.leaving)).length
      if (!c.on && taken >= maxActive - 1) continue
      c.busy = u
      u.crew.push(c)
      const start = starts[role] ?? 500 + slot * 140
      const mySlot = starts[role] === undefined ? slot++ : 0
      at(start, () => {
        if (u.state !== 'building') return
        const took = jobs[role](u, p, c, mySlot)
        u.until = Math.max(u.until, time + took)
        if (took === 0) leave(c)
      })
    }
    // Text no agent came for is simply there.
    const working = new Set(u.crew.map((c) => c.role))
    if (!working.has('copy')) for (const el of p.texts ?? []) unveil(u, el)
    if (!working.has('data')) for (const el of p.items ?? []) unveil(u, el)
    const g = agent('gabriel')
    const review = () => {
      if (u.state !== 'building') return
      if (time < u.until) return at(u.until - time + 60, review)
      const head = p.headings.at(-1)
      let x: number
      let y: number
      if (head) {
        const line = lineRects(head).at(-1) ?? pageRect(head)
        x = Math.min(line.x + line.w + 18, scrollX + innerWidth - 120)
        y = line.y + line.h / 2
      } else {
        const spot = freeSpot(u.el, 150, 40, [])
        x = spot ? spot.x + 10 : scrollX + innerWidth - 140
        y = spot ? spot.y + 10 : scrollY + 90
      }
      enter(g, x + 4, y + 4)
      say(g, labels.approved)
      at(260, () => {
        if (u.state !== 'building') return
        approveMark(x, y)
        finish(u)
      })
    }
    at(1000, review)
  }

  /** Approve a unit: its marks fade, its crew moves on, the next unit starts. */
  const finish = (u: Unit, instant = false) => {
    setState(u, 'built')
    for (const el of [...u.veils.keys()]) unveil(u, el)
    for (const el of u.marks) {
      if (instant) el.remove()
      else at(400, () => fadeOut(el))
    }
    if (instant) for (const undo of u.undo) undo()
    else at(900, () => u.undo.forEach((undo) => undo()))
    // The crew is free at once: the next section may claim them before they fly off.
    const away = u.kind === 'hero' ? leaveUp : leave
    for (const c of u.crew) {
      if (c.busy === u) c.busy = null
      if (c.busy === null) away(c)
    }
    at(instant ? 0 : 400, () => agent('gabriel').busy === null && away(agent('gabriel')))
    u.crew = []
    if (current === u) current = null
    if (u.kind === 'contact' && !instant) at(700, vortex)
    next()
  }

  const next = () => {
    if (current || done) return
    while (queue.length) {
      const u = queue.shift()!
      if (u.state !== 'queued') continue
      const r = u.el.getBoundingClientRect()
      if (r.bottom < 0 || r.top > innerHeight) {
        setState(u, 'waiting')
        continue
      }
      build(u)
      return
    }
    if (!done) {
      html.dataset.swarm = 'idle'
      setSlot('status', labels.building)
    }
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const u = units.find((x) => x.el === entry.target)
        if (!u || !entry.isIntersecting || u.state !== 'waiting' || u.kind === 'hero') continue
        setState(u, 'queued')
        queue.push(u)
      }
      next()
    },
    { rootMargin: '0px 0px -18% 0px' },
  )

  // ---- Boot: the cursors burst out of the logo, and the hero is approved where it stands ----
  const boot = () => {
    const hero = units.find((u) => u.kind === 'hero')
    const logo = document.querySelector('header.top-bar a')
    const from = logo ? pageRect(logo) : { x: 24, y: scrollY + 20, w: 40, h: 16 }
    const crew = crewFor(hero ?? units[0]!).map(agent)
    const first = sessionStorage.getItem('swarm:booted') === null
    try {
      sessionStorage.setItem('swarm:booted', '1')
    } catch {
      // Storage can be blocked; the boot then plays again next time.
    }
    const taken: Rect[] = []
    crew.forEach((c, i) => {
      c.busy = hero ?? null
      if (hero) hero.crew.push(c)
      c.quiet = true
      c.el.hidden = false
      const text = hero ? output[c.role]?.(hero) : undefined
      say(c, text)
      const w = c.label.offsetWidth + 40
      const spot = hero
        ? freeSpot(hero.el, Math.max(w, 120), 44, taken, true, 0.1 + i * 0.16)
        : null
      if (spot) taken.push(spot)
      c.on = true
      c.el.hidden = false
      c.x = from.x + from.w / 2
      c.y = scrollY + 28
      const delay = first ? i * 60 : 0
      at(delay, () => {
        if (!spot) {
          // No free ground (a phone): burst out under the bar and away, covering nothing.
          c.path = [{ x: scrollX + innerWidth + 60, y: scrollY + 28 }]
          c.leaving = true
          return
        }
        c.path = [...spot.way]
        c.way = [{ x: c.x, y: c.y }, ...spot.way]
        // In the hero an agent only reports where it stands, once it stands there: nothing
        // there may be covered, not even by a label on the way.
        c.arriving = true
        if (c.role === 'planner' && facts)
          at(first ? 560 : 0, () => log(c, facts!.sections.map((x) => x.file).join(' · ')))
      })
    })
    if (hero) {
      setState(hero, 'building')
      current = hero
      at(first ? 800 : 200, () => {
        setSlot('status', labels.building)
        html.dataset.swarm = 'building'
      })
      at(first ? 1700 : 900, () => {
        if (hero.state !== 'building') return
        const g = agent('gabriel')
        const spot = freeSpot(hero.el, 150, 44, taken, true, 0.85)
        if (spot) {
          g.on = true
          g.el.hidden = false
          g.x = from.x + from.w / 2
          g.y = scrollY + 28
          g.path = [...spot.way]
          g.way = [{ x: g.x, y: g.y }, ...spot.way]
          g.arriving = true
          say(g, labels.approved)
          at(600, () => approveMark(spot.x + 30, spot.y + 4))
        }
        at(spot ? 700 : 0, () => finish(hero))
      })
    }
    for (const u of units) if (u.kind !== 'hero') observer.observe(u.el)
  }

  // ---- The end: the cursors gather into a vortex beside Contact and spin out ----
  const vortex = () => {
    if (done) return
    const contact = units.find((u) => u.kind === 'contact')!
    for (const c of cursors)
      if (!c.on && active() < maxActive)
        enter(c, scrollX + innerWidth + 40, scrollY + innerHeight / 2)
    const spot = freeSpot(contact.el, 180, 180, [])
    const cx = spot ? spot.x + 90 : scrollX + innerWidth * 0.75
    const cy = spot ? spot.y + 90 : scrollY + innerHeight * 0.5
    const crew = cursors.filter((c) => c.on)
    for (const c of crew) {
      c.quiet = true
      c.busy = null
    }
    const deploy = agent('deploy')
    if (facts && deploy.on) log(deploy, `${facts.deploy.target} · ${facts.commit.hash}`)
    animate(
      1900,
      (q) => {
        crew.forEach((c, i) => {
          const a = (i / crew.length) * Math.PI * 2 + q * Math.PI * 5
          // Gather (0–35%), turn tighter (35–75%), spin out (75–100%).
          const r =
            q < 0.35
              ? 70
              : q < 0.75
                ? 70 - ((q - 0.35) / 0.4) * 40
                : 30 + ((q - 0.75) / 0.25) ** 2 * 1200
          c.path = [{ x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r }]
        })
      },
      () => {
        for (const c of crew) {
          c.on = false
          c.el.hidden = true
          c.quiet = false
        }
        complete()
      },
    )
  }

  const complete = () => {
    done = true
    observer.disconnect()
    html.dataset.swarm = 'done'
    setSlot('status', labels.ready)
    setSlot('progress', '100%')
    if (facts) setSlot('log', `${facts.deploy.target} · ${facts.commit.hash}`)
    if (document.activeElement === skip) document.getElementById('main')?.focus()
    skip.hidden = true
  }

  /** Skip build: every section approved at once, no one left on screen. */
  const skipAll = () => {
    done = true
    tasks.length = 0
    for (const e of effects.splice(0)) e.done?.()
    for (const u of units) if (u.state !== 'built') finish(u, true)
    for (const el of [
      ...root.querySelectorAll<HTMLElement>(
        '.swarm-box, .swarm-mark, .swarm-select, .swarm-tick, .swarm-paint, .swarm-ring, .swarm-check',
      ),
    ])
      el.remove()
    for (const c of cursors) {
      c.on = false
      c.el.hidden = true
      c.busy = null
    }
    queue.length = 0
    current = null
    observer.disconnect()
    complete()
    render()
  }
  skip.addEventListener('click', skipAll)

  // ---- The loop ----
  const progress = () => {
    const contact = document.getElementById('contact')
    if (!contact || done) return
    const end = contact.getBoundingClientRect().top + scrollY - innerHeight * 0.6
    setSlot(
      'progress',
      `${Math.round(Math.min(Math.max(scrollY / Math.max(end, 1), 0), 1) * 100)}%`,
    )
  }

  const render = () => {
    let n = 0
    for (const c of cursors) {
      if (!c.on) continue
      if (!c.leaving) n++
      c.el.classList.toggle('swarm-leaving', c.leaving)
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`
      const showLabel = !c.quiet && !c.leaving && !c.arriving
      c.label.hidden = !showLabel
      // Near the right edge the label hangs to the left of the arrow, so it is never cut off.
      if (showLabel && c.labelWidth === 0) c.labelWidth = c.label.offsetWidth
      const width = c.labelWidth + 16
      c.el.classList.toggle(
        'swarm-flip',
        c.x - scrollX + 12 + width > innerWidth && c.x - scrollX - width > 0,
      )
    }
    setSlot('active', `${labels.active} ${n} / ${labels.total} ${roles.length}`)
  }

  const step = (now: number) => {
    frame = 0
    if (stopped || paused) return
    const dt = Math.min(now - (last || now), 50)
    last = now
    time += dt
    for (let i = 0; i < tasks.length;) {
      if (tasks[i]!.at <= time) tasks.splice(i, 1)[0]!.run()
      else i++
    }
    for (let i = 0; i < effects.length;) {
      const e = effects[i]!
      const p = Math.min((time - e.start) / e.dur, 1)
      e.update(p)
      if (p >= 1) {
        effects.splice(i, 1)
        e.done?.()
      } else i++
    }
    let moving = false
    const k = 1 - (1 - 0.2) ** (dt / 16.7)
    for (const c of cursors) {
      if (!c.on) continue
      const target = c.path[0]
      if (!target) continue
      c.x += (target.x - c.x) * k
      c.y += (target.y - c.y) * k
      if (Math.abs(target.x - c.x) < 1.5 && Math.abs(target.y - c.y) < 1.5) {
        c.path.shift()
        if (c.path.length === 0 && c.arriving) {
          c.arriving = false
          c.quiet = false
        }
        if (c.path.length === 0 && c.leaving) {
          c.on = false
          c.leaving = false
          c.el.hidden = true
        }
      } else moving = true
    }
    render()
    // Keep going while anything moves or waits; otherwise sleep until something wakes the loop.
    if (moving || tasks.length || effects.length) frame = requestAnimationFrame(step)
  }

  function wake() {
    if (!frame && !stopped && !paused) {
      last = 0
      frame = requestAnimationFrame(step)
    }
  }

  // ---- The page around it ----
  const onScroll = () => progress()
  const onVisibility = () => {
    paused = document.hidden
    if (paused) {
      cancelAnimationFrame(frame)
      frame = 0
      html.dataset.swarmPaused = ''
    } else {
      delete html.dataset.swarmPaused
      wake()
    }
  }
  let resizeTimer = 0
  const onResize = () => {
    clearTimeout(resizeTimer)
    resizeTimer = window.setTimeout(() => {
      fitRoot()
      // Marks were laid out for the old width: approve what is in progress as it stands.
      if (current && current.kind !== 'hero') finish(current, true)
    }, 150)
  }
  const resizeObserver = new ResizeObserver(fitRoot)
  resizeObserver.observe(document.body)
  addEventListener('scroll', onScroll, { passive: true })
  addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)
  html.classList.add('swarm-on')
  if (paused) html.dataset.swarmPaused = ''

  progress()
  render()
  void fetch(asset(factsFile))
    .then((r) => (r.ok ? (r.json() as Promise<BuildFacts>) : null))
    .catch(() => null)
    .then((f) => {
      if (stopped) return
      facts = f
      if (f) {
        setSlot('js', `JS ${f.js.kb[locale]} KB`)
        setSlot('commit', f.commit.hash)
        setSlot('host', f.deploy.target)
      }
      boot()
    })
  // The boot reads "Booting swarm…" for up to 800 ms, then the count.
  setTimeout(() => {
    if (!stopped && html.dataset.swarm === 'booting') {
      html.dataset.swarm = 'building'
      setSlot('status', labels.building)
    }
  }, 800)

  return () => {
    stopped = true
    cancelAnimationFrame(frame)
    observer.disconnect()
    resizeObserver.disconnect()
    removeEventListener('scroll', onScroll)
    removeEventListener('resize', onResize)
    document.removeEventListener('visibilitychange', onVisibility)
    for (const u of units) {
      for (const undo of u.undo) undo()
      delete u.el.dataset.swarmUnit
    }
    root.remove()
    dock.remove()
    html.classList.remove('swarm-on')
    delete html.dataset.swarm
    delete html.dataset.swarmPaused
  }
}
