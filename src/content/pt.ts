import { en } from './en'
import type { SiteContent } from './schema'

// Stub until phase 6: the Portuguese translation replaces the English copy below.
export const pt: SiteContent = {
  ...en,
  locale: 'pt',
  translation: 'stub',
  contact: {
    ...en.contact,
    cv: {
      href: 'cv/CV_Gabriel_Santos_PT.pdf',
      label: en.contact.cv.label,
    },
  },
}
