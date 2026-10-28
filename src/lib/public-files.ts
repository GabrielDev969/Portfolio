import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { showTodos } from './text'

/**
 * Whether a link to a file in public/ can be shown: always in development, where missing facts
 * show as placeholders; in the production build only if the file is there, so the published
 * site never links to a 404. Server components only (it reads the disk at build time).
 */
export function canLinkTo(path: string) {
  return showTodos || existsSync(join(process.cwd(), 'public', path))
}
