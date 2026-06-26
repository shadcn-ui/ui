import * as React from "react"

import {
  getElementScrollTop,
  getElementViewportTop,
  getMaxScrollTop,
  getTailSpacerHeight,
} from "./geometry"
import { AUTOSCROLLING_CLEAR_DELAY, SCROLL_POSITION_EPSILON } from "./types"
import type { MessageScrollerScrollOptions } from "./types"
import type { MessageScrollerRefs } from "./use-message-scroller-refs"

// Imperative scroll primitives, split from the controller so the move mechanics
// live apart from the policy that decides when to run them. Each command resolves
// a target scrollTop and returns false when the viewport is not mounted yet.
function useMessageScrollerCommands({
  refs,
  commitScrollState,
  scheduleStateCommit,
  scheduleVisibilitySync,
}: {
  refs: MessageScrollerRefs
  commitScrollState: () => void
  scheduleStateCommit: () => void
  scheduleVisibilitySync: () => void
}) {
  const {
    streamingTurnRef,
    autoScrollRef,
    autoscrollingRef,
    autoscrollingTimeoutRef,
    contentRef,
    defaultScrollPositionAppliedRef,
    itemCountRef,
    messageElementsRef,
    modeRef,
    pendingScrollToMessageRef,
    prependRestoreRef,
    scrollMarginRef,
    scrollPreviousItemPeekRef,
    spacerGapRef,
    spacerHeightRef,
    spacerRef,
    viewportRef,
  } = refs

  const setAutoScrolling = React.useCallback(
    (autoscrolling: boolean) => {
      if (autoscrollingTimeoutRef.current !== null) {
        window.clearTimeout(autoscrollingTimeoutRef.current)
        autoscrollingTimeoutRef.current = null
      }

      if (autoscrollingRef.current !== autoscrolling) {
        autoscrollingRef.current = autoscrolling
        commitScrollState()
      }

      if (autoscrolling) {
        autoscrollingTimeoutRef.current = window.setTimeout(() => {
          autoscrollingTimeoutRef.current = null
          autoscrollingRef.current = false
          commitScrollState()
        }, AUTOSCROLLING_CLEAR_DELAY)
      }
    },
    [commitScrollState]
  )

  const setTailSpacerHeight = React.useCallback((height: number) => {
    const spacer = spacerRef.current

    if (!spacer) {
      return
    }

    const nextHeight = Math.max(0, Math.ceil(height))

    if (spacerHeightRef.current === nextHeight) {
      return
    }

    spacerHeightRef.current = nextHeight
    spacer.hidden = nextHeight === 0
    spacer.style.height = `${nextHeight}px`
    spacer.style.marginTop = nextHeight > 0 ? `${-spacerGapRef.current}px` : ""
  }, [])

  const scrollToPosition = React.useCallback(
    (
      scrollTop: number,
      {
        behavior = "auto",
        autoscrolling = false,
      }: {
        behavior?: ScrollBehavior
        autoscrolling?: boolean
      } = {}
    ) => {
      const viewport = viewportRef.current

      if (!viewport) {
        return
      }

      const nextScrollTop = Math.max(0, scrollTop)

      if (
        Math.abs(viewport.scrollTop - nextScrollTop) <= SCROLL_POSITION_EPSILON
      ) {
        viewport.scrollTop = nextScrollTop
        commitScrollState()
        return
      }

      if (autoscrolling) {
        setAutoScrolling(true)
      }

      viewport.scrollTo({
        top: nextScrollTop,
        behavior,
      })
      scheduleStateCommit()
    },
    [commitScrollState, scheduleStateCommit, setAutoScrolling]
  )

  const scrollToStart = React.useCallback(
    ({ behavior = "auto" }: MessageScrollerScrollOptions = {}) => {
      if (!viewportRef.current) {
        return false
      }

      setTailSpacerHeight(0)
      streamingTurnRef.current = null
      modeRef.current = "free-scrolling"
      scrollToPosition(0, { behavior })
      scheduleVisibilitySync()

      return true
    },
    [scheduleVisibilitySync, scrollToPosition, setTailSpacerHeight]
  )

  const scrollToEnd = React.useCallback(
    ({ behavior = "auto" }: MessageScrollerScrollOptions = {}) => {
      const viewport = viewportRef.current

      if (!viewport) {
        return false
      }

      setTailSpacerHeight(0)
      streamingTurnRef.current = null
      modeRef.current = autoScrollRef.current
        ? "following-bottom"
        : "free-scrolling"
      scrollToPosition(getMaxScrollTop(viewport), {
        autoscrolling: true,
        behavior,
      })
      scheduleVisibilitySync()

      return true
    },
    [scheduleVisibilitySync, scrollToPosition, setTailSpacerHeight]
  )

  const scrollToElement = React.useCallback(
    (
      element: HTMLElement,
      {
        align = "start",
        behavior = "auto",
        scrollMargin = scrollMarginRef.current,
      }: MessageScrollerScrollOptions = {},
      {
        keepPreviousPeek = false,
      }: {
        keepPreviousPeek?: boolean
      } = {}
    ) => {
      const content = contentRef.current
      const viewport = viewportRef.current

      if (!content || !viewport || !content.contains(element)) {
        return false
      }

      const scrollTop = getElementScrollTop({
        align,
        element,
        scrollMargin: keepPreviousPeek
          ? scrollMargin + scrollPreviousItemPeekRef.current
          : scrollMargin,
        spacer: spacerRef.current,
        viewport,
      })

      const nextSpacerHeight = getTailSpacerHeight({
        content,
        scrollTop,
        spacer: spacerRef.current,
        viewport,
      })

      setTailSpacerHeight(nextSpacerHeight)
      // Seed the prepend anchor with the jump target so a prepend that lands
      // before this scroll settles still preserves the jumped-to row; once it
      // settles, syncAfterScroll's capturePrependAnchor re-captures it from the
      // first visible row.
      prependRestoreRef.current = {
        element,
        viewportTop: getElementViewportTop(element, viewport),
      }

      modeRef.current = keepPreviousPeek
        ? "anchored-to-message"
        : "settling-jump"
      streamingTurnRef.current = keepPreviousPeek ? element : null

      scrollToPosition(scrollTop, { behavior })
      scheduleVisibilitySync()

      return true
    },
    [scheduleVisibilitySync, scrollToPosition, setTailSpacerHeight]
  )

  const reanchorToAnchoredMessage = React.useCallback(() => {
    const element = streamingTurnRef.current

    if (
      !element ||
      !element.isConnected ||
      modeRef.current !== "anchored-to-message"
    ) {
      return false
    }

    // Re-run the placement so the tail spacer is recomputed for the new content
    // height and the turn is held at the reading line.
    return scrollToElement(
      element,
      { align: "start" },
      { keepPreviousPeek: true }
    )
  }, [scrollToElement])

  // The target row may not be mounted yet (e.g. an async-loaded transcript).
  // When it is missing the request is queued in pendingScrollToMessageRef and
  // flushed later — on registerMessage for that id, or on the next content
  // change. An explicit jump also marks the mount default as applied, so
  // defaultScrollPosition does not override it.
  const scrollToMessage = React.useCallback(
    (messageId: string, options?: MessageScrollerScrollOptions) => {
      const element = messageElementsRef.current.get(messageId)

      if (!element) {
        if (itemCountRef.current === 0) {
          pendingScrollToMessageRef.current = {
            messageId,
            options,
          }
          defaultScrollPositionAppliedRef.current = true

          return true
        }

        return false
      }

      defaultScrollPositionAppliedRef.current = true

      if (scrollToElement(element, options)) {
        pendingScrollToMessageRef.current = null
        return true
      }

      pendingScrollToMessageRef.current = {
        messageId,
        options,
      }

      return true
    },
    [scrollToElement]
  )

  const flushPendingScrollToMessage = React.useCallback(() => {
    const pending = pendingScrollToMessageRef.current

    if (!pending) {
      return false
    }

    const element = messageElementsRef.current.get(pending.messageId)

    if (!element) {
      return false
    }

    const handled = scrollToElement(element, pending.options)

    if (!handled) {
      return false
    }

    pendingScrollToMessageRef.current = null
    defaultScrollPositionAppliedRef.current = true

    return true
  }, [scrollToElement])

  return {
    flushPendingScrollToMessage,
    reanchorToAnchoredMessage,
    scrollToElement,
    scrollToEnd,
    scrollToMessage,
    scrollToStart,
  }
}

export { useMessageScrollerCommands }
