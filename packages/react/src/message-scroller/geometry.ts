import {
  EMPTY_MESSAGE_SCROLLER_SCROLLABLE,
  EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE,
  SCROLL_POSITION_EPSILON,
} from "./types"
import type {
  MessageScrollerScrollable,
  MessageScrollerScrollAlign,
  MessageScrollerVisibilityState,
} from "./types"

function getMessageScrollerScrollable({
  content,
  scrollEdgeThreshold,
  spacer,
  viewport,
}: {
  content: HTMLElement | null
  scrollEdgeThreshold: number
  spacer: HTMLElement | null
  viewport: HTMLElement | null
}): MessageScrollerScrollable {
  if (!viewport || !content) {
    return EMPTY_MESSAGE_SCROLLER_SCROLLABLE
  }

  const contentBottom = getContentBottom({ content, spacer, viewport })

  return {
    start: viewport.scrollTop > scrollEdgeThreshold,
    end:
      contentBottom - viewport.scrollTop - viewport.clientHeight >
      scrollEdgeThreshold,
  }
}

function getMessageScrollerVisibilityState({
  content,
  scrollMargin,
  scrollPreviousItemPeek,
  spacer,
  viewport,
  visibleMessageIds,
}: {
  content: HTMLElement | null
  scrollMargin: number
  scrollPreviousItemPeek: number
  spacer: HTMLElement | null
  viewport: HTMLElement | null
  visibleMessageIds: Set<string>
}): MessageScrollerVisibilityState {
  if (!content || !viewport) {
    return EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE
  }

  const viewportRect = viewport.getBoundingClientRect()
  // The reading line sits scrollPreviousItemPeek below scrollMargin: anchored
  // turns land there with the previous turn peeking above. A row only peeking in
  // that band has not been read down to yet, so it counts as neither visible nor
  // current.
  const lineTop = viewportRect.top + scrollMargin + scrollPreviousItemPeek
  const trackByLayout = typeof IntersectionObserver === "undefined"

  const visible: string[] = []
  let currentAnchorId: string | null = null

  // Walk rows in document order so visible ids come out top-to-bottom.
  for (const item of getMessageScrollerItems(content, spacer)) {
    const messageId = item.dataset.messageId

    if (!messageId) {
      continue
    }

    const isAnchor = item.dataset.scrollAnchor === "true"
    // Anchors need a rect to place the current line; non-anchors lean on the
    // observer set (or a rect in the no-observer fallback).
    const rect = isAnchor || trackByLayout ? item.getBoundingClientRect() : null

    const isVisible =
      trackByLayout && rect
        ? rect.bottom > lineTop && rect.top < viewportRect.bottom
        : visibleMessageIds.has(messageId)

    if (isVisible) {
      visible.push(messageId)
    }

    // Current is the last anchor to have reached the reading line: the turn you
    // scrolled to (placed at the line) wins over newer turns lower down, the
    // previous turn peeking above the line has been passed, and it stays current
    // even after its header scrolls above the viewport.
    if (isAnchor && rect && rect.top <= lineTop + SCROLL_POSITION_EPSILON) {
      currentAnchorId = messageId
    }
  }

  if (visible.length === 0 && currentAnchorId === null) {
    return EMPTY_MESSAGE_SCROLLER_VISIBILITY_STATE
  }

  return {
    currentAnchorId,
    visibleMessageIds: visible,
  }
}

function getMessageScrollerItems(
  content: HTMLElement,
  spacer: HTMLElement | null
) {
  return Array.from(content.children).filter(
    (child): child is HTMLElement =>
      child instanceof HTMLElement && child !== spacer
  )
}

function getNewScrollAnchor(items: HTMLElement[], previousItemCount: number) {
  for (let index = previousItemCount; index < items.length; index++) {
    const item = items[index]

    if (item?.dataset.scrollAnchor === "true") {
      return item
    }
  }

  return null
}

function getUnanchoredScrollAnchor(
  items: HTMLElement[],
  handledAnchors: { has(element: HTMLElement): boolean }
) {
  for (const item of items) {
    if (item.dataset.scrollAnchor === "true" && !handledAnchors.has(item)) {
      return item
    }
  }

  return null
}

function hasMultipleNewScrollAnchors(
  items: HTMLElement[],
  previousItemCount: number
) {
  let count = 0

  for (let index = previousItemCount; index < items.length; index++) {
    const item = items[index]

    if (item?.dataset.scrollAnchor !== "true") {
      continue
    }

    count += 1

    if (count > 1) {
      return true
    }
  }

  return false
}

function getLastScrollAnchor(items: HTMLElement[]) {
  for (let index = items.length - 1; index >= 0; index--) {
    const item = items[index]

    if (item?.dataset.scrollAnchor === "true") {
      return item
    }
  }

  return null
}

function getFirstVisibleMessageItem({
  content,
  spacer,
  viewport,
}: {
  content: HTMLElement
  spacer: HTMLElement | null
  viewport: HTMLElement
}) {
  const viewportRect = viewport.getBoundingClientRect()

  for (const item of getMessageScrollerItems(content, spacer)) {
    if (!item.dataset.messageId) {
      continue
    }

    const rect = item.getBoundingClientRect()

    if (rect.bottom > viewportRect.top && rect.top < viewportRect.bottom) {
      return item
    }
  }

  return null
}

function getElementScrollTop({
  align,
  element,
  scrollMargin,
  spacer,
  viewport,
}: {
  align: MessageScrollerScrollAlign
  element: HTMLElement
  scrollMargin: number
  spacer: HTMLElement | null
  viewport: HTMLElement
}) {
  const elementTop = getElementTop(element, viewport)
  const elementHeight = element.getBoundingClientRect().height
  const contentPadding = getContentBlockPadding(spacer)

  if (align === "center") {
    const insetHeight = Math.max(
      0,
      viewport.clientHeight - contentPadding.start - contentPadding.end
    )

    return (
      elementTop -
      contentPadding.start -
      (insetHeight - elementHeight) / 2 -
      scrollMargin
    )
  }

  if (align === "end") {
    return (
      elementTop -
      viewport.clientHeight +
      elementHeight +
      contentPadding.end +
      scrollMargin
    )
  }

  if (align === "nearest") {
    const elementBottom = elementTop + elementHeight
    const viewportTop = viewport.scrollTop + contentPadding.start
    const viewportBottom =
      viewport.scrollTop + viewport.clientHeight - contentPadding.end

    if (elementTop >= viewportTop && elementBottom <= viewportBottom) {
      return viewport.scrollTop
    }

    if (elementTop < viewportTop) {
      return elementTop - contentPadding.start - scrollMargin
    }

    return (
      elementBottom - viewport.clientHeight + contentPadding.end + scrollMargin
    )
  }

  return elementTop - contentPadding.start - scrollMargin
}

function getElementTop(element: HTMLElement, viewport: HTMLElement) {
  const elementRect = element.getBoundingClientRect()
  const viewportRect = viewport.getBoundingClientRect()

  return elementRect.top - viewportRect.top + viewport.scrollTop
}

function getElementViewportTop(element: HTMLElement, viewport: HTMLElement) {
  return (
    element.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}

function getTailSpacerHeight({
  content,
  scrollTop,
  spacer,
  viewport,
}: {
  content: HTMLElement
  scrollTop: number
  spacer: HTMLElement | null
  viewport: HTMLElement
}) {
  const contentBottom = getContentBottom({ content, spacer, viewport })

  return scrollTop + viewport.clientHeight - contentBottom
}

function getContentBottom({
  content,
  spacer,
  viewport,
}: {
  content: HTMLElement
  spacer: HTMLElement | null
  viewport: HTMLElement
}) {
  const items = getMessageScrollerItems(content, spacer)
  const padding = getBlockPadding(content)
  const viewportRect = viewport.getBoundingClientRect()
  const scrollTop = viewport.scrollTop
  let contentBottom = padding.start + padding.end

  for (const item of items) {
    const rect = item.getBoundingClientRect()

    contentBottom = Math.max(
      contentBottom,
      rect.bottom - viewportRect.top + scrollTop + padding.end
    )
  }

  return contentBottom
}

function getMaxScrollTop(viewport: HTMLElement) {
  return Math.max(0, viewport.scrollHeight - viewport.clientHeight)
}

function getBlockPadding(element: HTMLElement) {
  const style = window.getComputedStyle(element)

  return {
    end: readCssPixel(style.paddingBlockEnd || style.paddingBottom),
    start: readCssPixel(style.paddingBlockStart || style.paddingTop),
  }
}

function getContentBlockPadding(spacer: HTMLElement | null) {
  const content = spacer?.parentElement

  if (!content) {
    return {
      end: 0,
      start: 0,
    }
  }

  return getBlockPadding(content)
}

function getFlexGap(element: HTMLElement | null) {
  if (!element) {
    return 0
  }

  const style = window.getComputedStyle(element)
  const gap = style.rowGap === "normal" ? style.gap : style.rowGap

  return readCssPixel(gap)
}

function readCssPixel(value: string | undefined) {
  if (!value) {
    return 0
  }

  const number = Number.parseFloat(value)

  return Number.isFinite(number) ? number : 0
}

export {
  getContentBlockPadding,
  getContentBottom,
  getElementScrollTop,
  getElementTop,
  getElementViewportTop,
  getFirstVisibleMessageItem,
  getFlexGap,
  getLastScrollAnchor,
  getMaxScrollTop,
  getMessageScrollerItems,
  getMessageScrollerScrollable,
  getMessageScrollerVisibilityState,
  getNewScrollAnchor,
  getTailSpacerHeight,
  getUnanchoredScrollAnchor,
  hasMultipleNewScrollAnchors,
}
