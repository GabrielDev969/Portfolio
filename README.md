# Gabriel Santos — Full Stack Developer

[![CI](https://github.com/GabrielDev969/Portfolio/actions/workflows/ci.yml/badge.svg)](https://github.com/GabrielDev969/Portfolio/actions/workflows/ci.yml)
[![Deploy](https://github.com/GabrielDev969/Portfolio/actions/workflows/deploy.yml/badge.svg)](https://github.com/GabrielDev969/Portfolio/actions/workflows/deploy.yml)

The portfolio of Gabriel Santos, Full Stack Developer (Next.js, React, Node.js, NestJS, TypeScript, PostgreSQL), in Salvador, Brazil, working remotely. One bright page with four sections (Experience, Projects, How I work, Contact), each project with its technical details: the problem, the role, the architecture, the decisions, testing and deploy, and the outcome. For anyone who just wants the facts, **Quick view** turns the motion off.

**Live:** https://gabrieldev969.github.io/Portfolio/ · Portuguese, English and Spanish

The design is summarized in [`DESIGN.md`](DESIGN.md) and decided in [`design/`](design/).

## Stack

- **Next.js 16** (App Router, static export under `/Portfolio`) with strict **TypeScript 6** and **React 19**
- **Tailwind CSS v4**, with the design tokens in `@theme`
- **GSAP** (ScrollTrigger, SplitText) for the scroll reveals, loaded after first paint through `src/motion/runtime.ts`; **Lenis** smooths the wheel only (touch stays native); **Motion** for the sections menu; the technical-details drawer is a native `<dialog>` animated in CSS
- **Playwright** and **axe** for end-to-end and accessibility tests, **Lighthouse CI** for performance
- Hosted on **GitHub Pages**, built and deployed by GitHub Actions

## Run it locally

Requirements: Node 24 (`.nvmrc`) and pnpm 12.

```bash
pnpm install
pnpm dev          # http://localhost:3000/Portfolio/
```

Check the real thing, the static export served gzipped under `/Portfolio/` like on Pages:

```bash
pnpm build
pnpm preview      # http://localhost:4173/Portfolio/
```

| Script                | What it does                                                                                                        |
| --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `pnpm lint`           | ESLint (Next.js core-web-vitals and TypeScript rules)                                                               |
| `pnpm typecheck`      | `tsc --noEmit` in strict mode                                                                                       |
| `pnpm format`         | Prettier, including Tailwind class order                                                                            |
| `pnpm test`           | Unit tests: the content contract, translations, contrast, language detection, generated files                       |
| `pnpm test:e2e`       | Playwright against the production build: the 5-second test, every section, view modes, i18n, SEO, no-JS, print, axe |
| `pnpm measure:js`     | Initial JS per locale, gzipped (CI fails above 180 KB)                                                              |
| `pnpm measure:vitals` | LCP and CLS on a throttled phone, in every locale                                                                   |
| `pnpm lighthouse`     | Lighthouse mobile, desktop and simulated mobile, with a summary table ([`lighthouse/`](lighthouse/))                |
| `pnpm journey`        | Screenshot every 0.6 screens at 390, 768 and 1440 px (`LOCALE=pt`, `VIEW=quick`, `SECTION=projects`)                |
| `pnpm todos`          | Every fact still missing; `--readme` refreshes the list below                                                       |
| `pnpm copy`           | The page's words per locale, in page order, to `design/copy/` for translation review                                |
| `pnpm og`             | Redraws the share images in `public/og/` (needs `pnpm preview`)                                                     |
| `pnpm flaky`          | After a CI run, lists every test that passed only on its retry                                                      |

## Where to edit content

All copy lives in `src/content/`; no text is hard-coded in components.

- `schema.ts`: the `SiteContent` type, the single source of the shape
- `en.ts`: the English source; `pt.ts` and `es.ts`: the translations, with the same shape (a unit test enforces it, and another fails on English or Portuguese left in a translation)
- `missing.ts`: the placeholders shared by every locale
- The words drawn inside the project mockups are in `src/components/mockups/copy.ts`

A fact that is not known yet is written as `todo('what is missing')`. In development it renders as a marked placeholder; the production build leaves it out together with its label; `pnpm todos` lists it. After a content change, run `pnpm copy` (and `pnpm todos --readme`); the unit tests fail until the generated files match.

The Santiago relocation line exists only in Spanish, and a test fails if it reaches the Portuguese or English pages. Another fails on film vocabulary or portfolio clichés in any language (design/COMMIT-SHEET.md §8).

## Images and CVs

- **Images:** the sources live in `assets/images/`; `pnpm images` (run before every build) writes the AVIF and WebP sizes listed in `src/lib/images.ts` into `public/images/`.
- **CVs:** `public/cv/CV_Gabriel_Santos_{PT,EN,ES}.pdf`, one per locale. Until a file is there, the published page leaves out its Download CV links, so it never links to a 404.
- **Share images:** `public/og/{pt,en,es}.png`, drawn by `pnpm og` in the site's own fonts.

## How it is built

- **Sections are Server Components**, so the content is in the HTML and readable with JavaScript off. Motion lives in thin client wrappers, and every scroll reveal goes through one hook, `useScrollScene`, which handles cleanup, breakpoints, reduced motion and Quick view.
- **View modes:** a head script sets `html[data-view]` before first paint; sections style Quick view with a Tailwind `quick:` variant on the same markup, which also applies to print.
- **Routes:** `/Portfolio/` picks the language in the browser (the saved choice, then the browser's languages) and keeps deep-link hashes. Each locale is prerendered at `/Portfolio/{pt,en,es}/` with its canonical URL, hreflang links, Open Graph image and a schema.org Person.

## Quality gates

Every push runs, in CI:

- lint, typecheck, formatting and unit tests;
- the build and the 180 KB initial-JS budget;
- the Playwright suite. CI retries a failed test once, with a trace, and lists every test that needed it in the run summary and as a warning;
- Lighthouse: mobile with applied throttling and desktop must reach Accessibility, Best Practices and SEO ≥ 95, LCP ≤ 2.5 s and CLS ≤ 0.1, and desktop Performance ≥ 90. Mobile Performance ≥ 90 is gated locally and a warning on CI, whose shared runners score the same build about ten points lower ([`lighthouse/`](lighthouse/README.md)); the simulated mobile run (what PageSpeed Insights shows) is reported alongside;
- the list of missing facts, in the run summary.

Measured after the cleanup: initial JS 176.9 KB; LCP 0.62 s and CLS ≤ 0.002 on a throttled phone in every locale; Lighthouse mobile (CPU calibrated to a mid-tier phone) 98–99 / 100 / 100 / 100, desktop 100 / 100 / 100 / 100, simulated mobile 86–89 (see [`DESIGN.md`](DESIGN.md#budgets)).

## Deploy

`deploy.yml` builds and publishes to GitHub Pages on every push to `master` (Settings → Pages → Source: GitHub Actions). Work happens on branches; CI runs on pull requests.

## Missing facts

Everything below is a `todo()` in the content or a missing file. None of it shows on the published site.

<!-- todos:start -->

37 open items.

- **Project: Sistema Wave**
  - the problem this project solved
  - what you owned in this project
  - a key technical decision (×2)
  - why you made it (×2)
  - how it is tested
  - how it is deployed
  - the outcome, ideally with a number
- **Project: Campaign BI**
  - the problem this project solved
  - what you owned in this project
  - why these views
  - why a queue between n8n and the workers
  - how it is tested
  - how it is deployed
  - the outcome, ideally with a number
- **Project: Zibby**
  - a public link for Zibby, if there is one
  - the problem this project solved
  - why a modular monolith in one monorepo
  - why PostgreSQL and Prisma
  - why Stripe and Zendrop
  - one number, if you want it: orders, products or uptime
- **Project: Hostly**
  - the rest of the Hostly stack
  - the problem this project solved
  - what you owned in this project
  - why this split
  - what that changed in the design today
  - how it is tested
  - the outcome, ideally with a number
- **Project: BookOwl**
  - the problem this project solved
  - what you owned in this project
  - the BookOwl database
  - why Python and Django
  - why open source
  - how it is tested
  - how BookOwl is deployed
  - the outcome, ideally with a number

<!-- todos:end -->
