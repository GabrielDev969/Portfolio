import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'dark' | 'outline'

const variants: Record<Variant, string> = {
  // The primary action is outlined in accent, the page's one accent (design/COMMIT-SHEET.md §2).
  // Paper drops backgrounds, so printed buttons are outlined in ink.
  primary: 'border border-accent text-accent hover:bg-accent/10 print:border-ink print:text-ink',
  dark: 'border border-line bg-screen-2 text-ink hover:border-ink/40 print:border-ink',
  outline: 'border border-current text-ink',
}

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant: Variant
  children: ReactNode
}

/** One size and shape for every button, so primary actions read as equals. */
export function Button({ variant, children, className = '', ...props }: Props) {
  return (
    <a
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-6 font-mono text-[0.8125rem] font-medium tracking-[0.06em] uppercase transition-colors duration-150 ease-(--ease-out) focus-visible:outline-cyan ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
