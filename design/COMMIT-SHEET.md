# Commit-sheet — Gabriel Santos, Full Stack Developer

Decided on paper before any markup. Any banned device that survives into the build is argued here; if it is not argued here, it is a bug.

## Rule zero

**It is a developer's portfolio. "Cinematic" meant production quality, never a film metaphor** (Gabriel, 2026-10-28: "Sou desenvolvedor, não diretor"). No cold open, masking bars, timecode, acts, film strip, credits or reel. What stays from the first build is its craft: the palette, the type, the grid, the motion quality, the performance budgets, the tests, Quick view, the three languages and the CV.

When any effect competes with finding a fact (who, what stack, where, how to reach him), the fact wins and the effect is cut back.

## Brief

- **Who must remember it:** a recruiter or tech lead hiring a remote full-stack developer (Brazil, US/EU remote, and Chile via the ES version), who opens ten portfolios in an afternoon.
- **What they must do after:** write to Gabriel, or download the CV in their language.
- **5-second test:** the first screen, without scrolling and at every width, shows:
  - the name
  - the role
  - the core stack
  - "Remote"
  - two primary buttons, **Download CV** and **Contact**

  A Playwright test enforces it, in every locale. The build leaves Download CV out if its PDF is missing from `public/cv/`, so the page never links to a 404; the tests then fail.

## The concept in one line

A bright, well-set technical page: poster-scale type for the name and the section titles, a reading serif for everything else, and motion that only ever reveals what is already there.

---

## 1. Peak

**The hero enters:** on load, the name rises line by line from behind a mask (family A, once). That is the page's only moment of intensity 4; every other reveal is held at 2–3.

- **The facts and buttons never move and are never covered.** Role, stack, "Remote", both buttons and "See projects" are in place at first paint; only the name animates, and it never changes size.
- There is no intro screen, no scroll-triggered peak and nothing to skip. With reduced motion or in Quick view, the name is simply there.

## 2. Color

Commitment tier: **restrained.** Three colors plus one tone step.

| Token                    | OKLCH                    | Role                                                                        |
| ------------------------ | ------------------------ | --------------------------------------------------------------------------- |
| `--screen` (ground)      | `oklch(0.94 0.006 240)`  | The page: a cool silver-white, not cream                                    |
| `--screen-2` (tone step) | `oklch(0.895 0.008 240)` | Panels, the technical-details drawer, image frames. A tone step, no shadows |
| `--ink`                  | `oklch(0.22 0.025 255)`  | All running text and display type, in full ink. Blue-black                  |
| `--ink-2`                | `oklch(0.42 0.02 255)`   | Metadata only (years, places, stack areas). 7.1:1 on ground                 |
| `--velvet` (accent)      | `oklch(0.47 0.17 22)`    | A deep red, for the contact action only                                     |

- **The ground never goes dark.** The black of the first build (`--house`) lived only in the masking bars, the cold open, the end credits and the frames around stills; all of those are gone, so the token is removed.
- **Accent budget: one use.** The contact action ("Contact" in the hero, "Write to me" in the contact section) is the only red on the page. **Download CV**, the other primary button, is solid ink with ground-colored text. Both buttons share one size and shape, so they read as equals and differ only in hue.
- **Contrast** (computed from the OKLCH values):
  - ink on screen 14.5:1
  - ink on screen-2 12.7:1
  - ink-2 on screen 7.1:1
  - screen on velvet 6.3:1

  The hex equivalents are screen `#e8ecef`, screen-2 `#d8dde1`, ink `#131b26`, ink-2 `#464e58` and velvet `#a51d2b`. A unit test fails the build if a pairing drops below AA.

- **Why it is not the category reflex:** a developer portfolio reflexively goes dark with a neon accent, or white with a blue-to-purple gradient. This one is a cool light ground with ink type and one red that means "get in touch".

## 3. Type

| Role    | Family                                                                                                | Why                                                                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display | **Big Shoulders** (variable `wght` 100–900 and `opsz`; the latin subset, which already holds ã, ç, ñ) | A tall condensed grotesque, without the Bebas/Anton/Oswald reflex. Condensed width means "Gabriel Santos" can be huge and still sit in two lines at 390 px |
| Text    | **Newsreader** (variable `wght` and `opsz`, real italics)                                             | A reading serif with optical sizes. Its small sizes stay sturdy for metadata, and its italic does the work an eyebrow label would otherwise do             |

- **Contrast axis:** condensed grotesque against a humanist serif, which contrasts width, structure and stress at once.
- **Why not Inter:** Inter is the default on everything, and the name needs a voice, not a UI face. Not Space Grotesk, Instrument Serif or Playfair, for the same reason.
- **No mono face**, and no all-caps labels.
- **Scale:** three sizes do the visible work.
  - **Title:** `min(30vw, 22svh, 13rem)`, Big Shoulders 800 in capitals, tracking −0.03em, leading 0.86. Used for the name in the hero only. 117 px on a 390 px phone, 198 px at 1440 × 900; capped by height as well as width so the 5-second test passes on short laptop screens (1366 × 768, 1280 × 720).
  - **Heading:** `clamp(2.75rem, 6vw, 5rem)`, Big Shoulders 700, tracking −0.02em, leading 0.95. Used for section titles (Experience, Projects, How I work, Contact), project titles and timeline years. A section title is sized by its longest word, so "Experiencia" or "Experiência" never spills past a 360 px screen (a test guards it).
  - **Text:** `1.1875rem` (19 px) Newsreader 400, leading 1.55, measure `62ch`.
  - **Small:** `0.875rem` (14 px) Newsreader 500, for metadata and the top bar. This is the fourth size, and the ceiling.

## 4. Grid break

**Project images bleed off the left edge of the viewport** (from the page edge to the end of column 8). The stack panel, on `--screen-2`, **overlaps the image's bottom-right corner by exactly one column** (columns 8–10).

- Nothing sits on a headline. The overlap is on the image, and the title stays on the ground in columns 9–12.
- Images sit in a plain `--screen-2` frame with a hairline in ink at 15%: no black mat, no film ratio. The frame keeps the 1200 × 502 canvas the mockups are drawn on (4:3 crop on phones), so no mockup is redrawn.
- Everything else sits on a strict 12-column grid with equal outer margins. Quick view drops the bleed.

## 5. Motion budget (three families)

| Family            | What it is                                                        | Easing / distance / direction                                                                                                       | Members                                               |
| ----------------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------- |
| **A · Mask rise** | One-shot reveal when an element enters                            | `expo.out`, 1.1 s, lines rise `yPercent 110 → 0` behind a mask, stagger 60 ms; vertical, upward                                     | Hero name (on load), section titles, project loglines |
| **B · Draw**      | A line drawing traced once as it enters                           | `power2.out`, 0.9 s per drawing, `stroke-dashoffset 1 → 0`, its strokes in order                                                    | The six workflow drawings in How I work               |
| **C · Push-in**   | Scrubbed depth as a project crosses the viewport, without pinning | `power2.out` inside a scrubbed timeline, scale `1.12 → 1` on the image while the stack list rises `yPercent 100 → 0`, stagger 50 ms | Projects only                                         |

- **Nothing is pinned and scroll is never hijacked.**
  - Lenis only smooths the wheel (`lerp 0.12`). Touch stays native (`syncTouch: false`).
  - Keyboard, find-in-page, anchors and the scrollbar behave natively. There is no snapping and no velocity tricks.
  - The experience timeline does not scroll sideways: five entries fit the width, so a pin would only add scroll for nothing.
- **Not scroll-driven:**
  - Motion handles the sections menu, the language switcher and the Quick view toggle (`clip-path` and opacity, 220 ms ease-out).
  - The technical-details drawer uses the same wipe with CSS `@starting-style` on a native `<dialog>`, so it costs no JS.
- **No texture.** The animated grain and the vignette are removed: both read as film.
- **No fade-up on any section.** A title rises, a drawing is traced and a project pushes in: each reveal fits what it reveals. Timeline entries are simply there.
- **Quick view** turns every family off. So does reduced motion, apart from opacity.

## 6. Reflex check

- **(a) A generic AI dev portfolio:**
  - a blue-to-purple hero and "Hi, I'm Gabriel 👋" in Inter
  - a grid of identical project cards and a grid of tech logos
  - a dark-mode toggle

  This is roughly the site before the rebuild.

- **(b) An AI avoiding (a):**
  - a near-black "terminal" page with mono labels, an amber accent and film grain
  - or a concept site that turns the portfolio into a metaphor (a film, a magazine, an OS) the reader has to decode first. The first rebuild did this; it is the reason for this sheet.
- **(c) This page:**
  - a bright cool ground, ink-dark display type with a reading serif, and one red that means contact
  - plain section titles, real content in each section (dated timeline, five projects with their architecture, the workflow, contact)
  - craft in the details: type sized to its longest word in every language, motion that only reveals, mockups drawn in the page's own type, budgets enforced in CI
  - and one button (Quick view) that turns the motion off for anyone who just wants the facts

## 7. Tells broken

| Habit not repeated                                             | Replaced by                                                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Near-black background by default                               | Ground at L 0.94, everywhere                                                                                         |
| Amber / acid-green accent                                      | Velvet red, on the contact action only                                                                               |
| Mono "service" labels                                          | No mono family. Labels in Newsreader italic, sentence case                                                           |
| Meta strings joined with middle dots ("Salvador · Remote · …") | Plain sentences. The full stack in the contact section is a definition list: the area on the left, one name per line |
| Eyebrow labels over section titles ("01 — ABOUT")              | The section title alone, in plain words: Experience, Projects, How I work, Contact                                   |
| A grid of tech logos                                           | The stack as text: per project in its stack panel, and by area in the contact section                                |

## 8. Words the copy does not use

The film vocabulary is banned from the copy in all three languages, so the metaphor cannot creep back. `tests/unit/content.test.ts` fails on any of these, as whole words, in any field of `src/content/` or in the mockup copy:

| EN                                                                               | PT                                                                             | ES                                                                                              |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| production, act, scene, cast, credits, reel, trailer, still, cinema, film, movie | produção, ato, cena, elenco, créditos, rolo, trailer, fotograma, cinema, filme | producción, acto, escena, reparto, créditos, carrete, rollo, tráiler, fotograma, cine, película |

The same test also bans the generic portfolio tells: seamless, revolutionize, elevate, unleash, cutting-edge, passionate about technology, and their PT and ES equivalents.

---

## Hero line (decided)

**"From the database to the screen."** The role line under it carries the layers ("Full Stack Developer" plus the core stack). Below the buttons, a quiet **"See projects"** link jumps to Projects.

## End of the page (decided)

The contact section is a normal section: its title, where Gabriel is based (and, in Spanish only, the relocation line), availability, **"Write to me"** as the one red button with the e-mail beside it, the profile links, Download CV, the stack by area and the languages he speaks. Under it, a small **"Back to top"** link. No fade to black, no closing card.

## Banned devices that survive, with reasons

- **Numbered sequence markers in How I work:** a six-step workflow is a real sequence, so it is a real `<ol>`. The timeline is a dated `<ol>`; its years do the numbering.
- **Interface mockups with fictional data** (the images of Sistema Wave, Campaign BI, Zibby and Hostly). The anti-generic list bans fake dashboards, but these are not decoration. Three are internal systems whose real screens and numbers cannot be shown, and Zibby's catalogue is not public. Each is a specific screen of that project (a request board, a performance chart by media buyer, a storefront with its order list, a robot's schedule), drawn in the site's own type and tones and labeled as fictional in its text description. None uses gradients, glow or placeholder bars.
  The words inside the mockups follow the page's language (Gabriel's call): Sistema Wave and Hostly are Brazilian systems, so a Portuguese reader sees them as they would be used. The words live in `components/mockups/copy.ts`, beside the drawings, not in `content/`, because they are fictional. Widths that depend on a word (the chips, the store menu) are computed from it, decimals use the locale's separator, and `tests/e2e/mockups.spec.ts` checks in every locale that each label fits its box and keeps a word space from its neighbours.
- None of the other banned devices survive.
