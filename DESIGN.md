# Design

Gabriel Santos' portfolio: one bright page, in Portuguese, English and Spanish, that says who he is, what he builds and how to reach him, with the craft in the details. This page is the summary. The decisions themselves, with their reasons, live in [`design/`](design/):

- [`COMMIT-SHEET.md`](design/COMMIT-SHEET.md): concept, color, type, grid, motion budget, the words the copy does not use, and every banned device that survives with its reason
- [`STORYBOARD.md`](design/STORYBOARD.md): one sheet per section, with motion, reduced motion, Quick view and without JS
- [`PLAN.md`](design/PLAN.md): the phases, pinned versions, the JS budget and every measurement

## Rule zero

**It is a developer's portfolio. "Cinematic" meant production quality, not a film metaphor.** The first rebuild framed the page as a film (a cold open, masking bars, a timecode, acts, a film strip, end credits); on 2026-10-28 Gabriel kept its craft and dropped the metaphor. When an effect competes with finding a fact (who, what stack, where, how to reach him), the fact wins.

- **The 5-second test:** the first screen, at every width and without scrolling, shows the name, the role, the core stack, "Remote" and the Download CV and Contact buttons. A Playwright test checks five viewports, and the tightest two in Portuguese and Spanish.
- **Nothing is pinned and scroll is never hijacked:** Lenis only smooths the wheel, touch is native.
- **Quick view** turns the motion off: one readable column, the same content.

## The page

| Section    | What it shows                                                                                                                                                                                                                                                            |
| ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Top bar    | Name (the "GS" monogram on phones), Sections, Quick view and PT / EN / ES. Always visible, on the page's own ground                                                                                                                                                      |
| Hero       | Name, role, core stack, location and "Remote", Contact and Download CV, the line "From the database to the screen." and a "See projects" link. Only the name animates, once, on load                                                                                     |
| Experience | A clean dated timeline: five entries side by side on wide screens, a vertical list on phones. No pin, no sideways scroll                                                                                                                                                 |
| Projects   | Five projects: an image that bleeds off the left edge (a screenshot, or a mockup with fictional data for internal systems), the stack beside it, and **Technical details**, a drawer with six parts: problem, role, architecture, decisions, testing and deploy, outcome |
| How I work | Six steps, each with a small line drawing traced as it enters, then "AI speeds things up. The judgment is mine."                                                                                                                                                         |
| Contact    | Where he is based, availability, "Write to me" with the e-mail, profile links, Download CV, the stack by area and his languages, then a small "Back to top"                                                                                                              |

## System

- **Color:** a cool silver ground (`oklch(0.94 0.006 240)`), blue-black ink, one tone step for panels and frames, and one velvet red for the contact action only. The ground never goes dark. Every text pairing is AA or better, checked by a unit test.
- **Type:** Big Shoulders (a tall condensed grotesque) for display, Newsreader (a reading serif with optical sizes and real italics) for text. Three sizes do the visible work: title (the name), heading (section and project titles) and text. No mono face, no all-caps labels.
- **Grid:** a 12-column grid with one deliberate break, the project images bleeding off the left edge with the stack panel overlapping them by one column.
- **Motion:** three families, each fitted to what it reveals: **mask rise** (the name on load, section titles, project loglines), **draw** (the workflow drawings, traced once) and **push-in** (scrubbed depth on the projects, without pinning). No grain, no vignette, no section fades up.
- **Words:** no film vocabulary in any language (production, act, scene, cast, credits, reel, trailer, still, cinema…) and no portfolio clichés; a unit test fails on either.

## Every section in four versions

Each section is built for motion, reduced motion, Quick view and no JavaScript:

- **Reduced motion:** the same layout, with opacity in place of movement.
- **Quick view:** set by a head script before first paint, so it never flashes the motion; it reverts every scene and stops Lenis, and looks the same before hydration as after.
- **No JS:** all content is server-rendered and readable; technical details open in a native `<details>`.
- **Print:** paper always gets Quick view.

## Languages

Portuguese (pt-BR), English and Spanish, prerendered at `/Portfolio/{pt,en,es}/`. The root picks the language (the saved choice, then the browser's) and keeps the hash. Titles fit their longest word in every language, the mockups are drawn in the page's language, and the Santiago relocation line exists only in Spanish.

## Budgets

|                                              | Budget                 | Now                     |
| -------------------------------------------- | ---------------------- | ----------------------- |
| Initial JS (gzip)                            | 180 KB                 | 176.9 KB                |
| LCP, throttled phone (`pnpm measure:vitals`) | 2.5 s                  | 0.62 s in every locale  |
| CLS                                          | 0.1                    | 0.002 or less           |
| Lighthouse mobile, CPU calibrated            | Perf ≥ 90, others ≥ 95 | 98–99 / 100 / 100 / 100 |
| Lighthouse desktop                           | Perf ≥ 90, others ≥ 95 | 100 / 100 / 100 / 100   |

On GitHub's shared runners the same build scores lower on mobile Performance, so CI raises that score as a warning instead of failing; mobile LCP, CLS and the other categories still fail it ([`lighthouse/README.md`](lighthouse/README.md)). Lighthouse's simulated mobile run (what PageSpeed Insights shows) scores 86–89 and is reported alongside.

## Honest content

Nothing about Gabriel is invented. A fact he has not given yet is a `todo()` in `src/content/`: a marked placeholder in development, left out of the published site with its label, and listed by `pnpm todos` and in the README. The internal systems (Sistema Wave, Campaign BI, Hostly) show their architecture and fictional mockups only, never real screens, names or numbers.
