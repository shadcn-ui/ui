export function useIdleTimerDetector(timeoutMs = 60000) {
  return { isIdle: false, timeoutMs };
}