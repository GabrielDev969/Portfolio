import type { Locale } from '@/lib/i18n'
import type { ImageId } from '@/lib/images'

/**
 * A fact Gabriel still has to provide. In development it renders as a marked
 * placeholder; the production build omits it and `pnpm todos` lists it.
 */
export type Todo = { readonly todo: string }
export type Text = string | Todo
/** One or more sentences, set as a paragraph; a missing one drops out on its own. */
export type Prose = Text | Text[]

export function todo(what: string): Todo {
  return { todo: what }
}

export function isTodo(value: unknown): value is Todo {
  return (
    typeof value === 'object' &&
    value !== null &&
    typeof (value as { todo?: unknown }).todo === 'string'
  )
}

export type Link = { label: string; href: string }

export type Milestone = {
  id: string
  start: number
  end: number | 'present'
  title: string
  organization: string
  place?: string
  summary?: string
}

export type ArchitectureNode = {
  id: string
  label: Text
  kind: 'client' | 'service' | 'data' | 'external' | 'device'
}

export type ArchitectureEdge = { from: string; to: string; label?: string }

export type Architecture = {
  nodes: ArchitectureNode[]
  edges: ArchitectureEdge[]
  /** False until Gabriel has checked the boxes and arrows against the real system. */
  confirmed: boolean
}

/**
 * A project in at most 70 words of prose (problem + built + result), enforced by
 * tests/unit/content.test.ts (design/COMMIT-SHEET.md §4).
 */
export type Summary = {
  /** One sentence. */
  problem: Text
  /** One or two sentences: what was built, Gabriel's role, and the one key decision with its reason. */
  built: Prose
  /** One sentence, with a number when there is one. */
  result: Text
}

export type MockupId = 'wave-board' | 'campaign-chart' | 'zibby-store' | 'hostly-schedule'

export type ProjectImage =
  | { kind: 'image'; id: ImageId; alt: string }
  | { kind: 'mockup'; mockup: MockupId; description: string }

export type ProjectLinks =
  | { kind: 'public'; links: Link[] }
  | { kind: 'internal' }
  /** Not internal, but nothing to open for now (Zibby is paused). */
  | { kind: 'none' }
  | Todo

export type Project = {
  id: string
  title: string
  /** Company or client the project was built for; absent for personal projects. */
  organization?: string
  summary: Summary
  architecture: Architecture
  stack: Text[]
  /** The status pill: "In use", "Internal", "Launched Oct 2026". */
  status: string
  /** Real numbers already in the summary, as tiles on the featured project. */
  metrics?: { value: string; label: string }[]
  /** Internal systems show architecture only: fictional images, no links, no real data. */
  internal: boolean
  image: ProjectImage
  links: ProjectLinks
}

/** A labelled list: a stack area and its tools, or the languages Gabriel speaks. */
export type Group = { label: string; items: string[] }

export type SiteContent = {
  locale: Locale
  /** 'source' for English; translations stay 'needs-review' until Gabriel approves them. */
  translation: 'source' | 'needs-review' | 'stub'
  meta: { title: string; description: string }
  person: {
    name: string
    role: string
    coreStack: string[]
    location: string
    workMode: string
    /** Spanish only: PT and EN must not mention relocation. */
    relocation?: string
    heroLine: string
    /**
     * The hero's three counters. Every number must already be in the content (about, the
     * experience, the projects); tests/unit/content.test.ts checks it.
     */
    stats: { value: string; label: string }[]
    availability: string
    about: string
    /** One sentence of `about`, word for word: how he works, for the Experience callout. */
    approach: string
    photo: { id: ImageId; alt: string }
  }
  ui: {
    /** The e-mail box's button, and what it says once the address is on the clipboard. */
    copy: string
    copied: string
    /** The accent serif line over the name: "Hi, I'm". */
    greeting: string
    /** The giant outlined word behind the hero; decorative. */
    backdrop: string
    skipToContent: string
    /** For date ranges that are still open: "2025–present". */
    present: string
    quickView: string
    fullView: string
    sections: string
    language: string
    contact: string
    downloadCv: string
    seeProjects: string
    internalNoLink: string
    noPublicLink: string
    backToTop: string
    /** The heading over the stack, in a project and in the contact section. */
    stack: string
    sectionsNav: string
    languageNav: string
    /** The labels of a project's inline parts, in the order they appear. */
    project: {
      problem: string
      built: string
      architecture: string
      result: string
    }
  }
  sections: {
    experience: { title: string }
    projects: { title: string }
    howIWork: { title: string }
    contact: { title: string }
  }
  experience: Milestone[]
  projects: Project[]
  /** `loop` labels the three beats of the animation beside the closing line. */
  workflow: { steps: string[]; closing: string; loop: [string, string, string] }
  skills: { stack: Group[]; languages: Group }
  /**
   * The build overlay's words (design/COMMIT-SHEET.md §6): the sixteen role names, in roster
   * order, and the dock. The overlay is decorative and aria-hidden; only "Skip build" is a
   * control. Every number it shows comes from build-facts.json or the page itself, never from here.
   */
  swarm: {
    /** Planner, Architect, Layout, Typography, Copy, Data, Diagram, Mockup, i18n, A11y, Perf,
     *  Tests, Security, Motion, Deploy, and Gabriel last. */
    agents: string[]
    booting: string
    building: string
    /** "Ready · deployed", once the last section is approved. */
    ready: string
    active: string
    total: string
    skip: string
    /** Once built: the dock's button, and the footer's, to watch the build again. */
    replay: string
    approved: string
    /** Units after a real count: "62 words", "9 items"; "1 word", "1 item" for one. */
    units: {
      sections: string
      word: string
      words: string
      item: string
      items: string
      boxes: string
      arrows: string
      drawings: string
      links: string
    }
  }
  contact: {
    cta: string
    email: string
    links: Link[]
    /** File in public/; `pnpm todos` reports it until it exists. */
    cv: { href: string; label: string }
    basedIn: string
  }
}
