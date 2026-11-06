import type { SiteContent } from '@/content/schema'
import { builtStorageKey } from '@/lib/storage-keys'
import { asset } from '@/lib/site'
import { getLenis } from '@/motion/lenis'
import { smoothScroll } from '@/motion/tokens'
import { factsFile, type BuildFacts } from './facts'

/**
 * The swarm (design/COMMIT-SHEET.md §6). The page opens empty (html[data-build], set by the
 * head script) and fifteen agents and Gabriel build it in front of the reader, piece by piece,
 * from the top bar to Contact, while the page scrolls down by itself. The reader never has to
 * scroll; the moment they scroll, click or press a key, the build hands over and everything is
 * there. The words are in the HTML and the accessibility tree from the first byte: the build
 * only ever changes opacity, overlays and transforms, so nothing moves and nothing is lost.
 *
 * One overlay in page coordinates holds every cursor and mark; one requestAnimationFrame loop
 * moves them on its own clock, which stops while the tab is hidden. Nothing goes through React.
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

/** How a piece arrives. */
type How =
  | 'show' // the Architect outlines it, and it is there
  | 'self' // its own box only (a rule, a hairline, a list's dot)
  | 'heading' // swept in line by line, then selected
  | 'type' // typed a word at a time behind a caret
  | 'drag' // dragged in from out of its slot
  | 'items' // its items light up one by one
  | 'draw' // its drawing is traced stroke by stroke
  | 'click' // it appears and is clicked

type Unit = {
  kind: Kind
  el: HTMLElement
  heading: Element | null
  state: 'waiting' | 'building' | 'built'
}

type Piece = { el: Element; how: How; role: Role; unit: Unit; group?: Element[] }

/** The e2e specs that test each kind of section, for the Tests agent's count. */
const specs: Record<Kind, string[]> = {
  hero: ['hero.spec.ts'],
  experience: ['experience.spec.ts'],
  project: ['projects.spec.ts', 'mockups.spec.ts'],
  how: ['how-i-work.spec.ts'],
  contact: ['contact.spec.ts'],
}

/** The text pairing each kind of section is mostly set in, for the A11y agent. */
const pairing: Record<Kind, string> = {
  hero: 'ink/screen',
  experience: 'ink/screen',
  project: 'ink-2/screen',
  how: 'ink/screen',
  contact: 'screen/velvet',
}

/** The agents who only report, by kind of section: they come beside the heading with a number. */
const reporters: Record<Kind, Role[]> = {
  hero: ['planner', 'perf', 'a11y'],
  experience: ['i18n', 'tests'],
  project: ['tests', 'a11y'],
  how: ['motion', 'tests'],
  contact: ['security', 'deploy', 'perf'],
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
  text: string
  labelWidth: number
  /** Engine time it last worked: an idle agent leaves. */
  used: number
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
      const line = lines.find(
        (l) => Math.abs(l.y - y) < r.height / 2 && Math.abs(l.x + l.w - r.left - scrollX) < 400,
      )
      if (line) {
        const right = Math.max(line.x + line.w, r.right + scrollX)
        line.x = Math.min(line.x, r.left + scrollX)
        line.w = right - line.x
        line.h = Math.max(line.h, r.height)
      } else lines.push({ x: r.left + scrollX, y, w: r.width, h: r.height })
    }
  }
  return lines.sort((p, q) => p.y - q.y || p.x - q.x)
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

/** The color behind an element: the first ancestor that paints a background. */
function groundOf(el: Element) {
  for (let node: Element | null = el; node; node = node.parentElement) {
    const bg = getComputedStyle(node).backgroundColor
    if (bg && bg !== 'transparent' && !/^rgba\(.*,\s*0\)$/.test(bg)) return bg
  }
  return getComputedStyle(document.body).backgroundColor
}

const arrow =
  '<svg viewBox="0 0 16 20" aria-hidden="true"><path d="M1 1v15.5l4.2-4 2.9 6.6 2.6-1.1-2.9-6.5H14z" style="fill: var(--c); stroke: var(--color-screen)" stroke-width="1.2" stroke-linejoin="round"/></svg>'
const check =
  '<svg viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9.5" style="fill: var(--c)"/><path d="m5.5 10.2 3 3 6-6.4" fill="none" style="stroke: var(--color-screen)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>'

export function startSwarm(labels: Labels, locale: string): () => void {
  const html = document.documentElement
  const phone = matchMedia('(max-width: 767px)').matches
  const maxActive = phone ? 6 : 8
  /** Phones go a little faster: there is less on screen at once. */
  const pace = phone ? 0.85 : 1
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
  html.classList.add('swarm-on')
  const slot = (k: string) => dock.querySelector<HTMLElement>(`[data-k="${k}"]`)!
  const setSlot = (k: string, text: string) => {
    const el = slot(k)
    if (el.textContent !== text) el.textContent = text
  }
  setSlot('status', labels.booting)
  setSlot('progress', '0%')
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
      text: name,
      labelWidth: 0,
      used: 0,
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
  const leave = (c: Cursor) => {
    if (!c.on || c.leaving) return
    c.leaving = true
    c.path = [
      { x: c.x - scrollX < innerWidth / 2 ? scrollX - 60 : scrollX + innerWidth + 60, y: c.y },
    ]
    wake()
  }
  /** Fly in from the nearer side of the screen, unless already on it; never past the cap. */
  const enter = (c: Cursor, x: number, y: number) => {
    c.used = time
    c.quiet = false
    if (!c.on || c.leaving) {
      // Coming back on counts too: one at work makes way first.
      if (active() >= maxActive) {
        const idle = cursors
          .filter((o) => o.on && !o.leaving && o !== c && o.role !== 'gabriel')
          .sort((a, b) => a.used - b.used)[0]
        if (idle) leave(idle)
      }
      if (!c.on) {
        c.x = x - scrollX < innerWidth / 2 ? scrollX - 40 : scrollX + innerWidth + 40
        c.y = y
      }
      c.on = true
      c.leaving = false
      c.el.hidden = false
    }
    c.path = [{ x, y }]
    wake()
  }
  const follow = (c: Cursor, x: number, y: number) => {
    c.used = time
    c.path = [{ x, y }]
  }

  // ---- Marks ----
  const marks = new Set<HTMLElement>()
  const mark = (className: string, role: Role, r: Rect) => {
    const el = document.createElement('div')
    el.className = className
    el.style.setProperty('--c', `var(--color-agent-${roles.indexOf(role) + 1})`)
    Object.assign(el.style, {
      transform: `translate(${r.x}px, ${r.y}px)`,
      width: `${r.w}px`,
      height: `${r.h}px`,
    })
    root.append(el)
    marks.add(el)
    return el
  }
  const drop = (el: HTMLElement) => {
    el.remove()
    marks.delete(el)
  }
  const fadeOut = (el: HTMLElement, dur = 300) =>
    animate(
      dur,
      (p) => (el.style.opacity = String(1 - p)),
      () => drop(el),
    )
  const box = (r: Rect) => {
    const b = mark('swarm-box', 'architect', { x: r.x - 4, y: r.y - 4, w: r.w + 8, h: r.h + 8 })
    const t = document.createElement('span')
    t.className = 'swarm-badge'
    t.textContent = `${round(r.w)} × ${round(r.h)}`
    b.append(t)
    animate(260, (q) => {
      const e = (1 - ease(q)) * 100
      b.style.clipPath = `inset(-24px ${e}% ${e}% -2px)`
    })
    return b
  }
  const ripple = (role: Role, target: Element) => {
    const r = pageRect(target)
    const cx = r.x + r.w / 2
    const cy = r.y + r.h / 2
    const ring = mark('swarm-ring', role, { x: cx, y: cy, w: 0, h: 0 })
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
      () => drop(ring),
    )
  }
  const approveMark = (x: number, y: number) => {
    const el = mark('swarm-check', 'gabriel', { x: x - 10, y: y - 10, w: 20, h: 20 })
    el.innerHTML = check
    // Scale inside the transform: the separate `scale` property would scale the offset too.
    animate(
      220,
      (p) => (el.style.transform = `translate(${x - 10}px, ${y - 10}px) scale(${ease(p)})`),
    )
    at(1100, () => fadeOut(el))
  }

  // ---- Revealing the page's own pieces (opacity only; see globals.css) ----
  const touched = new Set<Element>()
  const reveal = (el: Element, self = false) => {
    el.classList.add(self ? 'b-self' : 'b-on')
    touched.add(el)
    // Every element starts at opacity 0, containers too: the boxes around a piece show their
    // own selves (their other children stay hidden until their turn).
    for (let up = el.parentElement; up && up !== document.body; up = up.parentElement) {
      if (up.matches('main, header.top-bar')) break
      if (up.classList.contains('b-self') || up.classList.contains('b-on')) break
      up.classList.add('b-self')
      touched.add(up)
    }
  }
  const moved = new Set<HTMLElement>()
  /**
   * Covers an element's lines with its own background, so it can be revealed and then typed or
   * swept in: the veils go in the same task as the reveal, so nothing flashes.
   */
  const veil = (el: Element) => {
    const color = groundOf(el.parentElement ?? el)
    return lineRects(el).map((line) => {
      const v = mark('swarm-veil', 'copy', {
        x: line.x - 2,
        y: line.y - 1,
        w: line.w + 6,
        h: line.h + 2,
      })
      v.style.background = color
      return { line, v }
    })
  }

  // ---- The page, top to bottom: sections and their pieces ----
  const units: Unit[] = []
  const unit = (kind: Kind, el: Element | null, heading: Element | null) => {
    if (!(el instanceof HTMLElement)) return null
    const u: Unit = { kind, el, heading, state: 'waiting' }
    el.dataset.swarmUnit = 'waiting'
    units.push(u)
    return u
  }
  const pieces: Piece[] = []
  const add = (
    u: Unit | null,
    el: Element | null | undefined,
    how: How,
    role: Role,
    group?: Element[],
  ) => {
    if (u && el) pieces.push({ el, how, role, unit: u, ...(group ? { group } : {}) })
  }
  const one = (scope: ParentNode, s: string) => scope.querySelector(s)

  const bar = document.querySelector('header.top-bar')
  const hero = unit('hero', document.getElementById('top'), document.getElementById('hero-name'))
  if (hero) {
    add(hero, bar?.firstElementChild, 'show', 'architect')
    add(hero, document.getElementById('hero-name'), 'heading', 'typography')
    for (const p of all(hero.el, ':scope > div:first-of-type > p')) add(hero, p, 'type', 'copy')
    for (const a of all(hero.el, '[data-fact="contact"], [data-fact="cv"]'))
      add(hero, a, 'click', 'layout')
    add(hero, one(hero.el, ':scope > p'), 'type', 'copy')
    add(hero, one(hero.el, ':scope > a'), 'show', 'architect')
  }

  const exp = document.getElementById('experience')
  const expUnit = unit('experience', exp, exp && one(exp, 'h2'))
  if (exp && expUnit) {
    add(expUnit, one(exp, 'h2'), 'heading', 'typography')
    add(expUnit, one(exp, '.timeline'), 'self', 'architect')
    for (const li of all(exp, '.timeline-item')) {
      add(expUnit, li, 'self', 'layout')
      add(expUnit, one(li, '.timeline-years'), 'items', 'data', [one(li, '.timeline-years')!])
      add(expUnit, one(li, '.timeline-body'), 'type', 'copy', all(li, '.timeline-body > *'))
    }
  }

  const projectsTitle = document.getElementById('projects-title')
  all<HTMLElement>(document, '#projects article').forEach((article, i) => {
    const u = unit('project', article, one(article, 'h3'))
    if (!u) return
    if (i === 0) add(u, projectsTitle, 'heading', 'typography')
    add(u, one(article, '.project-image'), 'drag', 'layout')
    add(u, one(article, '.project-head'), 'type', 'copy', all(article, '.project-head > p'))
    add(u, one(article, 'h3'), 'heading', 'typography')
    for (const part of all(article, '.project-part')) {
      add(u, one(part, 'dt'), 'show', 'architect')
      const dd = one(part, 'dd')
      if (dd?.querySelector('svg')) add(u, dd, 'draw', 'diagram')
      else add(u, dd, 'type', 'copy')
    }
    const stack = one(article, '.project-stack')
    add(u, stack, 'drag', 'layout')
    if (stack) add(u, one(stack, 'ul'), 'items', 'data', all(stack, '.stack-line'))
    add(u, one(article, '.project-links'), 'click', 'security')
  })

  const how = document.getElementById('how-i-work')
  const howUnit = unit('how', how, how && one(how, 'h2'))
  if (how && howUnit) {
    add(howUnit, one(how, 'h2'), 'heading', 'typography')
    for (const step of all(how, '.step')) {
      add(howUnit, step, 'drag', 'layout')
      add(howUnit, one(step, 'svg'), 'draw', 'diagram')
    }
    add(howUnit, one(how, '.page-grid > p'), 'type', 'copy')
    add(howUnit, one(how, '.build-loop'), 'show', 'architect')
  }

  const contact = document.getElementById('contact')
  const contactUnit = unit('contact', contact, contact && one(contact, 'h2'))
  if (contact && contactUnit) {
    add(contactUnit, one(contact, 'h2'), 'heading', 'typography')
    const left = one(contact, '.page-grid > div:first-child')
    if (left) {
      for (const p of all(left, ':scope > p')) add(contactUnit, p, 'type', 'copy')
      add(contactUnit, one(left, ':scope > div'), 'click', 'tests')
      add(contactUnit, one(left, ':scope > ul'), 'click', 'security')
    }
    add(contactUnit, one(contact, '.contact-photo'), 'drag', 'layout')
    add(contactUnit, one(contact, '.contact-about h3'), 'heading', 'typography')
    for (const dl of all(contact, '.skill-list'))
      add(contactUnit, dl, 'items', 'data', all(dl, '.skill-group'))
    add(contactUnit, one(contact, '.page-grid > p:last-child'), 'show', 'architect')
  }

  // ---- Facts ----
  const fact = {
    js: () => (facts ? facts.js.kb[locale] : undefined),
    tests: (kind: Kind) =>
      facts ? specs[kind].reduce((n, s) => n + (facts!.tests.e2e[s] ?? 0), 0) : undefined,
    contrast: (kind: Kind) => (facts ? facts.contrast[pairing[kind]] : undefined),
  }
  const output: Partial<Record<Role, (u: Unit) => string | undefined>> = {
    planner: () => `${facts?.sections.length ?? units.length} ${labels.units.sections}`,
    perf: () => (fact.js() === undefined ? undefined : `JS ${fact.js()} KB`),
    a11y: (u) =>
      fact.contrast(u.kind) === undefined ? undefined : `AA ${fact.contrast(u.kind)}:1`,
    tests: (u) => (fact.tests(u.kind) === undefined ? undefined : `${fact.tests(u.kind)} e2e`),
    i18n: () => (facts?.locales ?? ['pt', 'en', 'es']).map((l) => l.toUpperCase()).join(' · '),
    motion: () => `lerp ${smoothScroll.lerp}`,
    deploy: () => facts?.deploy.target,
    security: (u) => {
      const links = all<HTMLAnchorElement>(u.el, 'a[href^="http"]')
      if (links.length === 0) return undefined
      const safe = links.every((a) => /noopener/.test(a.rel) && /noreferrer/.test(a.rel))
      return `${links.length} ${labels.units.links}${safe ? ' · noopener' : ''}`
    },
  }

  // ---- The page scrolls itself to follow the build ----
  let focusY: number | null = null
  const focus = (y: number) => {
    focusY = y
  }
  const scrollStep = (dt: number) => {
    if (focusY === null || done) return
    const max = document.documentElement.scrollHeight - innerHeight
    const want = Math.min(Math.max(focusY - innerHeight * 0.38, 0), max)
    const k = 1 - (1 - 0.07) ** (dt / 16.7)
    if (Math.abs(want - scrollY) > 0.5) scrollTo(0, scrollY + (want - scrollY) * k)
  }

  // ---- How each piece arrives; each returns how long it takes (ms) ----
  const typeIn = (els: Element[], c: Cursor) => {
    // Veils first, all of them, then the reveal: the words appear only as they are typed.
    const parts = els.map((el) => ({ ends: wordEnds(el), veils: veil(el) }))
    for (const el of els) reveal(el)
    say(c, `${words(els)} ${labels.units.words}`)
    let t = 0
    for (const { ends, veils } of parts) {
      if (ends.length === 0) {
        veils.forEach(({ v }) => drop(v))
        continue
      }
      // Streamed a word at a time, as an agent writes: about 22 ms a word, quicker when long.
      const dur = Math.min(Math.max(ends.length * 22, 180), 900) * pace
      at(t, () => {
        const first = ends[0]!
        const caret = mark('swarm-mark', 'copy', { x: first.x, y: first.y, w: 2, h: first.h })
        enter(c, first.x, first.y + first.h)
        animate(
          dur,
          (q) => {
            const k = Math.max(1, Math.ceil(q * ends.length))
            const end = ends[k - 1]!
            caret.style.transform = `translate(${end.x + 1}px, ${end.y}px)`
            caret.style.height = `${end.h}px`
            follow(c, end.x + 4, end.y + end.h)
            focus(end.y)
            for (const { line, v } of veils) {
              if (line.y + line.h / 2 < end.y) v.style.width = '0px'
              else if (Math.abs(line.y - end.y) < line.h / 2) {
                const from = end.x + 1
                v.style.transform = `translate(${from}px, ${line.y - 1}px)`
                v.style.width = `${Math.max(line.x + line.w + 4 - from, 0)}px`
              }
            }
          },
          () => {
            drop(caret)
            veils.forEach(({ v }) => drop(v))
          },
        )
      })
      t += dur
    }
    return Math.max(t, 120)
  }

  /** The Mockup agent paints across an image once it is in place. */
  const paint = (frame: HTMLElement) => {
    const c = agent('mockup')
    const svg = frame.querySelector('svg')
    const img = frame.querySelector('img')
    say(
      c,
      svg
        ? `${svg.viewBox.baseVal.width} × ${svg.viewBox.baseVal.height}`
        : img
          ? `${img.naturalWidth} × ${img.naturalHeight}`
          : undefined,
    )
    const full = pageRect(frame)
    const x0 = Math.max(full.x, scrollX)
    const r = { ...full, x: x0, w: Math.min(full.x + full.w, scrollX + innerWidth) - x0 }
    const brush = mark('swarm-paint', 'mockup', { ...r, w: 0 })
    enter(c, r.x, r.y + r.h / 2)
    animate(
      650 * pace,
      (q) => {
        brush.style.width = `${r.w * q}px`
        follow(c, r.x + r.w * q, r.y + r.h * (0.5 + 0.3 * Math.sin(q * 9)))
      },
      () => fadeOut(brush, 400),
    )
  }

  const arrive: Record<How, (p: Piece, c: Cursor) => number> = {
    show: (p, c) => {
      const r = pageRect(p.el)
      enter(c, r.x, r.y)
      say(c, `${round(r.w)} × ${round(r.h)}`)
      const b = box(r)
      reveal(p.el)
      at(500, () => fadeOut(b))
      return 260
    },
    self: (p, c) => {
      const r = pageRect(p.el)
      enter(c, r.x, r.y)
      reveal(p.el, true)
      if (p.role === 'architect') {
        say(c, `${round(r.w)} × ${round(r.h)}`)
        const b = box(r)
        at(500, () => fadeOut(b))
      }
      return 160
    },
    heading: (p, c) => {
      const el = p.el
      const style = getComputedStyle(el)
      say(c, `${round(parseFloat(style.fontSize))} px / ${style.fontWeight}`)
      const veils = veil(el)
      reveal(el)
      const lines = veils.map((v) => v.line)
      const dur = 320 * pace
      if (lines[0]) enter(c, lines[0].x, lines[0].y + lines[0].h)
      animate(
        dur,
        (q) => {
          const e = ease(q)
          for (const { line, v } of veils) {
            const from = line.x + line.w * e
            v.style.transform = `translate(${from}px, ${line.y - 1}px)`
            v.style.width = `${Math.max(line.x + line.w + 4 - from, 0)}px`
          }
          const end = lines.at(-1)
          if (end) follow(c, end.x + end.w * e, end.y + end.h)
        },
        () => {
          veils.forEach(({ v }) => drop(v))
          // Then the type is set: a selection passes over it.
          for (const line of lines) {
            const sel = mark('swarm-select', 'typography', { ...line, w: 0 })
            animate(220, (q) => (sel.style.width = `${line.w * ease(q)}px`))
            at(600, () => fadeOut(sel))
          }
        },
      )
      return dur + 120
    },
    type: (p, c) => typeIn(p.group?.length ? p.group : [p.el], c),
    drag: (p, c) => {
      const el = p.el as HTMLElement
      const slot = pageRect(el)
      const far = el.matches('.project-image, .contact-photo')
      const dx = far ? (phone ? -28 : -64) : 0
      const dy = far ? 44 : 22
      el.style.translate = `${dx}px ${dy}px`
      moved.add(el)
      reveal(el)
      const ghost = mark('swarm-ghost', 'layout', slot)
      const b = box(slot)
      const grab = (e: number) => ({
        x: slot.x + dx * e + Math.min(slot.w / 2, 60),
        y: slot.y + dy * e + 14,
      })
      enter(c, grab(1).x, grab(1).y)
      say(c, `${round(Math.hypot(dx, dy))} px`)
      const dur = (far ? 620 : 380) * pace
      at(120, () =>
        animate(
          dur,
          (q) => {
            const e = 1 - ease(q)
            el.style.translate = `${dx * e}px ${dy * e}px`
            const g = grab(e)
            follow(c, g.x, g.y)
          },
          () => {
            el.style.translate = ''
            moved.delete(el)
            fadeOut(ghost, 200)
            fadeOut(b, 300)
            if (el.matches('.project-image')) paint(el)
          },
        ),
      )
      return dur + 160
    },
    items: (p, c) => {
      const items = p.group ?? []
      reveal(p.el, true)
      say(c, `${items.length} ${labels.units.items}`)
      const step = Math.min(90, 700 / Math.max(items.length, 1)) * pace
      items.forEach((item, i) =>
        at(i * step, () => {
          const r = pageRect(item)
          enter(c, r.x - 4, r.y + Math.min(r.h, 30) / 2)
          focus(r.y)
          reveal(item)
          const tick = mark('swarm-tick', 'data', { x: r.x - 16, y: r.y + 8, w: 10, h: 10 })
          animate(160, (q) => (tick.style.opacity = String(q)))
          at(700, () => fadeOut(tick))
        }),
      )
      return items.length * step + 120
    },
    draw: (p, c) => {
      const svg = p.el instanceof SVGSVGElement ? p.el : p.el.querySelector('svg')
      if (!svg) {
        reveal(p.el)
        return 120
      }
      const strokes = all<SVGGeometryElement>(
        svg,
        'rect:not(.diagram-plate), line, path, circle, polyline',
      ).filter((s) => !s.closest('defs'))
      const texts = all<SVGElement>(svg, 'text, .diagram-plate')
      const lengths = strokes.map((s) =>
        s.hasAttribute('pathLength') ? Number(s.getAttribute('pathLength')) : s.getTotalLength(),
      )
      // Hidden strokes first, then the reveal, so the drawing is traced from nothing.
      strokes.forEach((s, i) => {
        s.style.strokeDasharray = `${lengths[i]}`
        s.style.strokeDashoffset = `${lengths[i]}`
        s.style.fillOpacity = '0'
      })
      for (const t of texts) t.style.opacity = '0'
      reveal(p.el)
      const boxes = all(svg, 'g > rect:not(.diagram-plate)').length
      const arrows = all(svg, 'g > line[marker-end]').length
      say(
        c,
        boxes
          ? `${boxes} ${labels.units.boxes} · ${arrows} ${labels.units.arrows}`
          : `${strokes.length} ${labels.units.items}`,
      )
      const r0 = pageRect(svg)
      enter(c, r0.x + 10, r0.y + 10)
      focus(r0.y)
      const step = Math.min(90, 900 / Math.max(strokes.length, 1)) * pace
      strokes.forEach((s, i) =>
        at(i * step, () => {
          const length = lengths[i]!
          const total = s.getTotalLength()
          const matrix = s.getScreenCTM()
          animate(
            step * 1.8,
            (q) => {
              s.style.strokeDashoffset = `${length * (1 - q)}`
              if (!matrix) return
              const pt = s.getPointAtLength(total * q).matrixTransform(matrix)
              follow(c, pt.x + scrollX, pt.y + scrollY)
            },
            () => {
              s.style.strokeDasharray = ''
              s.style.strokeDashoffset = ''
              s.style.fillOpacity = ''
            },
          )
        }),
      )
      at(strokes.length * step * 0.6, () => texts.forEach((t) => (t.style.opacity = '')))
      return strokes.length * step + 200
    },
    click: (p, c) => {
      reveal(p.el)
      const targets = p.el.matches('a, button') ? [p.el] : all(p.el, 'a, button')
      targets.slice(0, 3).forEach((t, k) =>
        at(k * 160 * pace, () => {
          const r = pageRect(t)
          enter(c, r.x + r.w / 2, r.y + r.h / 2)
          at(120, () => ripple(c.role, t))
        }),
      )
      const text = output[c.role]?.(p.unit)
      if (text) say(c, text)
      return Math.max(targets.length, 1) * 160 * pace + 120
    },
  }

  // ---- The run: one piece after another; Gabriel approves each section ----
  let index = 0
  let current: Unit | null = null

  const startUnit = (u: Unit) => {
    current = u
    u.state = 'building'
    u.el.dataset.swarmUnit = 'building'
    // The agents who only report come beside the heading for a moment.
    reporters[u.kind].slice(0, phone ? 1 : 2).forEach((role, i) =>
      at(250 + i * 200, () => {
        const text = output[role]?.(u)
        if (text === undefined || done) return
        const c = agent(role)
        const anchor = pageRect(u.heading ?? u.el)
        const line = u.heading ? (lineRects(u.heading).at(-1) ?? anchor) : anchor
        enter(c, Math.min(line.x + line.w + 28, scrollX + innerWidth - 200), anchor.y + 6 + i * 30)
        say(c, text)
        if (role === 'planner' && facts) log(c, facts.sections.map((s) => s.file).join(' · '))
        at(1800, () => leave(c))
      }),
    )
  }

  const approve = (u: Unit) => {
    const g = agent('gabriel')
    let x: number
    let y: number
    if (u.heading) {
      const line = lineRects(u.heading).at(-1) ?? pageRect(u.heading)
      x = Math.min(line.x + line.w + 18, scrollX + innerWidth - 120)
      y = line.y + line.h / 2
    } else {
      x = scrollX + innerWidth - 160
      y = pageRect(u.el).y + 40
    }
    enter(g, x + 4, y + 4)
    say(g, labels.approved)
    at(260, () => {
      approveMark(x, y)
      u.state = 'built'
      u.el.dataset.swarmUnit = 'built'
      // Anything the plan did not name is there too.
      reveal(u.el)
    })
    at(900, () => leave(g))
  }

  const next = () => {
    if (done || stopped) return
    const piece = pieces[index]
    if (!piece) {
      if (current) approve(current)
      current = null
      at(900, vortex)
      return
    }
    if (piece.unit !== current) {
      if (current) approve(current)
      startUnit(piece.unit)
    }
    index++
    setSlot('progress', `${Math.round((index / pieces.length) * 100)}%`)
    focus(pageRect(piece.el).y)
    const took = arrive[piece.how](piece, agent(piece.role))
    // The next piece starts while this one is still landing: a crowd at work, not a queue.
    at(Math.max(took * 0.62, 110), next)
  }

  // ---- The end: the cursors gather into a vortex beside Contact and spin out ----
  const vortex = () => {
    if (done) return
    focusY = null
    for (const c of cursors)
      if (!c.on && active() < maxActive)
        enter(c, scrollX + innerWidth + 40, scrollY + innerHeight / 2)
    // On the freest ground in view: the candidate that sits on the fewest words.
    const words = all(document, 'main :is(h1, h2, h3, p, li, dt, dd, a, img)').map(pageRect)
    const [cx, cy] = [
      [0.25, 0.62],
      [0.78, 0.3],
      [0.5, 0.5],
      [0.25, 0.3],
      [0.78, 0.7],
    ]
      .map(([fx, fy]) => [scrollX + innerWidth * fx!, scrollY + innerHeight * fy!] as const)
      .map(([x, y]) => ({
        x,
        y,
        hits: words.filter(
          (r) => r.x < x + 90 && r.x + r.w > x - 90 && r.y < y + 90 && r.y + r.h > y - 90,
        ).length,
      }))
      .sort((p, q) => p.hits - q.hits)
      .map((c) => [c.x, c.y] as const)[0]!
    const crew = cursors.filter((c) => c.on)
    for (const c of crew) c.quiet = true
    if (facts) log(agent('deploy'), `${facts.deploy.target} · ${facts.commit.hash}`)
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

  /** Everything there, the page handed back to the reader. */
  const complete = () => {
    if (done) return
    done = true
    focusY = null
    html.dataset.swarm = 'done'
    delete html.dataset.build
    for (const u of units) {
      u.state = 'built'
      u.el.dataset.swarmUnit = 'built'
    }
    setSlot('status', labels.ready)
    setSlot('progress', '100%')
    if (facts) setSlot('log', `${facts.deploy.target} · ${facts.commit.hash}`)
    try {
      sessionStorage.setItem(builtStorageKey, '1')
    } catch {
      // Storage can be blocked; the page then builds again on the next visit.
    }
    getLenis()?.start()
    if (document.activeElement === skip) document.getElementById('main')?.focus()
    // Invisible but in place: the dock keeps its size, so nothing in it moves.
    skip.style.visibility = 'hidden'
    unlisten()
  }

  /** Skip build, or the reader taking the page: everything at once, no one left on screen. */
  const skipAll = () => {
    if (done) return
    tasks.length = 0
    for (const e of effects.splice(0)) e.done?.()
    for (const el of [...marks]) drop(el)
    for (const el of moved) el.style.translate = ''
    moved.clear()
    for (const c of cursors) {
      c.on = false
      c.el.hidden = true
    }
    complete()
    render()
  }
  skip.addEventListener('click', skipAll)
  /** The reader scrolls, clicks or types: the page is theirs, all of it, at once. */
  const takeOver = (event: Event) => {
    if (event.target instanceof Node && dock.contains(event.target)) return
    skipAll()
  }
  const unlisten = () => {
    removeEventListener('wheel', takeOver)
    removeEventListener('touchstart', takeOver)
    removeEventListener('keydown', takeOver)
    removeEventListener('pointerdown', takeOver)
  }
  addEventListener('wheel', takeOver, { passive: true })
  addEventListener('touchstart', takeOver, { passive: true })
  addEventListener('keydown', takeOver)
  addEventListener('pointerdown', takeOver)

  // ---- The loop ----
  const render = () => {
    let n = 0
    for (const c of cursors) {
      if (!c.on) continue
      if (!c.leaving) n++
      c.el.classList.toggle('swarm-leaving', c.leaving)
      c.el.style.transform = `translate3d(${c.x}px, ${c.y}px, 0)`
      const showLabel = !c.quiet && !c.leaving
      c.label.hidden = !showLabel
      if (showLabel && c.labelWidth === 0) c.labelWidth = c.label.offsetWidth
      const width = c.labelWidth + 16
      // Near the right edge the label hangs to the left of the arrow, so it is never cut off.
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
    // Lenis smooths the reader's wheel; while the page drives itself it stands aside.
    if (!done) getLenis()?.stop()
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
    scrollStep(dt)
    // An agent with nothing to do for a while goes.
    for (const c of cursors)
      if (c.on && !c.leaving && !c.quiet && c.role !== 'gabriel' && time - c.used > 1600) leave(c)
    let moving = false
    const k = 1 - (1 - 0.22) ** (dt / 16.7)
    for (const c of cursors) {
      if (!c.on) continue
      const target = c.path[0]
      if (!target) continue
      c.x += (target.x - c.x) * k
      c.y += (target.y - c.y) * k
      if (Math.abs(target.x - c.x) < 1.5 && Math.abs(target.y - c.y) < 1.5) {
        c.path.shift()
        if (c.path.length === 0 && c.leaving) {
          c.on = false
          c.leaving = false
          c.el.hidden = true
        }
      } else moving = true
    }
    render()
    // Keep going while anything moves or waits; otherwise sleep until something wakes the loop.
    if (moving || tasks.length || effects.length || (!done && focusY !== null))
      frame = requestAnimationFrame(step)
  }

  function wake() {
    if (!frame && !stopped && !paused) {
      last = 0
      frame = requestAnimationFrame(step)
    }
  }

  // ---- The page around it ----
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
  const resizeObserver = new ResizeObserver(fitRoot)
  resizeObserver.observe(document.body)
  let width = innerWidth
  const onResize = () => {
    // Every mark was laid out for the old width: hand the page over as it stands. (A phone's
    // bar showing or hiding changes only the height, and does not count.)
    if (innerWidth !== width && !done) skipAll()
    width = innerWidth
  }
  addEventListener('resize', onResize)
  document.addEventListener('visibilitychange', onVisibility)
  if (paused) html.dataset.swarmPaused = ''

  // ---- Boot: the cursors burst out of the logo into the empty page ----
  const boot = () => {
    const logo = document.querySelector('header.top-bar a')
    const from = logo ? pageRect(logo) : { x: 24, y: scrollY + 20, w: 40, h: 16 }
    const burst: Role[] = phone
      ? ['planner', 'architect', 'typography', 'copy']
      : ['planner', 'architect', 'typography', 'copy', 'layout', 'data']
    burst.forEach((role, i) => {
      const c = agent(role)
      c.on = true
      c.el.hidden = false
      c.x = from.x + from.w / 2
      c.y = from.y + from.h / 2
      c.used = time
      c.quiet = true
      const a = -0.5 + (i / burst.length) * 1.4
      at(i * 50, () => {
        c.path = [
          {
            x: Math.min(c.x + Math.cos(a) * (140 + i * 50), scrollX + innerWidth - 40),
            y: scrollY + 110 + Math.max(Math.sin(a), -0.2) * 120 + i * 36,
          },
        ]
      })
      at(520 + i * 40, () => (c.quiet = false))
    })
    at(450, next)
  }

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
    })
  scrollTo(0, 0)
  boot()
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
    resizeObserver.disconnect()
    removeEventListener('resize', onResize)
    unlisten()
    document.removeEventListener('visibilitychange', onVisibility)
    for (const el of moved) el.style.translate = ''
    for (const el of touched) el.classList.remove('b-on', 'b-self')
    for (const u of units) delete u.el.dataset.swarmUnit
    root.remove()
    dock.remove()
    html.classList.remove('swarm-on')
    delete html.dataset.swarm
    delete html.dataset.swarmPaused
    // Stopped before the end (Quick view, print, reduced motion): the page is simply there.
    delete html.dataset.build
    getLenis()?.start()
  }
}
