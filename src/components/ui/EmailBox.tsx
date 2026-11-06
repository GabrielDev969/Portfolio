'use client'
import { useState } from 'react'

type Props = { email: string; copy: string; copied: string }

/**
 * The e-mail address in a box, with a Copy button (Clipboard API). The address itself stays a
 * mailto: link, which is all there is without JavaScript: the button only shows when JS runs.
 * The confirmation is announced politely.
 */
export function EmailBox({ email, copy, copied }: Props) {
  const [done, setDone] = useState(false)

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setDone(true)
      setTimeout(() => setDone(false), 2000)
    } catch {
      // No clipboard (permissions, an old browser): the mailto: link is still there.
    }
  }

  return (
    <div className="email-box">
      <a href={`mailto:${email}`} className="email-address">
        {email}
      </a>
      <button type="button" onClick={onCopy} className="email-copy hidden js:inline-flex">
        <span aria-live="polite">{done ? copied : copy}</span>
      </button>
    </div>
  )
}
