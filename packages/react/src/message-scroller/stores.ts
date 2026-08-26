import { EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE } from "./types"
import type {
  MessageScrollerScrollable,
  MessageScrollerStore,
  MessageScrollerVisibilityState,
  MessageScrollerVisibilityStore,
} from "./types"

// Generic useSyncExternalStore backing: a stable snapshot (referentially equal
// while isEqual holds, so subscribers only re-render on real transitions) plus
// optional reference-counting via the subscribe-time lifecycle callbacks.
function createExternalStore<T>(
  initialSnapshot: T,
  isEqual: (a: T, b: T) => boolean
) {
  let snapshot = initialSnapshot
  const listeners = new Set<() => void>()

  return {
    getSnapshot: () => snapshot,
    hasListeners: () => listeners.size > 0,
    setSnapshot: (nextSnapshot: T) => {
      if (isEqual(snapshot, nextSnapshot)) {
        return
      }

      snapshot = nextSnapshot
      listeners.forEach((listener) => listener())
    },
    subscribe: (
      listener: () => void,
      onFirstSubscribe?: () => void,
      onLastUnsubscribe?: () => void
    ) => {
      const wasEmpty = listeners.size === 0

      listeners.add(listener)

      if (wasEmpty) {
        onFirstSubscribe?.()
      }

      return () => {
        listeners.delete(listener)

        if (listeners.size === 0) {
          onLastUnsubscribe?.()
        }
      }
    },
  }
}

function createMessageScrollerStore<T>(
  initialSnapshot: T,
  isEqual: (a: T, b: T) => boolean
): MessageScrollerStore<T> {
  return createExternalStore(initialSnapshot, isEqual)
}

function createMessageScrollerVisibilityStore(): MessageScrollerVisibilityStore {
  return createExternalStore(
    EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
    areVisibilityStatesEqual
  )
}

function areScrollStatesEqual(
  current: MessageScrollerScrollable,
  next: MessageScrollerScrollable
) {
  return current.start === next.start && current.end === next.end
}

function areVisibilityStatesEqual(
  current: MessageScrollerVisibilityState,
  next: MessageScrollerVisibilityState
) {
  if (current.currentAnchorId !== next.currentAnchorId) {
    return false
  }

  if (current.visibleMessageIds.length !== next.visibleMessageIds.length) {
    return false
  }

  return current.visibleMessageIds.every(
    (messageId, index) => messageId === next.visibleMessageIds[index]
  )
}

export {
  areScrollStatesEqual,
  areVisibilityStatesEqual,
  createMessageScrollerStore,
  createMessageScrollerVisibilityStore,
}
