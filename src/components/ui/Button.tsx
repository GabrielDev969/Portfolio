import type { AnchorHTMLAttributes, ReactNode } from 'react'

type Variant = 'velvet' | 'ink' | 'outline'

const variants: Record<Variant, string> = {
  // The contact action, and nothing else, is velvet (design/COMMIT-SHEET.md §2).
  velvet: 'bg-velvet text-screen',
  ink: 'bg-ink text-screen',
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
      className={`inline-flex min-h-12 items-center justify-center rounded-[2px] px-6 text-body font-semibold transition-opacity duration-(--dur-ui) ease-(--ease-out) hover:opacity-85 focus-visible:outline-ink ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </a>
  )
}
