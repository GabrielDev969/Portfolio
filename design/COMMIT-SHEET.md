# Commit-sheet — Gabriel Santos, Full Stack Developer

Decided on paper before any markup. Any banned device that survives into the build is argued here; if it is not argued here, it is a bug.

**Rewritten 2026-11-05** for Gabriel's new direction: the page goes **dark**, sits on **one page with no clicking**, and is **built live by a swarm of simulated AI agents** as the visitor scrolls. The reference is a portfolio video Gabriel liked. It has:

- a dark ground;
- multiplayer cursors, each with its own color and role name;
- outline boxes with size badges;
- text streaming in as if typed;
- a fixed status dock;
- cursors that gather and spin out at the end.

**Revised 2026-11-06 (Gabriel):** the page **opens empty and the swarm builds it in front of the visitor, scrolling down by itself**: the visitor does not scroll to make it happen. This overrides three rules of 2026-11-05, as he asked:

- content visible from the first paint;
- facts readable within 1 s;
- no scroll driven by the page.

The rest of this sheet is written for the empty-page build; §6, "The page that builds itself", says how the overridden rules are kept as close as the idea allows.

We take its feel, not its copy. This sheet replaces the light "bright, well-set technical page" of 2026-10-28, and the two task drafts before this one ("parallel build scene" and "built live as you scroll").

It ships in three PRs, in order:

1. `feat/inline-summaries`: one page, no clicking (§4).
2. `feat/dark-theme`: tokens, mono face, re-toned mockups (§2, §3).
3. `feat/agent-swarm`: the swarm (§5, §6).

Where a value is still to be measured (OKLCH, contrast ratios, timings), the PR that sets it fills it in here. The decisions themselves do not change.

**Redesigned 2026-11-06 (Gabriel: "the reference reel's design is the target").**

- The look is now the reference's: a dark, technical engineering console, precise, dense and high-contrast. There is no neon glow, no gradient and no glassmorphism.
- It brings a dotted grid, hairline cards with corner brackets, mono tags and status pills, a heavy wide grotesque, and one accent: an electric blue, by Gabriel's choice the same day.
- We take the reference's feel, never its text or its claims.
- §2, §3, §5, §7, §8 and the devices that survive are rewritten for it. The swarm (§6) builds this layout.

## Rule zero

**It is a developer's portfolio. "Cinematic" meant production quality, never a film metaphor** (Gabriel, 2026-10-28: "Sou desenvolvedor, não diretor"). No cold open, masking bars, timecode, acts, film strip, credits or reel.

**The swarm is not a metaphor either.** It shows how this page was really built, with real numbers. Agents do the work and Gabriel reviews every diff: the same plan → implement → test → review loop that "How I work" describes. The reader does not have to decode anything to read the page. Every fact sits in plain HTML under the swarm, and the swarm only ever reveals it.

When any effect competes with finding a fact (who, what stack, where, how to reach him), the fact wins and the effect is cut back.

## Non-negotiables

- **The content is real HTML from the first byte.**
  - The empty page is visual only (opacity), so screen readers, search engines and visitors without JS get the full page.
  - Reduced motion, Quick view, print, a deep link and a second visit this session also get the full page.
  - The visitor's first scroll, click or key hands the whole page over at once.
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

  The swarm builds the hero first, and all of them are readable **within 3 s** of opening the page (Gabriel's empty-page build, 2026-11-06; it was 1 s before). A Playwright test enforces it, in every locale. The build leaves Download CV out if its PDF is missing from `public/cv/`, so the page never links to a 404; the tests then fail.

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

Commitment tier: **one surface tone, one accent, cyan for focus only, and the agents' colors confined to the swarm.** `tests/unit/contrast.test.ts` reads every value from `globals.css` and fails the build if a pairing drops below its floor.

| Token                  | OKLCH                                 | Hex       | Role                                                              |
| ---------------------- | ------------------------------------- | --------- | ----------------------------------------------------------------- |
| `--screen` (ground)    | `oklch(0.145 0 0)`                    | `#0a0a0a` | The page, under a dotted grid (white at 6%, 24 px pitch)          |
| `--screen-2` (surface) | `oklch(0.182 0 0)`                    | `#121212` | Every card and panel                                              |
| `--line`               | white at 12%                          |           | The 1 px hairline on every card and panel; it brightens on hover  |
| `--ink`                | `oklch(0.961 0.003 106.4)`            | `#f2f2f0` | Running text and display type                                     |
| `--ink-2`              | `oklch(0.611 0.022 260.2)`            | `#7c8491` | Muted text, tags, labels                                          |
| `--accent`             | `oklch(0.627 0.2 266.1)`              | `#4f7dff` | "Hi, I'm", the section badges, the primary button's outline, Copy |
| `--cyan`               | `oklch(0.797 0.134 211.5)`            | `#22d3ee` | Focus outlines and selection only                                 |
| `--agent-1…16`         | two lightness steps, hues 22.5° apart |           | The swarm only                                                    |

- **Contrast** (computed from the OKLCH values):
  - ink on the ground 17.7:1, on a card 16.7:1;
  - ink-2 5.3:1 and 5.0:1;
  - the accent as text 5.4:1 and 5.1:1;
  - dark text on the accent (the badges, Copy) 5.4:1;
  - cyan against the ground 11:1;
  - every agent at least 0.08 from the accent in OKLab.
- **The reference's values were moved where they failed:**
  - its slate `#6B7280` gives 4.1:1 on the ground and 3.9:1 on a card, so it became `#7c8491`;
  - the first accent, a crimson, gave 4.4:1 on a card.
- **Blue, not red** (Gabriel, 2026-11-06). His photo in the hero is a black-and-blue duotone made at build time from the original, so it stays sharp.
- **Print goes light:** black on white, the accent a darker blue.

## 3. Type

Three families, each the latin subset only, self-hosted by `next/font`.

| Role    | Family                                             | Why                                                                                                                                                                                                                          |
| ------- | -------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Display | **Archivo** variable, 800–900 at 112–118% width    | A heavy, wide grotesque: the dense "GABRIEL SANTOS." of the reference. Big Shoulders is condensed and reads as signage, not as a console, so it went (Gabriel approved, 2026-11-06). Not Inter or Space Grotesk, the reflex. |
| Serif   | **Newsreader**                                     | The accent line ("Hi, I'm") in italic, the callouts, the giant outlined backdrop word (`-webkit-text-stroke`, no fill, white at 7%), and the body text at 17–19 px with lines of at most 68ch                                |
| Mono    | **Spline Sans Mono** 500, `font-display: optional` | Tags, badges, key/value data, the nav, stat labels, chips, pipeline nodes, the dock. Soft, open shapes rather than the JetBrains/Fira reflex                                                                                 |

- **Mono is for labels and data, never for running text.** Names, headings, paragraphs and descriptions stay in the display face and the serif; an e2e test checks it.
- **The mockups keep their condensed titles:** inside them the display face runs at Archivo's narrowest width (62%), the width they were drawn for.

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

## 5. Layout: the console

- **Every block is a card:**
  - the surface tone, a 1 px hairline and a 4 px radius;
  - feature cards (the hero photo, the first project) carry small corner brackets;
  - hover brightens the hairline over 150 ms.
- **The hero** has three columns from 1024 px over the outlined `PORTFOLIO`:
  - the introduction;
  - the photo card;
  - three small cards.
- **The projects:**
  - a feature card that spans the row and sets its body in two columns;
  - the other four two to a row;
  - each with its image as a header.
- **The architecture** is a pipeline of mono chips with arrows, one step per layer of the data flow. Parallel nodes share a step, so a system that branches is never drawn as a line, and the full list of connections is there for screen readers.
- **Quick view** is one column, with no photo, no images and no card chrome.

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

- **The page that builds itself (Gabriel, 2026-11-06):**
  - **It opens empty.** The head script marks the page `data-build` before the first paint, and every element starts at opacity 0. Only the top bar's own ground and the dock show.
  - **The swarm builds it piece by piece**, from the top bar to Back to top, in about 40 s on a desktop. Each piece arrives its own way:
    - headings swept in and selected;
    - text typed a word at a time;
    - images and cards dragged in;
    - diagrams and drawings traced;
    - lists lit up item by item;
    - buttons clicked.
  - **The page scrolls down by itself** to follow the work. Lenis stands aside while it does.
  - **Gabriel approves each section** as the next one starts, and at the end the cursors spin out and the dock reads "Ready · deployed".
  - **About 4–8 agents work at once** (6 on phones). An agent with nothing to do for a moment leaves.
  - **The reader can always take over.** The first wheel, touch, click or key ends the build: everything is there at once and the page is theirs. So does Skip build.
  - **Every visitor still gets the page:**
    - reduced motion, Quick view, print, a deep link (`#contact`) and a second visit this session all show the finished page from the first paint;
    - if the swarm has not started 5 s after the head script, the page shows itself.
- **CLS stays 0.**
  - The build changes only opacity, overlays and transforms, so the page is laid out once, at its final size.
  - Even a label flipping sides moves by transform. Tested through the whole build at 1440 and 390 px.
- **Reduced motion, no JS, Quick view and print** get the finished page with no cursors. The swarm UI is `aria-hidden`, and the dock exposes nothing a screen reader needs.
- **What it replaces (as built in PR 3):**
  - **Mask rise is gone** from the section titles and from "What I built": it hid words for a second, which the swarm may never do. The Typography agent's selection takes its place. The hero name keeps its CSS rise at first paint, since it is the page's one entrance and never covers a fact.
  - **Draw stays** on the six workflow drawings, traced as each step arrives, and the Diagram agent visits them. The architecture diagrams are traced by the Diagram agent over a copy of each stroke, so the diagram itself stays whole.
  - **Push-in stays** on the project images only (scale, scrubbed). The Mockup agent paints across each image as it arrives. The stack lines no longer rise.
  - **Reduced motion** has nothing left to fade: the page is simply finished.
- **The boot, as built:**
  - The cursors come out from under the logo and drop into the hero along a free column: straight down, or down the right-hand gutter and across. They park only where no word, button or link is, and show their label only once they are there.
  - Where a phone's hero leaves no free ground, a cursor bursts out along the top bar and away.
  - Gabriel approves the hero from a free spot, and the crew goes back up the way it came. An e2e test samples every frame of the first three seconds at four widths and fails if any mark touches the hero's text.
- **The dock, as built:**
  - It holds the status, Active N / Total 16, build progress, the JS size, the commit hash, "GitHub Pages", the last agent's line, and Skip build.
  - It has a fixed size, and every slot a fixed width in `ch`, so a changing number never moves it (CLS stays 0, tested).
  - On phones it keeps two lines (status and progress, then the count); the JS size, commit and host stay on wider screens.
- **The numbers, as built:**
  - `scripts/build-facts.ts` runs after `next build`. It writes `src/content/build-facts.json` and `out/build-facts.json`, which the page fetches after first paint. It holds:
    - the commit;
    - the deploy target;
    - the first-paint JS per locale, measured in `out/`;
    - unit tests per file, by running them;
    - e2e tests per spec, by listing them;
    - each section's component, read from the page;
    - the contrast of each pairing, from the palette.
  - Sizes, word counts, item counts, link checks and font sizes are measured on the page itself.
  - Without the file (`pnpm dev`), no agent shows a number.

## 7. Reflex check

- **(a) A generic AI dev portfolio:**
  - a blue-to-purple hero and "Hi, I'm Gabriel 👋" in Inter;
  - a grid of identical project cards and a grid of tech logos.
- **(b) An AI avoiding (a):** a near-black terminal page with neon, glow, scanlines and a blinking prompt, or a concept site the reader has to decode.
- **(c) This page:**
  - **The console, done straight:** near-black with a faint grid, hairlines instead of shadows, one blue and nothing else, no glow, no gradient, no glass.
  - **"Hi, I'm" survives, without the reflex:** a serif italic line in the accent over a heavy grotesque name, no emoji, no Inter (Gabriel's reference asks for it).
  - **The cards are not identical:** the feature card leads with its metrics, and every card carries its own status, its own architecture as a pipeline, and real text.
  - **The stack is text chips, never logos.**
  - **Every number is real:** the counters and tiles repeat numbers the content states, which a unit test checks, and the swarm reads its numbers from the build.

## 8. Tells broken

| Habit not repeated                   | Replaced by                                                                       |
| ------------------------------------ | --------------------------------------------------------------------------------- |
| Neon accent, glow, gradients, glass  | One electric blue on hairlines, flat surfaces                                     |
| Fake metrics and invented counters   | Three counters and two tiles, each a number the content already states (tested)   |
| A grid of tech logos                 | The stack as mono text chips                                                      |
| Filter tabs, "View project", drawers | Every project's facts inline; nothing to click                                    |
| A diagram as decoration              | The architecture from the content, as a pipeline whose steps follow the data flow |
| Content in a terminal font           | Mono for labels and data only; prose in the serif                                 |

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

- **Section tags and badges** (`[01] // EXPERIENCE ── [01/04]`), once banned as "eyebrow labels". They survive because the reference's look is built on them, and they carry real information: the section's place in the page. The tag repeats the title, so it is hidden from assistive technology and the h2 says it once.
- **"Hi, I'm"**, once listed as the generic reflex. It survives as a serif italic line in the accent, without emoji. See §7.
- **Mono labels and status pills** (`[•] IN USE`, `[•] INTERNAL`, `[•] LAUNCHED OCT 2026`). They survive because the status is a real fact of each project, written in the content in all three languages.
- **Counters.** They survive because each number repeats one the content already states (about 5 years, more than 500 campaigns a day, about 100 people); a unit test fails on any other.
- **Numbered sequence markers in How I work:** a six-step workflow is a real sequence, so it is a real `<ol>`, numbered `01`–`06` in mono.
- **Interface mockups with fictional data** (Sistema Wave, Campaign BI, Zibby, Hostly):
  - three are internal systems whose screens and numbers cannot be shown, and Zibby's catalogue is not public;
  - each is a specific screen of its project, drawn in the site's own type and tones, and labeled as fictional in its text description;
  - the words inside follow the page's language, and `tests/e2e/mockups.spec.ts` checks in every locale that each label fits its box.
- **A near-black ground and a mono face:** the reference's look, and the swarm needs the dark to read.
- **Multiplayer cursors, outline boxes and size badges:** a simulation that shows real sizes, ratios, counts and hashes. It is aria-hidden, and gone in Quick view, in print, with reduced motion and without JS.
- None of the other banned devices survive.
