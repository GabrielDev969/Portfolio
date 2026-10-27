/**
 * The reel-change dot that flashes before each chapter card (design/STORYBOARD.md §2).
 * Hidden until its scroll trigger arrives in phase 3; the second and last use of velvet.
 */
export function CueMark() {
  return (
    <div
      aria-hidden="true"
      data-cue-mark
      className="pointer-events-none fixed top-[calc(var(--bar-open)+24px)] right-(--page-margin) z-40 size-7 rounded-full bg-velvet opacity-0 quick:hidden"
    />
  )
}
