'use client'

/**
 * "Build it again": the page goes back to empty and the swarm builds it once more, without a
 * reload (src/swarm/Swarm.tsx listens). Only with JS, in the full view, with motion allowed.
 */
export function ReplayButton({ label }: { label: string }) {
  return (
    <button
      type="button"
      onClick={() => dispatchEvent(new Event('swarm:replay'))}
      className="replay hidden motion-reduce:hidden quick:hidden js:inline-flex"
    >
      {label}
    </button>
  )
}
