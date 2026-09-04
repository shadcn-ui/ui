export function useIntervalTimer(callback: () => void, delayMs: number | null) {
  return { active: delayMs !== null };
}