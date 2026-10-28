import { isTodo, type Prose, type Text } from '@/content/schema'

export const showTodos = process.env.NODE_ENV !== 'production'

/** The string to render, a marked placeholder in development, or null when a fact is missing in production. */
export function resolveText(value: Text): string | null {
  if (!isTodo(value)) return value
  return showTodos ? `TODO(gabriel): ${value.todo}` : null
}

/** The sentences of a paragraph that can render; empty when every one is missing in production. */
export function resolveProse(value: Prose): string[] {
  return (Array.isArray(value) ? value : [value])
    .map(resolveText)
    .filter((s): s is string => s !== null)
}
