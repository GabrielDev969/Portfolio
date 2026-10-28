import { FilmGrain } from '../cinema/FilmGrain'

type Props = { production: string; skip: string }

/**
 * The cold open (design/STORYBOARD.md §0): black, a projector beam warming up in two steps,
 * the production card, then a hard cut at 1.3 s. It exists only while <html data-intro> is set
 * by the head script, and CSS performs the cut, so it never outlasts the 1.5 s cap.
 * "Skip intro" is the first focusable element on the page.
 */
export function ColdOpen({ production, skip }: Props) {
  return (
    <div className="cold-open overflow-hidden bg-house text-screen">
      <div aria-hidden="true" className="cold-open-beam" />
      <FilmGrain />
      <p
        aria-hidden="true"
        className="cold-open-card absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-body tracking-[0.12em] [font-variant-caps:all-small-caps]"
      >
        {production}
      </p>
      <button
        type="button"
        data-skip-intro
        className="absolute right-(--page-margin) bottom-[calc(var(--bar-open)+16px)] inline-flex min-h-11 items-center border border-current px-4 text-small"
      >
        {skip}
      </button>
    </div>
  )
}
