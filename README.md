# Gabriel Santos — a film in three acts

[![CI](https://github.com/GabrielDev969/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/GabrielDev969/Portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/GabrielDev969/Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/GabrielDev969/Portfolio/actions/workflows/deploy.yml)

The portfolio of Gabriel Santos, Full Stack Developer (Next.js, React, Node.js, NestJS, TypeScript, PostgreSQL), in Salvador, Brazil, working remotely. It is told as a short film you watch by scrolling. For anyone who just wants the facts, **Quick view** turns the film off.

**Live:** https://gabrieldev969.github.io/Portfolio/ · Portuguese, English and Spanish

> Status: rebuild in progress on `rebuild/cinematic` (phase 0 of 7, see [`design/PLAN.md`](design/PLAN.md)). The site above still serves the previous version until the merge.

## Stack

- **Next.js 16** (App Router, static export) with strict **TypeScript**
- **Tailwind CSS v4**, with design tokens in `@theme`
- **GSAP**, ScrollTrigger and SplitText through `@gsap/react` for everything driven by scroll; **Lenis** for smooth wheel scrolling (touch stays native); **Motion** for small component interactions
- **Playwright** and **axe** for end-to-end and accessibility tests, **Lighthouse CI** for performance budgets
- Hosted on **GitHub Pages**, deployed by GitHub Actions

## Run it locally

Requirements: Node 24 (`.nvmrc`) and pnpm 12.

```bash
pnpm install
pnpm dev          # http://localhost:3000/Portfolio/
```

Check the real thing, the static export served under `/Portfolio/` like on Pages:

```bash
pnpm build
pnpm preview      # http://localhost:4173/Portfolio/
```

| Script           | What it does                                               |
| ---------------- | ---------------------------------------------------------- |
| `pnpm lint`      | ESLint (Next.js core-web-vitals and TypeScript rules)      |
| `pnpm typecheck` | `tsc --noEmit` in strict mode                              |
| `pnpm test`      | Unit tests for the content contract and language detection |
| `pnpm format`    | Prettier, including Tailwind class order                   |
| `pnpm todos`     | Every fact still missing, grouped by section and project   |

## Where to edit content

All copy lives in `src/content/`. No text is hard-coded in components.

- `schema.ts`: the `SiteContent` type, the single source of the shape
- `en.ts`: the English source
- `pt.ts` and `es.ts`: the translations, with the same shape (a unit test enforces it)

A fact that is not known yet is written as `todo('what is missing')`:

- In development, it renders as a marked placeholder.
- The production build leaves it out.
- `pnpm todos` lists it.

The Santiago relocation line exists only in Spanish, and a test fails if it reaches the Portuguese or English pages.

## Images and CVs

- **Project stills:** the sources go in `assets/scenes/`. The build script writes AVIF/WebP sizes into `public/scenes/` (added in phase 4).
- **CVs:** `public/cv/CV_Gabriel_Santos_{PT,EN,ES}.pdf`. Each locale links its own file.

## How it is built

- **Sections are Server Components.** The content is in the HTML, readable with JavaScript off.
- **Motion lives in thin client wrappers.** Every scroll scene goes through one hook (`useScrollScene`) that handles cleanup, breakpoints, reduced motion and Quick view.
- **Routes:** `/Portfolio/` picks the language in the browser (the saved choice first, then the browser's languages) and keeps deep-link hashes. Each locale is prerendered at `/Portfolio/{pt,en,es}/`.
- **Design decisions** are written before code in [`design/`](design/):
  - [`STORYBOARD.md`](design/STORYBOARD.md): one sheet per section
  - [`COMMIT-SHEET.md`](design/COMMIT-SHEET.md): color, type, grid, motion budget and what is banned
  - [`PLAN.md`](design/PLAN.md): phases, pinned versions and budgets

## Missing facts

Run `pnpm todos` for the current list. CI prints it in every run summary.
