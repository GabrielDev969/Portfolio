# Lighthouse

`pnpm lighthouse` builds nothing; run `pnpm build` first. It audits `/Portfolio/en/`, `/pt/` and `/es/`
from `pnpm preview` (gzip, served like GitHub Pages) three ways:

| Config                  | Throttling                                                             | Gate                    |
| ----------------------- | ---------------------------------------------------------------------- | ----------------------- |
| `mobile.json`           | Slow 4G and a 4× CPU slowdown, **applied** to the browser (`devtools`) | fails below the targets |
| `desktop.json`          | Lighthouse's desktop preset                                            | fails below the targets |
| `mobile-simulated.json` | the same phone, **simulated** (Lantern, what PageSpeed Insights shows) | reported, never fails   |

Targets: Performance ≥ 90; Accessibility, Best Practices and SEO ≥ 95; LCP ≤ 2.5 s; CLS ≤ 0.1.
TBT above 200 ms is a warning.

**The phone's CPU is calibrated to the machine.** A fixed 4× slowdown emulates a fast phone on a
fast laptop and a slow one on a CI runner: the same build scored 98 on an M-series Mac
(benchmarkIndex about 4000) and 78 on GitHub's runner. So `pnpm lighthouse` first reads the
machine's benchmarkIndex and uses `benchmarkIndex / 500` as the slowdown for both phone configs:
the mid-tier phone (Moto G4) of Lighthouse's [throttling table](https://github.com/GoogleChrome/lighthouse/blob/main/docs/throttling.md),
4× from a 2000 desktop and 2× from a 1000 one. The value is printed with the results.

Why the mobile gate uses applied throttling: Lantern counts every request that starts before the
observed LCP as part of it, so the three preloaded fonts (about 340 KB, see `src/app/fonts.ts`)
are charged to the hero line, although it paints at once in the fallback font and swaps later.
The applied run measures what a throttled phone shows, like `pnpm measure:vitals`. The simulated
numbers stay in every run summary, so the gap is visible, not hidden.

Reports are written to `.lighthouseci/<config>/` (HTML and JSON per run).
