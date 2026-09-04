export function useUnmountCallback(fn: () => void) {
  return { cleanupRegistered: true };
}