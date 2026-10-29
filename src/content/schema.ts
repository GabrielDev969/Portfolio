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

/** `why` is left out when `what` already gives the reason in one sentence. */
export type Decision = { what: Text; why?: Text }

export type Details = {
  problem: Prose
  role: Prose
  architecture: Architecture
  /** Two or three entries; enforced by tests/unit/content.test.ts. */
  decisions: Decision[]
  testing: Prose
  deploy: Prose
  outcome: Prose
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
  logline: string
  stack: Text[]
  /** Internal systems show architecture only: fictional images, no links, no real data. */
  internal: boolean
  image: ProjectImage
  links: ProjectLinks
  technicalDetails: Details
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
    availability: string
    about: string
    photo: { id: ImageId; alt: string }
  }
  ui: {
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
    technicalDetails: string
    close: string
    internalNoLink: string
    noPublicLink: string
    backToTop: string
    /** The heading over the stack, in a project and in the contact section. */
    stack: string
    sectionsNav: string
    languageNav: string
    details: {
      problem: string
      role: string
      architecture: string
      decisions: string
      testingAndDeploy: string
      outcome: string
      links: string
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
  workflow: { steps: string[]; closing: string }
  skills: { stack: Group[]; languages: Group }
  contact: {
    cta: string
    email: string
    links: Link[]
    /** File in public/; `pnpm todos` reports it until it exists. */
    cv: { href: string; label: string }
    basedIn: string
  }
}
