import * as React from "react"

import {
  areScrollStatesEqual,
  createMessageScrollerStore,
  createMessageScrollerVisibilityStore,
} from "./stores"
import { EMPTY_MESSAGE_SCROLLER_SCROLLABLE } from "./types"
import type {
  MessageScrollerMode,
  MessageScrollerScrollable,
  MessageScrollerScrollOptions,
  MessageScrollerStore,
  MessageScrollerVisibilityStore,
} from "./types"

// Shared mutable ref bag for one MessageScroller, closed over by both the
// controller and the commands so writes are visible across them without prop
// threading. stateStore and visibilityStore fan out via useSyncExternalStore.
type MessageScrollerRefs = {
  autoScrollRef: React.RefObject<boolean>
  autoscrollingRef: React.RefObject<boolean>
  autoscrollingTimeoutRef: React.RefObject<number | null>
  streamingTurnRef: React.RefObject<HTMLElement | null>
  contentRef: React.RefObject<HTMLDivElement | null>
  defaultScrollPositionAppliedRef: React.RefObject<boolean>
  firstItemRef: React.RefObject<HTMLElement | null>
  itemCountRef: React.RefObject<number>
  messageElementsRef: React.RefObject<Map<string, HTMLElement>>
  modeRef: React.RefObject<MessageScrollerMode>
  pendingScrollFrameRef: React.RefObject<number | null>
  pendingScrollToMessageRef: React.RefObject<{
    messageId: string
    options?: MessageScrollerScrollOptions
  } | null>
  prependRestoreRef: React.RefObject<{
    element: HTMLElement
    viewportTop: number
  } | null>
  preserveScrollOnPrependRef: React.RefObject<boolean>
  rootRef: React.RefObject<HTMLDivElement | null>
  scrollEdgeThresholdRef: React.RefObject<number>
  scrollMarginRef: React.RefObject<number>
  scrollPreviousItemPeekRef: React.RefObject<number>
  spacerGapRef: React.RefObject<number>
  spacerHeightRef: React.RefObject<number>
  spacerRef: React.RefObject<HTMLDivElement | null>
  stateFrameRef: React.RefObject<number | null>
  stateStore: MessageScrollerStore<MessageScrollerScrollable>
  viewportRef: React.RefObject<HTMLDivElement | null>
  visibilityFrameRef: React.RefObject<number | null>
  visibilityObserverRef: React.RefObject<IntersectionObserver | null>
  visibilityStore: MessageScrollerVisibilityStore
  visibleMessageIdsRef: React.RefObject<Set<string>>
  handledScrollAnchorsRef: React.RefObject<WeakSet<HTMLElement>>
}

// Builds the per-instance ref bag: the two external stores constructed once, and
// the latest prop values mirrored onto refs each render so callbacks stay stable.
function useMessageScrollerRefs({
  autoScroll,
  scrollEdgeThreshold,
  scrollMargin,
  scrollPreviousItemPeek,
}: {
  autoScroll: boolean
  scrollEdgeThreshold: number
  scrollMargin: number
  scrollPreviousItemPeek: number
}): MessageScrollerRefs {
  const autoScrollRef = React.useRef(autoScroll)
  const autoscrollingRef = React.useRef(false)
  const contentRef = React.useRef<HTMLDivElement | null>(null)
  const defaultScrollPositionAppliedRef = React.useRef(false)
  const scrollEdgeThresholdRef = React.useRef(scrollEdgeThreshold)
  const itemCountRef = React.useRef(0)
  const firstItemRef = React.useRef<HTMLElement | null>(null)
  const modeRef = React.useRef<MessageScrollerMode>(
    autoScroll ? "following-bottom" : "free-scrolling"
  )
  const messageElementsRef = React.useRef(new Map<string, HTMLElement>())
  const pendingScrollToMessageRef = React.useRef<{
    messageId: string
    options?: MessageScrollerScrollOptions
  } | null>(null)
  // The row to hold steady on the next prepend: the first visible row, or a jump
  // target seeded by scrollToElement. restorePrependedAnchor reads only this.
  const prependRestoreRef = React.useRef<{
    element: HTMLElement
    viewportTop: number
  } | null>(null)
  // The turn held at the reading line so a reply streaming in below it can re-pin
  // it instead of letting scrollTop clamp it loose.
  const streamingTurnRef = React.useRef<HTMLElement | null>(null)
  const scrollPreviousItemPeekRef = React.useRef(scrollPreviousItemPeek)
  const preserveScrollOnPrependRef = React.useRef(true)
  const rootRef = React.useRef<HTMLDivElement | null>(null)
  const scrollMarginRef = React.useRef(scrollMargin)
  const pendingScrollFrameRef = React.useRef<number | null>(null)
  const spacerGapRef = React.useRef(0)
  const spacerHeightRef = React.useRef(0)
  const spacerRef = React.useRef<HTMLDivElement | null>(null)
  const stateFrameRef = React.useRef<number | null>(null)
  const stateStoreRef =
    React.useRef<MessageScrollerStore<MessageScrollerScrollable> | null>(null)
  const autoscrollingTimeoutRef = React.useRef<number | null>(null)
  const viewportRef = React.useRef<HTMLDivElement | null>(null)
  const visibilityFrameRef = React.useRef<number | null>(null)
  const visibilityObserverRef = React.useRef<IntersectionObserver | null>(null)
  const visibilityStoreRef =
    React.useRef<MessageScrollerVisibilityStore | null>(null)
  const visibleMessageIdsRef = React.useRef(new Set<string>())
  const handledScrollAnchorsRef = React.useRef(new WeakSet<HTMLElement>())

  if (stateStoreRef.current === null) {
    stateStoreRef.current = createMessageScrollerStore(
      EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
      areScrollStatesEqual
    )
  }

  if (visibilityStoreRef.current === null) {
    visibilityStoreRef.current = createMessageScrollerVisibilityStore()
  }

  // Track the latest prop values on every render so callbacks read fresh values
  // without being recreated (the useLatest pattern).
  autoScrollRef.current = autoScroll
  scrollEdgeThresholdRef.current = scrollEdgeThreshold
  scrollMarginRef.current = scrollMargin
  scrollPreviousItemPeekRef.current = scrollPreviousItemPeek

  return {
    autoScrollRef,
    autoscrollingRef,
    autoscrollingTimeoutRef,
    streamingTurnRef,
    contentRef,
    defaultScrollPositionAppliedRef,
    firstItemRef,
    itemCountRef,
    messageElementsRef,
    modeRef,
    pendingScrollFrameRef,
    pendingScrollToMessageRef,
    prependRestoreRef,
    preserveScrollOnPrependRef,
    rootRef,
    scrollEdgeThresholdRef,
    scrollMarginRef,
    scrollPreviousItemPeekRef,
    spacerGapRef,
    spacerHeightRef,
    spacerRef,
    stateFrameRef,
    stateStore: stateStoreRef.current,
    viewportRef,
    visibilityFrameRef,
    visibilityObserverRef,
    visibilityStore: visibilityStoreRef.current,
    visibleMessageIdsRef,
    handledScrollAnchorsRef,
  }
}

export { useMessageScrollerRefs }
export type { MessageScrollerRefs }
