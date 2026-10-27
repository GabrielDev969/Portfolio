const pad = (n: number) => String(n).padStart(2, '0')

/** Scroll progress (0–1) to an HH:MM:SS:FF timecode over a fixed runtime. */
export function formatTimecode(progress: number, fps: number, runtimeSeconds: number) {
  const clamped = Math.min(Math.max(progress, 0), 1)
  // The epsilon absorbs float error, e.g. 25/4320 × 4320 = 24.999…
  const frame = Math.floor(clamped * runtimeSeconds * fps + 1e-9)
  const seconds = Math.floor(frame / fps)
  return `${pad(Math.floor(seconds / 3600))}:${pad(Math.floor(seconds / 60) % 60)}:${pad(seconds % 60)}:${pad(frame % fps)}`
}
