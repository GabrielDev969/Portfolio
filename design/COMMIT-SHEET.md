# Commit-sheet — Gabriel Santos, Full Stack Developer

Decided on paper before any markup. Any banned device that survives into the build is argued here; if it is not argued here, it is a bug.

**Rewritten 2026-11-05** for Gabriel's new direction: the page goes **dark**, sits on **one page with no clicking**, and is **built live by a swarm of simulated AI agents** as the visitor scrolls. The reference is a portfolio video Gabriel liked. It has:

- a dark ground;
- multiplayer cursors, each with its own color and role name;
- outline boxes with size badges;
- text streaming in as if typed;
- a fixed status dock;
- cursors that gather and spin out at the end.

We take its feel, not its copy. This sheet replaces the light "bright, well-set technical page" of 2026-10-28, and the two task drafts before this one ("parallel build scene" and "built live as you scroll").

It ships in three PRs, in order:

1. `feat/inline-summaries`: one page, no clicking (§4).
2. `feat/dark-theme`: tokens, mono face, re-toned mockups (§2, §3).
3. `feat/agent-swarm`: the swarm (§5, §6).

Where a value is still to be measured (OKLCH, contrast ratios, timings), the PR that sets it fills it in here. The decisions themselves do not change.

## Rule zero

**It is a developer's portfolio. "Cinematic" meant production quality, never a film metaphor** (Gabriel, 2026-10-28: "Sou desenvolvedor, não diretor"). No cold open, masking bars, timecode, acts, film strip, credits or reel.

**The swarm is not a metaphor either.** It shows how this page was really built, with real numbers. Agents do the work and Gabriel reviews every diff: the same plan → implement → test → review loop that "How I work" describes. The reader does not have to decode anything to read the page. Every fact sits in plain HTML under the swarm, and the swarm only ever reveals it.

When any effect competes with finding a fact (who, what stack, where, how to reach him), the fact wins and the effect is cut back.

## Non-negotiables

- **The content is real HTML from the first byte.** The swarm is a simulation layered on top. It reveals content and never withholds it: screen readers, search engines and visitors without JS get the full page.
- **Nothing on screen is invented.** Every number the swarm or the dock shows comes from the real repo or the real build. A script writes `src/content/build-facts.json` at build time with:
  - the JS gzip size;
  - the test counts per spec;
  - the section component file names;
  - the contrast ratios from the palette;
  - the commit hash and date;
  - the deploy target.

  If a number cannot be read from the repo, the swarm does not show one.

- **No hype copy, no fake metrics.** The honest tone of the current copy holds in all three languages.
- **No third-party logos or product names in the swarm.** The agents have role names (Planner, Layout, Tests…), not brand names. The deploy target reads "GitHub Pages" because it is where the site really ships.

## Brief

- **Who must remember it:** a recruiter or tech lead hiring a remote full-stack developer (Brazil, US/EU remote, and Chile via the ES version), who opens ten portfolios in an afternoon.
- **What they must do after:** write to Gabriel, or download the CV in their language.
- **5-second test:** the first screen, without scrolling and at every width, shows:
  - the name
  - the role
  - the core stack
  - "Remote"
  - two primary buttons, **Download CV** and **Contact**

  All of them must be readable within 1 s, and **never covered by the swarm**: no cursor, box or badge sits over them during boot. A Playwright test enforces it, in every locale. The build leaves Download CV out if its PDF is missing from `public/cv/`, so the page never links to a 404; the tests then fail.

## The concept in one line

A dark page that a swarm of agents builds as you scroll, while the real content is there from the first byte and Gabriel signs off each section.

---

## 1. Peak

There are two moments of intensity 4, at the two ends of the page. Everything between them is held at 2–3.

- **Boot (≤ 800 ms, once per session):** the cursors burst out of the logo in the top bar. The dock reads "Booting swarm…", then "Active N / Total 16".
  - There is no black screen and no intro to skip.
  - The hero text is in place at first paint and never covered.
  - The hero name still rises behind its mask (CSS, at first paint), as before.
- **End, at Contact:** the cursors gather into a vortex and spin out, and the dock reads "Ready · deployed". The section stays readable: the vortex turns in empty ground beside the text, never over it.

## 2. Color

Commitment tier: **restrained ground, one accent, and a set of agent colors confined to the swarm.** PR 2 fills in the values and the measured contrast; a unit test fails the build if any pairing drops below its floor.

| Token                   | Role                                                                                          |
| ----------------------- | --------------------------------------------------------------------------------------------- |
| `--screen` (ground)     | A near-black ground, slightly cool, not pure black                                            |
| `--screen-2` (one step) | Panels, image frames, the dock. A tone step, no shadows                                       |
| `--ink`                 | All running text and display type. Light, not pure white                                      |
| `--ink-2`               | Metadata only (years, places, labels). Muted, still ≥ 4.5:1 on both grounds                   |
| `--velvet` (accent)     | The contact action only, re-tuned for the dark ground                                         |
| `--agent-1…16`          | One per agent: cursor, label pill, outline box. Never on content, never on the contact action |

- **Contrast floors:**
  - ink and ink-2 on both grounds ≥ 4.5:1 (ink well above);
  - each agent color ≥ 3:1 against the ground, so cursors and outlines read;
  - label text on each colored pill ≥ 4.5:1;
  - the 16 agent colors distinguishable from each other: a minimum OKLCH distance between any two, checked in the same test.
- **Accent budget: one use.** The contact action is still the only accent on the page. The agent colors live only in the swarm layer, which is `aria-hidden` and gone in Quick view, in print and with reduced motion.
- **Print goes light.** Paper gets Quick view on a white ground with dark ink, as before.
- **Why dark now:** Gabriel's call (2026-11-05). Also, sixteen colored cursors and outline boxes only read as a crowd at work on a dark ground. On the old silver-white ground, half the palette would wash out below 3:1. §6 says what keeps it from the dark-portfolio reflex.

## 3. Type

| Role    | Family                                                                                                | Why                                                                                                                                        |
| ------- | ----------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| Display | **Big Shoulders** (variable `wght` 100–900 and `opsz`; the latin subset, which already holds ã, ç, ñ) | Kept. A tall condensed grotesque, without the Bebas/Anton/Oswald reflex; "Gabriel Santos" can be huge and still sit in two lines at 390 px |
| Text    | **Newsreader** (variable `wght` and `opsz`, real italics)                                             | Kept. A reading serif with optical sizes; its italic still does the work of labels                                                         |
| Swarm   | **One mono face**, self-hosted subset, `font-display: optional` (chosen in PR 2)                      | Only for the swarm UI: cursor labels, size badges, the dock, logs. It is the voice of the tools, so it never sets content                  |

- **No strong reason to change the display and text faces**, so they stay. The contrast axis is unchanged: a condensed grotesque against a humanist serif.
- **The mono face never sets content.** Names, headings, copy, the stack, buttons and links stay in Big Shoulders and Newsreader. With `font-display: optional`, a slow network gets a system mono for the swarm and no layout shift.
- **Scale:** the same three sizes do the visible work (title, heading, text), plus small for metadata. The swarm UI uses one mono size, the small size or below.

## 4. One page, no clicking

**Everything a reader needs is on the page without a click.** The "Technical details" drawer is gone. Each project shows inline:

1. **Problem:** one sentence.
2. **What I built:** one or two sentences, with Gabriel's role and the project's single most important decision, with its reason.
3. **Architecture:** the existing diagram, small and inline, with its text list for screen readers.
4. **Result:** one sentence, with a number when there is one.
5. **Stack.**

- **At most 70 words of prose per project per language** (problem + built + result), using only facts that were already in the content. A unit test counts them.
- **The rest is deleted** (Gabriel, 2026-11-05): the other key decisions, testing and deploy. They remain in git history.
- The only controls left are navigation (Sections, language, Quick view) and, in PR 3, "Skip build". None of them holds content back.

## 5. Grid break

**Project images bleed off the left edge of the viewport** (from the page edge to the end of column 8). The stack panel, on `--screen-2`, **overlaps the image's bottom-right corner by exactly one column** (columns 8–10).

- Nothing sits on a headline. The overlap is on the image, and the title and summary stay on the ground in columns 9–12.
- The architecture diagram sits under the image (columns 1–7), and the result and links sit under the summary (columns 9–12).
- Everything else sits on a strict 12-column grid with equal outer margins. Quick view drops the bleed.

## 6. Motion: the build

**One swarm, sixteen roles.** The agents are fifteen plus Gabriel. Each has a color, a role label and a job:

- **Planner** writes the task list at boot.
- **Architect** draws the section boxes with size badges.
- **Layout** drags cards into their slots.
- **Typography** sets headings.
- **Copy** streams paragraphs in.
- **Data** fills years and stack lists.
- **Diagram** draws each architecture diagram.
- **Mockup** paints the project images in.
- **i18n** ticks the three languages.
- **A11y** shows the real contrast ratio.
- **Perf** shows the real JS size.
- **Tests** shows the real test count for that section.
- **Security** checks the external links.
- **Motion** does a tuning pass.
- **Deploy** ships to GitHub Pages at the end.
- **Gabriel** approves each section's diff.

- **Agents come and go.** An agent flies in when its section nears the viewport, works, and leaves when its part is done. About 4–8 are active at once; phones run about 6.
- **Per section (≈ 1–1.5 s, triggered once, never scrubbed, so reading is never blocked):**
  1. outline boxes with size badges (real sizes, from `getBoundingClientRect`);
  2. text streams in;
  3. cards are dragged the last 16–24 px into place;
  4. the diagram is drawn;
  5. a selection highlight passes over the heading;
  6. a click ripple lands on the buttons;
  7. Gabriel's cursor approves the section with a check.
- **The dock** (fixed at the bottom, compact, mono) shows:
  - the swarm status;
  - Active / Total;
  - build progress (follows scroll, 100% at Contact);
  - the JS size;
  - the commit hash;
  - "GitHub Pages".

  **"Skip build"** finishes everything at once.

- **Engine:**
  - one overlay layer (SVG or canvas) moved by transforms;
  - cursors lerp toward DOM targets, with no React state per frame;
  - it pauses when the tab is hidden;
  - no new dependencies, and the JS budget stays at 180 KB gzip.
- **Nothing is pinned and scroll is never hijacked.** Lenis only smooths the wheel; touch, keyboard, find-in-page, anchors and the scrollbar behave natively.
- **CLS stays 0.** Overlays sit on boxes that already have their final size; streaming text reveals text that is already laid out.
- **Reduced motion, no JS, Quick view and print** get the finished page with no cursors. The swarm UI is `aria-hidden`, and the dock exposes nothing a screen reader needs.
- **What it replaces:** the three families of the light build (mask rise, draw, push-in) give way to the build beats above. The hero name keeps its CSS rise at first paint.

## 7. Reflex check

- **(a) A generic AI dev portfolio:**
  - a blue-to-purple hero and "Hi, I'm Gabriel 👋" in Inter
  - a grid of identical project cards and a grid of tech logos
  - a dark-mode toggle
- **(b) An AI avoiding (a):** a near-black "terminal" page with mono labels everywhere, an amber or acid-green accent and film grain. Or a concept site that turns the portfolio into a metaphor (a film, a magazine, an OS) the reader has to decode first. The first rebuild did the latter, and the 2026-10-28 sheet was written against both.
- **(c) This page:**
  - **Dark, but not that.** Gabriel chose a dark ground on 2026-11-05.
    - The ground is near-black without a prompt, a blinking caret or a scanline.
    - The accent is one red-family hue on the contact action only, never amber or green.
    - There is no grain.
    - Mono is confined to the swarm's own UI. The content is set in a condensed display face and a reading serif.
  - **The swarm is the honest part.** Every badge, ratio, size, count and hash is read from the repo at build time, so the page shows how it was made instead of claiming it.
  - **Craft in the details:** type sized to its longest word in every language, content complete in the HTML, budgets enforced in CI, and Quick view for anyone who just wants the facts.

## 8. Tells broken

| Habit not repeated                                             | Replaced by                                                                                                          |
| -------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| Amber / acid-green accent                                      | One accent, on the contact action only                                                                               |
| Mono "service" labels on content                               | Mono only in the swarm UI. Content labels in Newsreader italic, sentence case                                        |
| Fake terminal or fake metrics                                  | Real numbers from `build-facts.json`; no number that cannot be traced to the repo                                    |
| Meta strings joined with middle dots ("Salvador · Remote · …") | Plain sentences. The full stack in the contact section is a definition list: the area on the left, one name per line |
| Eyebrow labels over section titles ("01 — ABOUT")              | The section title alone, in plain words: Experience, Projects, How I work, Contact                                   |
| A grid of tech logos                                           | The stack as text, and no third-party logos or product names in the swarm                                            |
| Content behind a click ("Read more", drawers, modals)          | Every fact inline (§4)                                                                                               |

## 9. Words the copy does not use

The film vocabulary is banned from the copy in all three languages, so the metaphor cannot creep back. `tests/unit/content.test.ts` fails on any of these, as whole words, in any field of `src/content/` or in the mockup copy. PR 3 extends the check to the swarm's labels and logs.

| EN                                                                               | PT                                                                             | ES                                                                                              |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------- |
| production, act, scene, cast, credits, reel, trailer, still, cinema, film, movie | produção, ato, cena, elenco, créditos, rolo, trailer, fotograma, cinema, filme | producción, acto, escena, reparto, créditos, carrete, rollo, tráiler, fotograma, cine, película |

The same test also bans the generic portfolio tells: seamless, revolutionize, elevate, unleash, cutting-edge, passionate about technology, and their PT and ES equivalents.

---

## Hero line (decided)

**"From the database to the screen."** The role line under it carries the layers ("Full Stack Developer" plus the core stack). Below the buttons, a quiet **"See projects"** link jumps to Projects.

## End of the page (decided)

The contact section is a normal section with:

- its title;
- where Gabriel is based (and, in Spanish only, the relocation line);
- availability;
- **"Write to me"** as the one accent button, with the e-mail beside it;
- the profile links and Download CV;
- the stack by area and the languages he speaks.

Under it sits a small **"Back to top"** link. The swarm's vortex and "Ready · deployed" close the build, not the page: no fade to black, no closing card.

## Banned devices that survive, with reasons

- **Numbered sequence markers in How I work:** a six-step workflow is a real sequence, so it is a real `<ol>`. The timeline is a dated `<ol>`; its years do the numbering.
- **Interface mockups with fictional data** (the images of Sistema Wave, Campaign BI, Zibby and Hostly). The anti-generic list bans fake dashboards, but these are not decoration.
  - Three are internal systems whose real screens and numbers cannot be shown, and Zibby's catalogue is not public.
  - Each is a specific screen of that project: a request board, a performance chart by media buyer, a storefront with its order list, a robot's schedule. Each is drawn in the site's own type and tones and labeled as fictional in its text description. None uses gradients, glow or placeholder bars.
  - The words inside the mockups follow the page's language (Gabriel's call): Sistema Wave and Hostly are Brazilian systems, so a Portuguese reader sees them as they would be used.
  - The words live in `components/mockups/copy.ts`, beside the drawings, not in `content/`, because they are fictional.
  - Widths that depend on a word (the chips, the store menu) are computed from it, and decimals use the locale's separator. `tests/e2e/mockups.spec.ts` checks in every locale that each label fits its box and keeps a word space from its neighbours.
  - PR 2 re-tones them for the dark ground.
- **A near-black ground** (banned as the dark-portfolio reflex in the 2026-10-28 sheet). It survives because Gabriel chose it, and because the colored swarm needs it to read. §7(c) lists what keeps it from the reflex.
- **A mono face** (banned on the old sheet). It survives only as the swarm UI's voice: cursor labels, size badges, the dock and logs. Content never uses it.
- **Multiplayer cursors, outline boxes and size badges.** They are a simulation, so they could read as decoration. They survive because:
  - each shows a real size, ratio, count or hash;
  - they are `aria-hidden`;
  - they never cover the 5-second facts;
  - they are gone in Quick view, in print, with reduced motion and without JS.
- None of the other banned devices survive.
