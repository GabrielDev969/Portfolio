import { en } from './en'
import type { SiteContent } from './schema'

// Stub until phase 6: the Spanish translation replaces the English copy below.
// Relocation is Spanish-only and is already in place.
export const es: SiteContent = {
  ...en,
  locale: 'es',
  translation: 'stub',
  person: {
    ...en.person,
    relocation: 'Disponible para trasladarme a Santiago, Chile',
    availability: 'Disponible · Santiago, Chile',
  },
  contact: {
    ...en.contact,
    cv: {
      href: 'cv/CV_Gabriel_Santos_ES.pdf',
      label: en.contact.cv.label,
    },
  },
}
