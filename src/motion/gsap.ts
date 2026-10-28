// Loaded on demand through runtime.ts, never imported statically: GSAP stays out of the
// first-paint bundle. Plugins are registered once, here, in the browser.
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

export { gsap, ScrollTrigger, SplitText }
