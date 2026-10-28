'use client'
import { useEffect, useState } from 'react'
// Type-only: erased at build, so it does not pull GSAP into the first-paint bundle.
import type * as Gsap from './gsap'

export type MotionRuntime = typeof Gsap

let loaded: MotionRuntime | null = null
let loading: Promise<MotionRuntime> | null = null

/** GSAP with ScrollTrigger and SplitText, fetched after first paint and shared by every scene. */
export function loadMotion(): Promise<MotionRuntime> {
  loading ??= import('./gsap').then((runtime) => (loaded = runtime))
  return loading
}

/** The runtime if it has already arrived; for event handlers that should not wait for it. */
export function peekMotion(): MotionRuntime | null {
  return loaded
}

let refreshQueued = false

/**
 * Scenes mount in no particular order, and ScrollTrigger measures triggers in the order they
 * were created: a trigger created before the Act I pin, but placed after it on the page, would
 * miss the pin's length (the HUD named each later section about 850 px early). Once the
 * frame's last scene has mounted, put every trigger in page order and measure them again.
 * Once no scene is waiting to mount, html[data-motion="ready"] says every scene is in place
 * (tests wait for it).
 */
export function refreshSoon() {
  if (refreshQueued) return
  refreshQueued = true
  requestAnimationFrame(() => {
    refreshQueued = false
    if (!loaded) return
    loaded.ScrollTrigger.sort()
    loaded.ScrollTrigger.refresh()
    if (scenes.length === 0) document.documentElement.dataset.motion = 'ready'
  })
}

type SceneJob = { mount: () => void; cancelled: boolean }
const scenes: SceneJob[] = []

/**
 * Scenes mount one per task, in the order they asked, instead of all inside the React commit
 * that delivers the runtime: on a mid-range phone (Lighthouse, CPU calibrated to a Moto G4)
 * that commit was one 400 ms task, most of the page's Total Blocking Time. When the last one
 * has mounted, the triggers are sorted and measured once. Returns a cancel function.
 */
export function mountSoon(mount: () => void) {
  const job: SceneJob = { mount, cancelled: false }
  if (scenes.length === 0) setTimeout(mountNext, 0)
  scenes.push(job)
  delete document.documentElement.dataset.motion
  return () => {
    job.cancelled = true
  }
}

function mountNext() {
  const job = scenes.shift()
  if (job && !job.cancelled) job.mount()
  if (scenes.length > 0) setTimeout(mountNext, 0)
  else refreshSoon()
}

/** Null on the first render (so it never runs during hydration), the runtime once it is fetched. */
export function useMotion(): MotionRuntime | null {
  const [runtime, setRuntime] = useState<MotionRuntime | null>(loaded)
  useEffect(() => {
    if (runtime) return
    let alive = true
    void loadMotion().then((r) => alive && setRuntime(r))
    return () => {
      alive = false
    }
  }, [runtime])
  return runtime
}
