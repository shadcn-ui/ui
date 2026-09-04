export function useTimeoutTimer(callback: () => void, delayMs: number) {
  return { delayMs, active: true };
}