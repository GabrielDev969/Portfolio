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
