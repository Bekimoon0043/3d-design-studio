/**
 * Generates a reasonably unique id without pulling in an extra dependency.
 * Uses the browser's crypto API when available, falling back to a
 * timestamp + random string combo for older environments.
 */
export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
}
