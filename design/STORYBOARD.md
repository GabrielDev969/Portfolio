# Storyboard

One sheet per section, in page order. Intensity is from 1 to 5, and the hero's entrance is the only 4; nothing is a 5.

**Rule zero:** a developer's portfolio. Every section title says plainly what it is (Experience, Projects, How I work, Contact), and nothing on the page is a metaphor the reader has to decode (design/COMMIT-SHEET.md).

Each section describes four versions:

- **"Full"** is the default view.
- **"Reduced"** is the `prefers-reduced-motion` version: the same layout, with opacity in place of movement, and no Lenis.
- **"Quick view"** is the compact one-page summary (see the last sheet).
- **"No-JS"** means everything is visible in the static HTML, in reading order.

Motion families (see COMMIT-SHEET §5): **A** mask rise · **B** draw · **C** push-in.

---

## Top bar (persistent, intensity 1)

- **Sees:** one bar, 56 px tall, fixed at the top on the page's own ground with a hairline under it. The name "Gabriel Santos" on the left (links to the top; the "GS" monogram below 640 px, so the row fits a 360 px phone in all three languages, with the full name kept as its accessible name). On the right, a **"Sections"** button, a **"Quick view"** toggle and the PT / EN / ES switcher. Before them in the tab order comes a "Skip to content" link, visible only on focus.
- **Moves:**
  - Sections opens a plain list (Experience, Projects, How I work, Contact) on the tone step, using Motion `clip-path`, 220 ms ease-out. Keyboard: Enter/Space opens it, Esc closes it and focus returns to the button.
  - **Quick view** is a real toggle (`aria-pressed`). Its label reads "Quick view" in the full view and "Full view" in Quick view. Flipping it switches modes in place, with no reload, and keeps the reader's current section in view.
- **Reduced:** the same; the menu opens without the wipe.
- **Quick view:** the same bar.
- **No-JS:** Sections is a native `<details>` list. Quick view is hidden, because it needs JS to remember the choice.

## 1 · Hero (intensity 4, the page's one entrance)

- **Sees:** the name "GABRIEL SANTOS" at title size in two lines, then the role ("Full Stack Developer"), the core stack as a sentence, "Salvador, Brazil. **Remote.**" (and, in Spanish only, the relocation line), and the two primary buttons, **Contact** (velvet) and **Download CV** (ink). Beside the name on wide screens, the line "From the database to the screen." in Newsreader italic; under it, a quiet "See projects" link with an arrow that jumps to Projects.
- **5-second test:** every fact above, and both buttons, are on the first screen under the top bar at every width (390 × 844, 768 × 1024, 1280 × 720, 1366 × 768, 1440 × 900), in every locale. Phones align the block to the top, so a font swap only moves what is below a rewrapped line.
- **Moves:** family A, once, on load: the two lines of the name rise from behind their masks (1.1 s, `expo.out`, 60 ms apart). It is CSS, so it needs no JS and runs at first paint. Nothing else in the hero moves, and the name never changes size.
- **Reduced:** the name is simply there.
- **Quick view:** the name at heading size, the facts and buttons in one column.
- **No-JS:** the same as the full view, without the rise.

## 2 · Experience (intensity 2)

- **Sees:** the title "Experience" on its hairline, then a dated timeline of five entries in date order (Systems Analyst at Fator, the B.Sc. at UNIFACS, Full Stack Developer at Group Wave, the IA Robots contract, the UNIPDS postgraduate degree). Each entry shows its start year at heading size with the end ("–2025", "–present") under it, the title, the organization, a one-line summary where there is one, and the place in `--ink-2`.
  - **From 1024 px:** the five entries sit side by side on a horizontal hairline, a dot where each meets the line.
  - **Below 1024 px:** a vertical list on a hairline down the left, a dot per entry.
- **Moves:** the title rises (family A). The entries are simply there: a timeline is read, not revealed. **Nothing is pinned and nothing scrolls sideways.**
- **Reduced:** the title fades in.
- **Quick view:** one entry per line: "2021–2025 Systems Analyst, Fator Sistemas & Consultorias. …".
- **No-JS:** the same as the full view.

## 3 · Projects (intensity 3)

- **Sees:** five projects, each sized to its content and **not pinned**, with one shared treatment:
  - **Image:** a 12:5 frame (4:3 on phones) on the tone step with a hairline, bleeding off the left page edge to column 8, so a light screenshot never melts into the light page.
  - **Title** at heading size on the ground, columns 9–12, with the organization above it in `--ink-2`.
  - **Logline** in Newsreader, 2–4 lines.
  - **Stack panel:** a `--screen-2` panel overlapping the image's bottom-right corner, columns 8–10: "Stack" on the left, one tool per line on the right. Below 1024 px it follows the logline.
  - **"Technical details" button:** ink outline, under the stack panel, next to the public link or the note "Internal system, no public link".
  - **Phones and tablets (< 1024 px):** the parts stack in order (image at full bleed, title, logline, stack, actions).
- **The images:**
  1. **Sistema Wave:** a stylized request board with fictional teams and tasks.
  2. **Campaign BI:** a chart drawn from fictional weekly numbers and invented media-buyer names.
  3. **Zibby:** a fictional storefront and its admin panel side by side.
  4. **Hostly:** the robot schedule screen, with a fictional campaign playlist and a "now playing" track.
  5. **BookOwl:** the real screenshot, as AVIF/WebP, with its GitHub link.

  The mockups are inline SVG on one 1200 × 502 canvas, in the site's own type and tones, drawn in the page's language and marked `aria-hidden`; each frame carries a text description. The 4:3 phone crop keeps 670 of the 1200 units: Wave and Campaign BI keep the left edge, where their titles are; Zibby and Hostly keep the middle. BookOwl on phones is letterboxed on the tone step instead of cropped, so its welcome text stays whole.

- **Moves:** family C, a scrubbed timeline per project as it crosses the viewport, with no pin: the image pushes in (`scale 1.12 → 1`) while the stack lines rise one by one. The logline uses family A (SplitText lines behind masks) when the project's top crosses 70%.
- **Technical details:** the button opens a native modal `<dialog>` drawer from the right, wiping in with `clip-path` over 220 ms through CSS `@starting-style`, so the drawer adds no JS.
  - Esc, the Close button and a click on the backdrop close it, and focus returns to the button. The drawer scrolls natively (`data-lenis-prevent`) while the page behind it does not.
  - It always holds the same six parts, in this order: **the problem**, **my role**, **architecture** (a diagram of 2–6 boxes and arrows laid out at build time from the content, with the same information as a list), **key decisions** (2–3, each with its reason), **testing and deploy**, **outcome**. Links follow.
  - **In production, a part with no facts yet is left out with its heading**, and a decision whose reason is missing shows the decision alone. `pnpm todos` lists every gap.
- **Facts** (everything else is `TODO(gabriel)`):

  | Project      | Architecture                                                                                                                                                                                          | Decisions and other facts                                                                                                                                                                                        |
  | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Sistema Wave | Next.js/React web → NestJS API → PostgreSQL                                                                                                                                                           | All `TODO`                                                                                                                                                                                                       |
  | Campaign BI  | RedTrack → n8n → RabbitMQ → NestJS (workers and API) → PostgreSQL; the Next.js app with Google sign-in → NestJS API                                                                                   | A system, not just dashboards; monthly, weekly and per-media-buyer views; a largest-remainder allocation script corrected inflated conversion and revenue metrics, reconciled against the reference spreadsheets |
  | Zibby        | pnpm monorepo, modular monolith: storefront and admin (Next.js) → NestJS API → PostgreSQL via Prisma, plus Stripe and Resend (e-mail); Microsoft Clarity in the storefront and a Meta Pixel per store | Own product, built in phases with AI coding agents (plan → review → implement → tests → diff review → merge); automated tests; hosted on a VPS; **launched in October 2026** (the server is off for now)         |
  | Hostly       | Admin panel and robot app → backend on a VPS; the app reaches RobotOS (OrionStar LuckiBot Plus) through an abstraction layer                                                                          | The abstraction layer lets it move to AgentOS later; the admin panel schedules ad campaigns and music; designed to become a multi-company SaaS later                                                             |
  | BookOwl      | A Python/Django app; the database is `TODO`                                                                                                                                                           | Open source on GitHub, built for a real church library                                                                                                                                                           |

- **Internal systems** (Sistema Wave, Campaign BI, Hostly) show architecture only: no real names, numbers, screenshots or data.
- **Reduced:** no push-in. The image fades in, the stack appears at once, and the drawer opens with opacity only.
- **Quick view:** each project is a compact block with the title, logline, stack as a sentence and the six parts shown **inline**, with a small diagram. No images, no stack panel; the links appear once, on the project.
- **No-JS:** everything is visible; the technical details are a `<details>` that opens in place. The same server-rendered parts fill the `<details>`, the drawer and the Quick view block.

## 4 · How I work (intensity 2)

- **Sees:** the title "How I work", then six numbered steps in workflow order, each a small line drawing on the tone step with its caption: 1 I plan (a checklist), 2 I review the plan (the sheet under a magnifying glass), 3 The AI implements (a code window), 4 I review the diff (two panes, a line removed and a line added), 5 I run the tests (three passing checks), 6 Merge (a branch joining the main line). One column on phones, two from 768 px, three from 1024 px. Then the closing line at heading size in italic: "AI speeds things up. The judgment is mine."
- **Moves:** family B: as each step arrives, its drawing is traced once (`stroke-dashoffset 1 → 0`, 0.9 s, its strokes in order). Nothing is scrubbed or pinned; the drawings are complete in the markup until this runs.
- **Reduced:** the steps fade in, drawings complete.
- **Quick view:** the numbered list and the closing line, without drawings.
- **No-JS:** the drawings are complete.

## 5 · Contact (intensity 2)

- **Sees:** the title "Contact" on its hairline, on the page's ground like every other section.
  - **Left (columns 1–6):** "Based in Salvador, Brazil, working remotely." (and, in Spanish only, the relocation line), "**Available for new projects**", then **Write to me**, the one red button of the section (`mailto:`), with the e-mail beside it, then LinkedIn, GitHub, YouTube, TikTok and Download CV as plain links.
  - **Right (columns 8–12):** Gabriel's photo, then "Stack": each area (Frontend, Backend, Data, DevOps & automation, Architecture) on the left and its tools on the right, and the languages he speaks.
  - **Last:** a small "Back to top" link in `--ink-2`.
- **Moves:** the title rises (family A). Back to top is a plain `#top` anchor, which Lenis scrolls smoothly.
- **Reduced:** the title fades in; Back to top jumps.
- **Quick view:** one column; no photo.
- **No-JS:** the same; Back to top is a plain anchor.

---

## Quick view, the compact one-page summary (intensity 1)

- **What it is:** the same content from the same `content/` source, laid out as a single readable page, like a CV a recruiter can scan in a minute.
  - **Off:** all motion (no Lenis, no ScrollTrigger, no Motion transitions, no hero rise), and the project images, stack panels, workflow drawings and contact photo.
  - **The layout, top to bottom:** the hero (name at heading size, role, stack, "Remote", Download CV and Contact), the dated experience list, compact project blocks with their technical details inline, the numbered workflow, and contact.
  - It uses one column at `62ch` on the ground.
- **How it works:**
  - The toggle writes `localStorage.viewMode` (`full` | `quick`).
  - The inline `<head>` script reads it and sets `html[data-view]` before first paint, so a returning Quick view reader never sees the full page flash.
  - Sections use a Tailwind `quick:` variant on the same markup. The content is not duplicated in the DOM.
  - `useScrollScene` reads the mode. Switching to Quick view reverts every GSAP context and stops Lenis. Switching back recreates them and calls `ScrollTrigger.refresh()`.
- **Print:** paper always gets Quick view. `@media print` applies the `quick:` layout, and on `beforeprint` the page also switches to Quick view without saving the choice, because scenes that already ran leave GSAP's inline styles behind. On `afterprint` it returns to the full view on the same section. The top bar and skip link are not printed, and the velvet and ink buttons print as ink outlines, since paper drops backgrounds.

---

## Intensity map

| Section    | Intensity    |
| ---------- | ------------ |
| **Hero**   | **4**        |
| Experience | 2            |
| Projects   | 3            |
| How I work | 2            |
| Contact    | 2            |
| Quick view | 1 throughout |
