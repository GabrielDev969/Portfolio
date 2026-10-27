# Storyboard

One scene-sheet per section, in page order. Intensity is from 1 to 5, and exactly one scene is a 5.

**Rule zero:** a developer's portfolio first. Every section heading says plainly what it is (Experience, Projects, How I work, Contact). The act names only frame it.

Each scene describes four versions:

- **"Film"** is the default.
- **"Reduced"** is the `prefers-reduced-motion` version. It is an alternative art direction: it keeps opacity and color changes and scale up to 2%, and drops translation, parallax, scrubbing, Lenis and the cold open.
- **"Quick view"** is the compact one-page summary (see the last sheet).
- **"No-JS"** means everything is visible in the static HTML, in reading order.

Motion families (see COMMIT-SHEET §5): **A** mask rise · **B** reel (linear scrub) · **C** push-in.

---

## HUD (persistent, intensity 1)

- **Sees:** the HUD lives inside the black masking bars, never over content.
  - **Top bar:** the wordmark "Gabriel Santos" (links to the top), a "Chapters" button, a **"Quick view"** toggle and the PT / EN / ES switcher. Before them in the tab order comes a "Skip to content" link, visible only on focus.
  - **Bottom bar:** the timecode `00:01:24:12` with the current section next to it ("Act II · Projects"). On the right is one plain availability line: "Available for new projects" (ES: "Disponible · Santiago, Chile").
- **Moves:**
  - The timecode is family B: written through a ref from scroll progress, 24 fps over a 3-minute "runtime".
  - The section name crossfades (opacity, 200 ms) when a section's trigger becomes active.
  - Chapters opens a plain list (Experience, Projects, How I work, Contact) using Motion `clip-path`, 220 ms ease-out. Keyboard: Enter/Space opens it, Esc closes it and focus returns to the button.
  - **Quick view** is a real toggle (`aria-pressed`). Its label reads "Quick view" in film mode and "Film view" in Quick view. Flipping it switches modes in place, with no reload, and keeps the reader's current section in view.
- **Scroll:** the bars are 13.5 vh tall each while closed (the hero; 9 vh on phones) and 44 px each once open. The size change uses `scaleY` on the bar background; the HUD rows translate, so nothing triggers layout.
- **Reduced:** the timecode still updates (it is information, not movement). The bars switch between their two states in place, with no movement.
- **Quick view:** the bars become one plain solid top bar (wordmark, Chapters, toggle, language). The timecode, bottom bar, grain and vignette are removed.
- **No-JS:** the bars are static at 44 px. The timecode shows `00:00:00:00`. Chapters is a plain anchor list. Quick view is hidden, because it needs JS to remember the choice.

## 0 · Cold open (intensity 3, first visit only)

- **Sees:** a black screen with grain. A projector beam enters from the top-right corner as a soft cone cut with `clip-path` and lit by a radial gradient (light, not glow). Then the card "A GABRIEL SANTOS PRODUCTION" in Newsreader small caps, in screen color.
- **Moves (1.5 s at most, the cap from the brief):**

  | Time      | What happens                                                                                    |
  | --------- | ----------------------------------------------------------------------------------------------- |
  | 0–0.4 s   | The beam opacity flickers up in two steps, like a lamp warming                                  |
  | 0.4–1.2 s | The card is held                                                                                |
  | 1.3 s     | Hard cut, no fade: the overlay is removed in one frame, revealing the hero with the bars closed |

  A test asserts the overlay is gone by 1.5 s.

- **Skip:** the "Skip intro" button is the first focusable element and visible from frame 0. Esc also skips. The overlay is set in `sessionStorage` (`introSeen`).
- **When it runs:** an inline `<head>` script sets `html[data-intro]` before first paint only when **all** of these hold:
  - there is JS
  - `introSeen` is not set
  - reduced motion is off
  - Quick view is off
  - **the URL has no hash**: a deep link such as `/Portfolio/en/#projects` skips the intro and lands on its target

  CSS shows the overlay only under that attribute, so there is no flash.

- **Reduced, Quick view, deep link, No-JS:** never runs.
- **Measured in phase 2** (`pnpm measure:vitals`; a 390 px phone with Slow 4G and a 4× CPU slowdown, median of 5 runs):
  - without the cold open: LCP 1.33 s, CLS 0.001
  - with it: LCP 1.94 s, CLS 0.000
  - These runs fetched the HTML uncompressed. From phase 4 the preview gzips text the way GitHub Pages does (design/PLAN.md, JS budget), and the same phase 2 to 3 build measures about 0.65 s.
- **Cut and controls:** CSS performs the cut (`animation: cut` with a delay of `--dur-intro`), and the head script wires Skip and Esc, so the intro ends on time even before hydration.

## 1 · Title sequence / Hero (intensity 5, the peak)

- **Sees (the 5-second test):** the narrow band between the closed bars holds, at every width and without scrolling:
  - **"Gabriel / Santos"** in two lines at title size, in capitals, ink on silver. It spans columns 1–7 from 1024 px up and the full width below that.
  - **Role:** "Full Stack Developer"
  - **Core stack**, as one plain sentence: "Next.js, React, Node.js, NestJS, TypeScript and PostgreSQL."
  - **Place and mode:** "Salvador, Brazil. **Remote.**"
  - **Hero line:** "From the database to the screen.", Newsreader italic at scene size. From 1024 px up it sits **beside the name** on columns 8–12, on the name's last baseline, like a poster title. Below 1024 px it comes after the buttons.
  - **Two primary buttons** of the same size:
    - **Contact** (velvet, solid; jumps to the Contact credits)
    - **Download CV** (ink, solid; the PDF for the current locale)
  - **Scroll cue:** "Watch the trailer", quiet text at text-small size with a small reel mark, in the band's bottom-right corner from 1024 px up. It scrolls to Experience with `lenis.scrollTo`. It is a cue, not a button.
- **Moves on load:**
  - The name uses family A: its lines rise from behind their masks, stagger 60 ms.
  - The info block and buttons are **visible from the first frame**: they are not animated in, so they are never late or hidden.
  - The timecode starts.
- **Scroll (the peak):** on the first scroll, the bars part from 13.5 vh to 44 px (family A, `expo.out` 1.2 s). The name scales `1 → 1.06` from its **bottom-left** corner, growing only upward into the space the top bar gave up.
  - The info block and buttons never move, never sit under a bar and never get covered.
  - Scrolling back to the top closes the bars again.
  - It is a one-shot toggle, not a scrub, so it feels like an event.
- **Test:** at 390 × 844, 768 × 1024, 1440 × 900, 1366 × 768 and 1280 × 720, in both film mode and Quick view, all six facts and both buttons are inside the viewport and not covered. "Not covered" is checked with `elementFromPoint` at each element's center: before the peak, mid-peak and after it.
- **Reduced:** the name is visible immediately and does not grow, and the bars switch states in place.
- **Built in CSS, not GSAP:** the name's rise, the bars parting and the 1.06 scale are CSS animations and transitions keyed to `html[data-intro]` and `html[data-bars]`. The bars open from an IntersectionObserver on a 1 px sentinel. So the peak works from first paint, before the GSAP runtime has loaded. After the cold open the rise waits for the cut (its delay includes `--dur-intro`).
- **No-JS:** all text is visible, with the bars at 44 px.

## 2 · Chapter card "Act I / Experience" (intensity 2)

- **Sees:** "Act I" in Newsreader italic at text size above **"Experience"** at title size, set centred-left on columns 2–11. The card is about 70 vh tall and has no hold, so it costs one flick of the wheel.
- **Moves:**
  - As the card enters the frame, the **cue mark** (a velvet dot in the right page margin, up to 28 px and never wider than three quarters of the margin, so it never covers a word) flashes twice for 120 ms each. It is the reel-change signal.
  - The heading then rises (family A).
- **Reduced:** the cue mark shows as a static dot with an opacity pulse, and the heading fades in.
- **Quick view:** the card collapses to a plain section heading: "Experience" at scene size, with no act label and no cue mark.

The cards for Act II / **Projects** and Act III / **How I work** repeat this composition on purpose: it is the recurring device that tells you a new section has started.

## 3 · Act I · Experience, the film strip (intensity 3)

- **Sees:** a full-bleed horizontal 35 mm strip with sprocket rows top and bottom. There are five milestones in chronological order, as a real `<ol>`. Each milestone is:
  - **a 2.39:1 frame** holding the start year at scene size, with the end ("–2025", "–present") at text size below it. Frame 1 also holds **the protagonist's still**: the GitHub portrait, served from `assets/stills/` as AVIF/WebP (7.6 KB), muted to `saturate(0.7)`. Gabriel kept it at the phase 3 gate, so the photo TODO is closed.
  - **under the frame, on the strip margin and at text size:** the role and organisation, one sentence from the content, and the place
  - an edge code (like film-stock edge print) showing the frame's year

  Frames are `min(28vw, 420px)` wide. At 1440 × 900 that makes the reel's overflow, and so the pin, 850 px.

- **The milestones:**
  1. 2021–2025, Systems Analyst at Fator
  2. 2021–2025, B.Sc. at UNIFACS
  3. 2025–present, Group Wave
  4. 2026–present, IA Robots Solutions
  5. 2026–2027, Postgraduate degree at UNIPDS
- **Moves:** family B. The section pins and vertical scroll moves the track sideways in pixels, 1:1 (`ease: none`, scrub 0.6, `invalidateOnRefresh`).
  - **The pin is short:** the frame width is chosen so the track's overflow, and with it the pinned scroll, stays **≤ 1 viewport height** at 1440 × 900. This is the only pin on the page.
  - Each frame's caption slides in from 40 px to the right as the frame crosses 85% of the viewport horizontally (`containerAnimation`).
- **Mobile (< 768 px):** the strip turns vertical, with sprocket rows down the left and right edges and frames stacked. There is no pin. Each caption uses an opacity fade only.
- **How it degrades:** the vertical strip is the markup's default. The horizontal reel exists only while `ExperienceStrip` has set `data-strip="on"`, so if GSAP never loads nothing is cut off.
- **Deep links:** pinning adds about a screen of space above every later section. `KeepAnchor` puts a `#hash` target back on screen after each ScrollTrigger refresh, until the visitor first scrolls, taps or types.
- **Reduced:** the vertical layout at every width (from 768 px up, the caption sits beside its frame), with no pin.
- **Quick view:** a dated list, one line per milestone. Years at text size, bold.
- **No-JS:** the vertical layout.

## 4 · Chapter card "Act II / Projects" (intensity 2)

The same device as card 2, with its own cue mark.

## 5 · Act II · Projects (intensity 3)

- **Sees:** five projects, each sized to its content (about 100 vh) and **not pinned**. Each project is built the same way, because a set shares one treatment:
  - **Still:** a 2.39:1 frame (4:3 on mobile) on a black mat, bleeding off the left page edge to column 8. The mat came out of the phase 4 review: without it a light screenshot melted into the light page and stopped reading as a picture. It has grain and a desaturating layer that lifts to full color while the project is hovered or holds focus. The lift is an opacity crossfade, so `filter` is never animated.
  - **Title** at scene size on the ground, columns 9–12, with the organisation above it in `--ink-2`.
  - **Logline** in Newsreader, 2–3 lines.
  - **Cast block:** a `--screen-2` panel overlapping the still's bottom-right corner, columns 8–10, set as a credit block: "Cast" as the role on the left, one stack item per line on the right. Below 1024 px it follows the logline, sized to its credits.
  - **"Behind the scenes" button:** ink outline, under the cast block, next to the public link or the note "Internal system, no public link".
  - **Phones and tablets (< 1024 px):** the parts stack in order (still at full bleed, title, logline, cast, actions). The side-by-side layout needs about 1024 px before the logline crowds the cast.
- **The stills:**
  1. **Sistema Wave:** a stylized request board in HTML/SVG with fictional teams and tasks.
  2. **Campaign BI:** a real chart rendered from fictional weekly numbers and invented media-buyer names, with no grey placeholder bars.
  3. **Zibby:** a fictional storefront and its admin panel side by side.
  4. **Hostly:** the robot schedule screen, with a fictional campaign playlist and a "now playing" track.
  5. **BookOwl:** the real screenshot `static/img/bookowl.png`, converted to AVIF/WebP. It carries a GitHub link.

  All mockups are real markup marked `aria-hidden`, and each frame carries a text description.

  - **How they are drawn:** inline SVG on one 1200 × 502 canvas, in the site's own type and tones, so they belong to the film instead of looking pasted in.
  - **The 4:3 phone crop** keeps 670 of the 1200 units. Wave and Campaign BI keep the left edge, where their titles are. Zibby and Hostly keep the middle, where the storefront meets its admin and where the robot screen sits.
  - **BookOwl on phones** is letterboxed on the black mat instead of cropped, so its welcome text stays whole.

- **Moves:** family C, a scrubbed timeline per project as it crosses the viewport, with no pin. The still pushes in (`scale 1.12 → 1`) while the cast lines rise one by one like credits. The logline uses family A (a one-shot rise, SplitText lines behind masks) when the project's top crosses 70%.
- **Behind the scenes:** the button opens a native modal `<dialog>` drawer from the right. It wipes in with `clip-path` over 220 ms through CSS `@starting-style`, so the drawer adds no JS.
  - Esc, the Close button and a click on the backdrop close it, and focus returns to the button.
  - The drawer is `data-lenis-prevent` and scrolls natively, while the page behind it stays still.
  - It always holds the same six parts, in this order:
  1. **The problem:** what was wrong or missing before.
  2. **My role:** what Gabriel owned.
  3. **Architecture:** a small diagram, an inline SVG of 3–6 boxes and arrows rendered from content data. It comes with the same information as a text list, for screen readers and Quick view.
  4. **Key decisions:** 2–3 technical decisions, each with its reason.
  5. **Testing and deploy:** how the project is tested and how it ships.
  6. **Outcome:** what changed after.

  Links follow, or the note "Internal system, no public link".

  - **In production, a part with no facts yet is left out with its heading**, and a decision whose reason is missing shows the decision alone. Nothing unfinished reaches the live site; `pnpm todos` lists every gap.
  - **The diagram** is laid out at build time from the content data: rows follow the data flow, services are solid, data stores carry a lid line, external services are dashed, devices are rounded, and arrow labels sit on their line. Every diagram is marked unconfirmed until Gabriel checks it against the real system.

- **Facts, from the brief and from Gabriel's phase 4 notes** (everything else is `TODO(gabriel)`):

  | Project      | Architecture                                                                                                                  | Decisions and other facts                                                                                                                                                                                |
  | ------------ | ----------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | Sistema Wave | Next.js/React web → NestJS API → PostgreSQL                                                                                   | All `TODO`                                                                                                                                                                                               |
  | Campaign BI  | RedTrack → n8n pipelines → PostgreSQL → dashboards                                                                            | Monthly, weekly and per-media-buyer views; n8n feeds PostgreSQL; a largest-remainder allocation script corrected inflated conversion and revenue metrics, reconciled against the reference spreadsheets  |
  | Zibby        | pnpm monorepo, modular monolith: storefront and admin (Next.js) → NestJS API → PostgreSQL via Prisma, plus Stripe and Zendrop | Own product, built in phases with AI coding agents (plan → review → implement → tests → diff review → merge); automated tests; hosted on a VPS; **launched in October 2026** (the server is off for now) |
  | Hostly       | Admin panel and robot app → backend on a VPS; the app reaches RobotOS (OrionStar LuckiBot Plus) through an abstraction layer  | The abstraction layer lets it move to AgentOS later; the admin panel schedules ad campaigns and music; designed to become a multi-company SaaS later                                                     |
  | BookOwl      | A Python/Django app; the database is `TODO`                                                                                   | Open source on GitHub, built for a real church library                                                                                                                                                   |

- **Internal systems** (Sistema Wave, Campaign BI, Hostly) show architecture only: no real names, numbers, screenshots or client data. Their stills stay stylized mockups with fictional data.
- **Reduced:** no push-in. The still crossfades in, the cast appears all at once, and the drawer opens with opacity only.
- **Quick view:** each project is a compact block with the title, logline, stack as a sentence and the six behind-the-scenes parts shown **inline**, with a small diagram. There are no stills and no cast panel, and the links appear once, on the project.
- **No-JS:** everything is visible. The behind-the-scenes content is in the HTML as a `<details>` element that opens in place. The same server-rendered parts fill the `<details>`, the drawer and the Quick view block.

## 6 · Chapter card "Act III / How I work" (intensity 2)

The same device, with its own cue mark.

## 7 · Act III · How I work (intensity 2)

- **Sees:**
  - A storyboard sheet: six panels in a 3 × 2 grid on desktop (2 × 3 on tablet, 1 column on mobile), as a real `<ol>` in workflow order.
  - Each panel holds a simple line drawing in SVG strokes and a handwritten-style caption in Newsreader italic:
    1. I plan
    2. I review the plan
    3. The AI implements
    4. I review the diff
    5. I run the tests
    6. Merge
  - Under the sheet is one line at scene size, in Newsreader italic like the hero line: "AI speeds things up. The judgment is mine."
  - **The drawings:** a checklist, the plan under a magnifying glass, a code window, a diff in two panes, three passing checks, and a branch with two commits merging into the main line.
- **Moves:** family B. A pencil stroke draws each panel's frame, then its drawing, in order, mapped linearly to scroll (`stroke-dashoffset`). There is no pin: the sheet draws while it scrolls past.
  - The pencil finishes by the time the sheet's last row is three quarters up the screen, so the closing line never arrives over an unfinished panel. This was found in the phase 5 review.
- **Reduced:** the drawings are complete and the panels fade in.
- **Quick view:** a six-item numbered list plus the closing line. There are no drawings.
- **No-JS:** the drawings are complete.

## 8 · End credits / Contact (intensity 3)

- **Sees:** a fade to black. As the section arrives, the ground crossfades from `--screen` to `--house`, using a scrubbed CSS variable over 40 vh. The text crossfades from ink to screen with it.
  - The mix is done in OKLab. In OKLCH, black's hue of 0 tinted the fade pink (found in phase 5).
  - The masking bars close back to 13.5 vh once the section's top reaches the top of the screen.
  - The section heading is **"Contact"**. The credits run centred in screen color:
  - Directed by Gabriel Santos · Written by Gabriel Santos · Shot by Gabriel Santos
  - Cast: the technical credits as five credit blocks (Frontend, Backend, Data, DevOps & automation, Architecture)
  - Languages: Portuguese (native), Spanish and English (studying)
  - Based in Salvador, Brazil, working remotely. Only the ES version adds the Santiago relocation line.

  Then the credits end on:
  - "Write to me" at title size, in screen color on a solid **velvet** plate (6.3:1; velvet text on black would be 2.8:1), linking to `mailto:`
  - the email address in plain text
  - LinkedIn, GitHub, YouTube and TikTok, as text links with `rel="noopener noreferrer"`
  - "Download CV", which points to `cv/CV_Gabriel_Santos_{PT|EN|ES}.pdf` per locale (`TODO(gabriel)`: the files)

- **Moves:** family B, but **not pinned**. The page scrolls natively, which already reads as a credits roll, and the credit blocks drift upward slightly faster than the scroll (`yPercent`, linear) for the feel of a roll. Nothing is held.
- **Reduced:** no drift. The black fade is kept (it is a color change).
- **Quick view:** a plain Contact block on the ground, with no fade to black and no credits styling. The crew credits (Directed, Written, Shot by) are left out. The cast stays as one line per area ("Frontend: Next.js, React, …"), because that is the full skill list a recruiter looks for. Then come the email, the links and the CV.
- **No-JS:** a static centred column on black.

## 9 · Post-credits (intensity 2, decided)

- **Sees:** about 60 vh of black, a deliberate rest and the only blank stretch on the page. Then one card: "Gabriel Santos will return in your next project." Below it is the action "Rewind the reel".
- **Moves:**
  - The card fades in (opacity, 600 ms).
  - Rewind runs `lenis.scrollTo(0, { duration: 1.6 })` with an ease-in-out, so the reel spins up and then settles. The timecode counts back to zero along with the scroll, and the bars close at the top.
  - Focus moves to the main content, so keyboard and screen reader users start again from the top too.
- **Reduced:** the card fades in, and Rewind jumps instantly.
- **Quick view:** hidden.
- **No-JS:** Rewind is an `#top` anchor.

## Quick view, the compact one-page summary (intensity 1)

- **What it is:** the same content from the same `content/` source, laid out as a single readable page, like a CV a recruiter can scan in a minute.
  - **Off:** all motion (no Lenis, no ScrollTrigger, no Motion transitions, no cold open), plus grain, vignette, masking, timecode, chapter cards, stills and post-credits.
  - **The layout, top to bottom:**
    1. **Hero:** name at scene size, role, stack, "Remote", Download CV and Contact
    2. **Experience:** the dated list
    3. **Projects:** compact blocks with behind-the-scenes inline
    4. **How I work:** the numbered list
    5. **Contact**
  - It uses one column at `62ch` on the ground.
- **How it works:**
  - The toggle writes `localStorage.viewMode` (`film` | `quick`).
  - The inline `<head>` script reads it and sets `html[data-view]` before first paint, so a returning Quick view reader never sees the film flash.
  - Sections use a Tailwind `quick:` variant on the same markup. The content is not duplicated in the DOM.
  - `useScrollScene` reads the mode. Switching to Quick view reverts every GSAP context and stops Lenis. Switching back recreates them and calls `ScrollTrigger.refresh()`.
- **Print:** `@media print` uses the Quick view layout, so printing the page gives a clean one-pager.

---

## Intensity map

| Scene        | Intensity    |
| ------------ | ------------ |
| Cold open    | 3            |
| **Hero**     | **5**        |
| Card I       | 2            |
| Experience   | 3            |
| Card II      | 2            |
| Projects     | 3            |
| Card III     | 2            |
| How I work   | 2            |
| Contact      | 3            |
| Post-credits | 2            |
| Quick view   | 1 throughout |
