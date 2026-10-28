# Design

Gabriel Santos' portfolio is a short film you watch by scrolling: a cold open, a title sequence, three acts and the end credits. This page is the summary. The decisions themselves, with their reasons, live in [`design/`](design/):

- [`COMMIT-SHEET.md`](design/COMMIT-SHEET.md): concept, color, type, grid, motion budget, and every banned device that survives with its reason
- [`STORYBOARD.md`](design/STORYBOARD.md): one sheet per section, in film, reduced motion, Quick view and without JS
- [`PLAN.md`](design/PLAN.md): the phases, pinned versions, the JS budget and every measurement

## Rule zero

**It is a developer's portfolio first. The film is the frame, never an obstacle.** When a cinema device competes with finding a fact (who, what stack, where, how to reach him), the fact wins.

- **The 5-second test:** the first screen, at every width and without scrolling, shows the name, the role, the core stack, "Remote" and the Contact button (Download CV joins it once the PDFs are in `public/cv/`). A Playwright test checks five viewports before, during and after the peak.
- **Scroll is never hijacked:** Lenis only smooths the wheel, touch is native, and the page's only pin (Act I) costs at most one screen height.
- **Quick view** turns the film off: one readable column, every motion off, the same content.

## The concept

The page is the lit screen inside a dark auditorium. Darkness is used only where a cinema is dark: the masking bars, the cold open and the end credits. Everything you read is projected light.

| Scene                 | What it does                                                                                                                                                                                                      |
| --------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Cold open             | Black, a lamp, "A Gabriel Santos production", a hard cut at 1.5 s. First visit only; Skip and Esc end it, and it never plays on a deep link, with reduced motion or in Quick view                                 |
| Title sequence        | The peak: on the first scroll the masking bars part and the name grows upward into the space they gave up. The facts and buttons never move                                                                       |
| Act I · Experience    | The timeline as a 35 mm film strip, pinned and scrolled sideways on wide screens, a vertical strip elsewhere                                                                                                      |
| Act II · Projects     | Five projects, each a still that bleeds off the left edge with its stack set as a cast list. Behind the scenes opens a drawer with six parts: problem, role, architecture, decisions, testing and deploy, outcome |
| Act III · How I work  | A storyboard sheet: six panels pencilled in as you scroll, then "AI speeds things up. The judgment is mine."                                                                                                      |
| End credits · Contact | The screen fades to black, the bars close, and the credits run: crew, cast (the stack by area), languages, then "Write to me"                                                                                     |
| Post-credits          | "Gabriel Santos will return in your next project." and Rewind, which scrolls back while the timecode counts down                                                                                                  |

The cinema devices do interface work: the HUD (sections, Quick view, language, timecode) lives inside the masking bars so it never covers content, the velvet cue mark announces each chapter, and the credits are the contact section.

## System

- **Color:** a cool silver screen (`oklch(0.94 0.006 240)`), blue-black ink, one velvet red for the contact action and the cue mark, and true black for masking. Every text pairing is AA or better, checked by a unit test.
- **Type:** Big Shoulders (a tall condensed poster grotesque) for display, Newsreader (a reading serif with optical sizes and real italics) for text. Three sizes do the visible work: title, scene and text. No mono face: the timecode is set in the display face, digit by digit.
- **Grid:** a 12-column grid with one deliberate break, the Act II stills bleeding off the left edge with the cast panel overlapping them by one column.
- **Motion:** three scroll families, each fitted to what it reveals: **mask rise** (one-shot reveals), **reel** (linear 1:1 scroll: the film strip, the pencil, the credits, the timecode) and **push-in** (scrubbed depth on the projects, without pinning). No section fades up.

## Every section in four versions

Each section is built for film mode, reduced motion, Quick view and no JavaScript, in the phase that introduced it:

- **Reduced motion:** the same layout, with opacity and color in place of movement.
- **Quick view:** set by a head script before first paint, so it never flashes the film; it reverts every scene and stops Lenis, and looks the same before hydration as after.
- **No JS:** all content is server-rendered and readable; behind the scenes opens in a native `<details>`.
- **Print:** paper always gets Quick view, even when printed mid-film.

## Languages

Portuguese (pt-BR), English and Spanish, prerendered at `/Portfolio/{pt,en,es}/`. The root picks the language (the saved choice, then the browser's) and keeps the hash. Titles fit their longest word in every language, the mockups are drawn in the page's language, and the Santiago relocation line exists only in Spanish.

## Budgets

|                                              | Budget                 | Now                         |
| -------------------------------------------- | ---------------------- | --------------------------- |
| Initial JS (gzip)                            | 180 KB                 | 178.9 KB                    |
| LCP, throttled phone (`pnpm measure:vitals`) | 2.5 s                  | 0.65–0.66 s in every locale |
| CLS                                          | 0.1                    | 0.002 or less               |
| Lighthouse mobile, CPU calibrated            | Perf ≥ 90, others ≥ 95 | 98 / 100 / 100 / 100        |
| Lighthouse desktop                           | Perf ≥ 90, others ≥ 95 | 99 / 100 / 100 / 100        |

Lighthouse's simulated mobile run (what PageSpeed Insights shows) scores 84–85 with an estimated LCP of 4.3 s: its model charges the three preloaded fonts to the hero line, which actually paints at once in the fallback font. It is reported in every CI run, next to the gated numbers ([`lighthouse/README.md`](lighthouse/README.md)).

## Honest content

Nothing about Gabriel is invented. A fact he has not given yet is a `todo()` in `src/content/`: a marked placeholder in development, left out of the published site with its label, and listed by `pnpm todos` and in the README. The internal systems (Sistema Wave, Campaign BI, Hostly) show their architecture and fictional stills only, never real screens, names or numbers.
