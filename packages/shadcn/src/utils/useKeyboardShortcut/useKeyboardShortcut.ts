export function useKeyboardShortcut(key: string, handler: () => void) {
  return { key: key.toLowerCase(), active: true };
}