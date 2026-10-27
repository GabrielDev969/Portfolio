import { isTodo, type Text } from '@/content/schema'

export const showTodos = process.env.NODE_ENV !== 'production'

/** The string to render, a marked placeholder in development, or null when a fact is missing in production. */
export function resolveText(value: Text): string | null {
  if (!isTodo(value)) return value
  return showTodos ? `TODO(gabriel): ${value.todo}` : null
}
