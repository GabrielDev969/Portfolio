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

- **Sees:** one bar, 56 px tall, fixed at the top on the ground with a hairline under it, in mono.
  - Left: the **GS** monogram in a hairline square, with the full name as its accessible name.
  - Right:
    - Experience · Projects · How I work · Contact (a "Sections" menu below 768 px, where four links do not fit beside the languages);
    - the PT / EN / ES switcher;
    - a small **terminal icon** that toggles Quick view.
  - Before them in the tab order comes "Skip to content", visible only on focus.
- **Moves:** links brighten on hover (150 ms). The Quick view icon is a real toggle (`aria-pressed`) named "Quick view" / "Full view".
- **No-JS:** Sections is a native `<details>`; the Quick view icon is hidden.

## 1 · Hero (intensity 4)

- **Sees**, over the giant outlined `PORTFOLIO` (serif italic, stroke only, white at 7%):
  - **Left (columns 1–6):**
    - "Hi, I'm" in the accent serif italic (PT "Olá, eu sou", ES "Hola, soy");
    - **GABRIEL SANTOS.** in Archivo 900 at 118%, the full stop in the accent;
    - the role pill `[•] FULL STACK DEVELOPER · REMOTE`;
    - "From the database to the screen.";
    - the core stack as mono chips;
    - **Contact** (accent outline, the primary) and **Download CV** (dark pill);
    - three counters from the content: ~5 years of experience, 500+ campaigns a day on Sistema Wave, ~100 people use it.
  - **Center (7–9):** the photo in a bracketed card, a black-and-blue duotone made at build time, with the tag `// SALVADOR, BRAZIL · REMOTE`.
  - **Right (10–12):** three small cards: Group Wave (2025–present), IA Robots Solutions (2025–present), and where he is based and available (and, in Spanish only, the relocation line).
- **5-second test:**
  - name, role, the core stack, "Remote", Contact and Download CV are on the first screen at every width, at first paint, without the swarm;
  - on a first visit with the swarm, all of them are on screen within 1.5 s.
  - The core stack sits in the left column, not in a right-hand card, so it stays on a phone's first screen.
- **Phones:** name → role → line → stack → buttons → counters → photo → cards.
- **Moves:** the name rises once on load (CSS). Hover brightens borders.
- **Quick view:** one column, no photo, no backdrop word.

## 2 · Experience (intensity 2)

- **Sees:**
  - the tag line `[01] // EXPERIENCE ── [01/04]` and the title;
  - each role a bordered card in date order: the years in accent mono, the title, the organization, the summary, the place;
  - five side by side from 1024 px, two on tablets, one on phones;
  - then an accent-bordered callout: `// HOW I WORK` and his own sentence from `about` ("I use AI coding agents daily to move faster without giving up technical judgment.").
- **Quick view:** one entry per line, the callout as plain text.

## 3 · Projects (intensity 3)

- **Sees:**
  - **The feature card** (Sistema Wave): corner brackets, spanning the row.
    - Its mockup is the header.
    - From 1024 px its body has two columns: the status pill, organization, title, problem and what I built on the left; the architecture, result, the metric tiles (500+ campaigns a day, ~100 people), the stack chips and the links on the right.
  - **The other four**, two to a row from 1024 px, each a bordered card with:
    - the image as the header;
    - the status pill, the title and the inline summary;
    - the stack chips;
    - the links.
  - **The architecture** of each is a pipeline of mono chips with arrows, built from `architecture.nodes` (Campaign BI: RedTrack → n8n → RabbitMQ · Next.js app → NestJS → PostgreSQL). Parallel nodes stack in a step, and it wraps on phones.
- **No filter tabs:** everything visible, nothing to click.
- **Moves:** the image pushes in (scrubbed, no pin).
- **Quick view:** one column, no images, the stack as a sentence.

## 4 · How I work (intensity 2)

- **Sees:**
  - the tag line and the title;
  - six numbered cards (mono `01`–`06`, the step, a small hairline drawing), three to a row from 1024 px;
  - then the closing line, "AI speeds things up. The judgment is mine.", as an accent-bordered callout beside the loop of the work.
- **Moves:** each drawing is traced once as its card arrives.
- **Quick view:** the numbered list and the line, no drawings.

## 5 · Contact (intensity 2)

- **Sees:**
  - the tag line and the title;
  - **Left:**
    - "Available for new projects" large;
    - where he is based (and, in Spanish only, the relocation line);
    - **Write to me** (the primary button, `mailto:`);
    - the **e-mail box** with `gabriel.dev969@gmail.com` and an accent **Copy** button (Clipboard API, with the `mailto:` link as the fallback);
    - the profile links and the CV in mono.
  - **Right:** a card with the stack by area and his languages.
  - **Footer row:** © year and name, **Build it again** (the swarm, with JS), Back to top.
- **No-JS:** no Copy and no Build it again; the address is a link.

---

## The swarm: the page builds itself (intensity 4; Gabriel, 2026-11-06)

- **Opens:** empty. The top bar's ground and the dock ("Booting swarm…") are all there is.
- **Then:** the cursors burst out of the logo and build the page in reading order, about 40 s on a desktop:
  1. **the top bar:** outlined, shown;
  2. **the hero:**
     - the name swept in;
     - role, stack and place typed;
     - Contact and Download CV clicked;
     - the line typed;
  3. **Experience:**
     - the title;
     - the rule;
     - each entry's dot, year lit and words typed;
  4. **each project:**
     - the image dragged in and painted;
     - the organization typed and the title swept in;
     - each label shown and each part typed;
     - the diagram traced;
     - the stack panel dragged in and its tools lit;
     - the links clicked;
  5. **How I work:**
     - the title;
     - each step dragged in and its drawing traced;
     - the closing line typed;
  6. **Contact:**
     - the words typed and the buttons and profile links clicked;
     - the photo dragged in;
     - the stack and languages lit;
     - Back to top.
- **Moves by itself:** the page scrolls down to follow the work. The reader does nothing.
- **Approvals:** Gabriel approves each section as the next starts. Reporters (Planner, Perf, A11y, Tests, i18n, Motion, Security, Deploy) come beside each heading with a real number.
- **End:** the cursors gather into a vortex on the freest ground in view and spin out; the dock reads "Ready · deployed".
- **The reader moves:** the build goes on (Gabriel, 2026-11-06). While they scroll up or down the page stops scrolling itself, and after 3 s still it follows the work again. Tab or Skip build: the whole page at once.
- **Finished from the first paint:** reduced motion, Quick view, print, no-JS, a deep link and a second visit this session. If the swarm has not started within 5 s, the page shows itself.

---

## Quick view, the compact one-page summary (intensity 1)

- **What it is:** the same content from the same `content/` source, laid out as a single readable page, like a CV a recruiter can scan in a minute.
  - **Off:** all motion (no Lenis, no ScrollTrigger, no Motion transitions, no hero rise), and the project images, stack panels, workflow drawings and contact photo.
  - **The layout, top to bottom:** the hero (name at heading size, role, stack, "Remote", Download CV and Contact), the dated experience list, compact project blocks with their parts inline, the numbered workflow, and contact.
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
