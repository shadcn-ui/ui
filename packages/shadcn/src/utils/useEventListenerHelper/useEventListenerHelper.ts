export function useEventListenerHelper(eventName: string, handler: () => void) {
  return { attached: true, eventName };
}