# Commit-sheet — "Gabriel Santos, a film in three acts"

Decided on paper before any markup. Any banned device that survives into the build is argued here; if it is not argued here, it is a bug.

## Rule zero

**It is a developer's portfolio first. The film is the frame, never an obstacle.** When a cinema device competes with finding a fact (who, what stack, where, how to reach him), the fact wins and the device is cut back.

## Brief

- **Who must remember it:** a recruiter or tech lead hiring a remote full-stack developer (Brazil, US/EU remote, and Chile via the ES version), who opens ten portfolios in an afternoon.
- **What they must do after:** write to Gabriel, or download the CV in their language.
- **5-second test:** the first screen, without scrolling and at every width, shows:
  - the name
  - the role
  - the core stack
  - "Remote"
  - two primary buttons, **Download CV** and **Contact**

  A Playwright test enforces it.

## The concept in one line

The page is the lit screen inside a dark auditorium. The darkness lives where a cinema is actually dark (the masking bars, the cold open, the end credits). Everything you read is projected light.

---

## 1. Peak

**The screen opens:** on the first scroll, the black masking bars part and the name grows upward into the space the top bar gave up, while the timecode starts running.

- **The hero block never moves and is never covered.** That block is the role, stack, "Remote", both buttons and the scroll cue. The name scales `1 → 1.06` from its bottom-left corner, so it only grows into the space freed above it.
- On a first visit the peak follows the cold open's hard cut. Without the cold open (repeat visit, deep link, reduced motion) the bars still part. In Quick view there is no peak, because there is no motion.
- Every other scene is held at intensity 2–3.

## 2. Color

Commitment tier: **restrained.** Three colors plus true black for the masking.

| Token | OKLCH | Role |
|---|---|---|
| `--screen` (ground) | `oklch(0.94 0.006 240)` | The projected screen: a cool silver-white, not cream |
| `--screen-2` (tone step) | `oklch(0.895 0.008 240)` | Panels, the behind-the-scenes drawer, mockup chrome. A tone step instead of shadows |
| `--ink` | `oklch(0.22 0.025 255)` | All running text and display type, in full ink. Silver-halide blue-black |
| `--ink-2` | `oklch(0.42 0.02 255)` | Metadata only (years, credit roles). 7.1:1 on ground |
| `--velvet` (accent) | `oklch(0.47 0.17 22)` | Cinema-curtain red |
| `--house` | `oklch(0 0 0)` | Masking bars, cold open, end credits |

- **Background target lightness: 0.94.** It drops to 0 only in the cold open and the end credits.
- **Accent budget:**
  1. The contact action: "Contact" in the hero and "Write to me" in the credits are the same action.
  2. The **cue mark**, the reel-change dot that flashes in the top-right corner before each chapter card.

  Nothing else is red. **Download CV**, the other primary button, is solid ink with screen-colored text. Both buttons share one size and shape, so they read as equals and differ only in hue.
- **Contrast** (computed from the OKLCH values):
  - ink on screen 14.5:1
  - ink on screen-2 12.7:1
  - ink-2 on screen 7.1:1
  - screen on velvet 6.3:1
  - screen on house 17.6:1

  The hex equivalents are screen `#e8ecef`, screen-2 `#d8dde1`, ink `#131b26`, ink-2 `#464e58` and velvet `#a51d2b`.
- **Velvet never sets text on black.** Velvet on house is only 2.8:1, so in the credits "Write to me" is screen-colored text on a solid velvet plate (6.3:1). The phase 1 token script fails the build if a pairing drops below AA.
- **Why it is not the category reflex:** a "cinematic" portfolio reflexively goes black and gold. This one is bright because a screen is bright. True black (not a tinted `#0B0B0B`) is argued: masking in a real cinema is unlit black velvet.

## 3. Type

| Role | Family | Why |
|---|---|---|
| Display | **Big Shoulders** (variable `wght` 100–900 and `opsz`; latin + latin-ext for ã, ç, ñ) | A tall condensed grotesque with the vertical, billing-block stance of a film poster, without the Bebas/Anton/Oswald reflex. Condensed width means "Gabriel Santos" can be huge and still sit in two lines at 390 px |
| Text | **Newsreader** (variable `wght` and `opsz`, real italics) | A reading serif with optical sizes. Its small sizes stay sturdy for credits and HUD text, and its italic does the work an eyebrow label would otherwise do ("Act I") |

- **Contrast axis:** condensed grotesque against a humanist serif, which contrasts width, structure and stress at once.
- **Why not Inter:** Inter is the default on everything, and a poster title sequence needs a voice, not a UI face. Not Space Grotesk, Instrument Serif or Playfair, for the same reason.
- **No mono face.** The timecode is set in Big Shoulders with `tabular-nums`. If the font lacks `tnum` (checked in phase 1), each digit sits in a fixed-width `ch` slot. This removes the "mono service label" tell instead of arguing for it.
- **Scale:** three sizes do the visible work.
  - **Title:** `min(19vw, 20vh, 13rem)`, Big Shoulders 800, tracking −0.03em, leading 0.86. Used for the hero and chapter-card titles.
    - It is capped by height as well as width so the 5-second test passes on short laptop screens (1366 × 768, 1280 × 720) with the bars closed.
  - **Scene:** `clamp(2.75rem, 6vw, 5rem)`, Big Shoulders 700, tracking −0.02em, leading 0.95. Used for project titles, milestone years and Quick view headings.
  - **Text:** `1.1875rem` (19 px) Newsreader 400, leading 1.55, measure `62ch`.
  - **HUD/credits small:** `0.875rem` (14 px) Newsreader 500. This is the fourth size, and the ceiling.
- **No all-caps labels.** The one exception is the cold open's "A GABRIEL SANTOS PRODUCTION", set in Newsreader `all-small-caps`: it is a period convention of production cards, and it appears once for under a second.

## 4. Grid break

**Act II project stills bleed off the left edge of the viewport** (from the page edge to the end of column 8). The cast block, the stack set as credits on a `--screen-2` panel, **overlaps the still's right edge by exactly one column** (columns 8–11).

- Nothing sits on a headline. The overlap is on the image, and the title stays on the ground in columns 9–12.
- Everything else sits on a strict 12-column grid with equal outer margins.
- Quick view drops the bleed: everything sits inside the column grid.

## 5. Motion budget (three scroll families)

| Family | What it is | Easing / distance / direction | Members |
|---|---|---|---|
| **A · Mask rise** | One-shot reveal when an element enters | `expo.out`, 1.1 s, lines rise `yPercent 110 → 0` behind a mask, stagger 60 ms; vertical, upward | Hero name, chapter-card headings, project loglines. The masking bars parting (`scaleY`, same ease, 1.2 s, outward) belongs here too |
| **B · Reel** | Linear 1:1 scroll mapping, nothing eased | `ease: none`, scrub 0.6 | Act I film strip (horizontal, **the page's only pin**), Act III pencil stroke (`stroke-dashoffset`), end-credits drift, timecode |
| **C · Push-in** | Scrubbed depth as a project crosses the viewport, **without pinning** | `power2.out` inside a scrubbed timeline, scale `1.12 → 1` on the still while the cast block rises `yPercent 100 → 0`, stagger 50 ms | Act II projects only |

- **Scroll is never hijacked.**
  - Lenis only smooths the wheel (`lerp 0.12`). Touch stays native (`syncTouch: false`).
  - Keyboard, find-in-page, anchors and the scrollbar behave natively. There is no snapping and no velocity tricks.
  - Total pinned scroll on the page is **≤ 1 viewport height** (Act I only), and a test enforces it.
- **Not scroll-driven:**
  - Motion handles the chapter menu, the language switcher, the Quick view toggle and the behind-the-scenes drawer (`clip-path` and opacity, 220 ms ease-out).
  - Grain is stepped at 10 fps in CSS.
- **No fade-up on any section.** A chapter card's heading rises, a milestone frame slides in on the reel, a project pushes in and a storyboard panel is drawn: each reveal fits what it reveals.
- **Quick view** turns every family off. So does reduced motion, apart from opacity and color.

## 6. Reflex check

- **(a) A generic AI dev portfolio:**
  - a blue-to-purple hero and "Hi, I'm Gabriel 👋" in Inter
  - a grid of identical project cards and a grid of tech logos
  - a dark-mode toggle

  This is roughly the current site.
- **(b) An AI avoiding (a):**
  - a near-black "terminal" page with mono labels, an amber accent and film grain
  - for a *cinema* brief, black and gold with Playfair italic and Art-Deco "premiere" chrome
- **(c) This page:**
  - a **bright silver screen** framed by true-black masking
  - ink-dark poster type with a reading serif, and one velvet red that behaves like a cue mark
  - darkness used only where a cinema is dark
  - the cinema devices (masking, timecode, cue marks, chapter cards, credits) do interface work: the HUD lives *inside* the masking bars, the cue mark announces the next section, and the credits are the contact section
  - and one button (Quick view) turns the film off for anyone who just wants the facts

## 7. Tells broken

| Habit not repeated | Replaced by |
|---|---|
| Near-black background by default | Ground at L 0.94. Black only as masking, cold open and credits |
| Amber / acid-green accent | Velvet red, used on the contact action and the cue mark only |
| Mono "service" labels and a mono timecode | No mono family. Tabular figures in the display face; labels in Newsreader italic, sentence case |
| Meta strings joined with middle dots ("Salvador · Remote · …") | Real credit blocks: the role on the left, the names on the right, one per line, set the way film credits are set. The hero stack is a plain comma-separated sentence |
| `WORD — fragment` chapter labels ("ACT I — ORIGIN") | Two lines with no dash and no tracked caps: "Act I" in Newsreader italic, then the plain section name at title size. **Approved:** Act I / Experience · Act II / Projects · Act III / How I work; the end credits are Contact |

---

## Hero line (decided)

**"From the database to the screen."** The role line under it carries the layers ("Full Stack Developer" plus the core stack).

## Post-credits scene (decided)

- After the credits, a deliberate rest of about 60 vh of black, then a single card: **"Gabriel Santos will return in your next project."**
- Under it is one quiet action, **"Rewind the reel"**. It scrolls back to the top in 1.6 s while the timecode visibly counts backward to `00:00:00:00`, and the masking bars close again.
- Reduced motion: the card fades in, and Rewind jumps instantly. Quick view hides the post-credits scene.
- No jokes or blooper cards.

## Banned devices that survive, with reasons

- **Numbered sequence markers in Act I and Act III:** both are real sequences (a dated timeline and a six-step workflow), so they are real `<ol>`s. Storyboard panels are numbered on real storyboards.
- **One small-caps line** (the cold open card), argued under Type.
- None of the other banned devices survive.
