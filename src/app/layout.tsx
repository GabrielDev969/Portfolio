import type { ReactNode } from 'react'
import './globals.css'

// Each locale renders its own <html lang>, so the root layout only passes children through.
export default function RootLayout({ children }: { children: ReactNode }) {
  return children
}
