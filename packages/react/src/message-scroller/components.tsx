import * as React from "react"

import { composeRefs, mergeProps, useRender } from "../use-render"
import { USER_SCROLL_KEYS } from "./types"
import type {
  MessageScrollerButtonProps,
  MessageScrollerContentProps,
  MessageScrollerContextValue,
  MessageScrollerItemProps,
  MessageScrollerProps,
  MessageScrollerProviderProps,
  MessageScrollerRegisterMessage,
  MessageScrollerViewportProps,
} from "./types"
import { useMessageScrollerController } from "./use-message-scroller-controller"
import { useLatest } from "./utils"

const MessageScrollerContext =
  React.createContext<MessageScrollerContextValue | null>(null)
const MessageScrollerItemContext =
  React.createContext<MessageScrollerRegisterMessage | null>(null)

function useMessageScrollerContext() {
  const context = React.useContext(MessageScrollerContext)

  if (!context) {
    throw new Error("useMessageScroller must be used within a MessageScroller.")
  }

  return context
}

function useMessageScrollerItemContext() {
  const context = React.useContext(MessageScrollerItemContext)

  if (!context) {
    throw new Error(
      "MessageScrollerItem must be used within a MessageScroller."
    )
  }

  return context
}

function useMessageScroller() {
  const { scrollToEnd, scrollToMessage, scrollToStart } =
    useMessageScrollerContext()

  return React.useMemo(
    () => ({
      scrollToEnd,
      scrollToMessage,
      scrollToStart,
    }),
    [scrollToEnd, scrollToMessage, scrollToStart]
  )
}

function useMessageScrollerScrollable() {
  const { stateStore } = useMessageScrollerContext()

  return React.useSyncExternalStore(
    stateStore.subscribe,
    stateStore.getSnapshot,
    stateStore.getSnapshot
  )
}

function useMessageScrollerVisibility() {
  const { observeVisibility, unobserveVisibility, visibilityStore } =
    useMessageScrollerContext()
  const subscribe = React.useCallback(
    (listener: () => void) =>
      visibilityStore.subscribe(
        listener,
        observeVisibility,
        unobserveVisibility
      ),
    [observeVisibility, unobserveVisibility, visibilityStore]
  )

  return React.useSyncExternalStore(
    subscribe,
    visibilityStore.getSnapshot,
    visibilityStore.getSnapshot
  )
}

function MessageScrollerProvider({
  autoScroll = false,
  children,
  defaultScrollPosition = "end",
  scrollEdgeThreshold,
  scrollPreviousItemPeek,
  scrollMargin,
}: MessageScrollerProviderProps) {
  const { context, registerMessage } = useMessageScrollerController({
    autoScroll,
    defaultScrollPosition,
    scrollEdgeThreshold,
    scrollPreviousItemPeek,
    scrollMargin,
  })

  return (
    <MessageScrollerContext.Provider value={context}>
      <MessageScrollerItemContext.Provider value={registerMessage}>
        {children}
      </MessageScrollerItemContext.Provider>
    </MessageScrollerContext.Provider>
  )
}

function MessageScroller({ children, ...props }: MessageScrollerProps) {
  const { setRootElement } = useMessageScrollerContext()

  return (
    <div ref={setRootElement} {...props}>
      {children}
    </div>
  )
}

function MessageScrollerViewport({
  "aria-label": ariaLabel,
  children,
  onKeyDown,
  onScroll,
  onTouchMove,
  onWheel,
  preserveScrollOnPrepend = true,
  ref,
  role,
  tabIndex,
  ...props
}: MessageScrollerViewportProps) {
  const {
    handleResize,
    preserveScrollOnPrependRef,
    setViewportElement,
    syncAfterScroll,
    userScrollIntent,
    viewportRef,
  } = useMessageScrollerContext()

  preserveScrollOnPrependRef.current = preserveScrollOnPrepend

  const setViewportRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      setViewportElement(element)
      composeRefs(ref)?.(element)
    },
    [ref, setViewportElement]
  )

  function handleScroll(event: React.UIEvent<HTMLDivElement>) {
    syncAfterScroll()
    onScroll?.(event)
  }

  function handleWheel(event: React.WheelEvent<HTMLDivElement>) {
    userScrollIntent()
    onWheel?.(event)
  }

  function handleTouchMove(event: React.TouchEvent<HTMLDivElement>) {
    userScrollIntent()
    onTouchMove?.(event)
  }

  function handleKeyDown(event: React.KeyboardEvent<HTMLDivElement>) {
    if (USER_SCROLL_KEYS.has(event.key)) {
      userScrollIntent()
    }

    onKeyDown?.(event)
  }

  React.useEffect(() => {
    const viewport = viewportRef.current

    if (!viewport || typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(handleResize)

    observer.observe(viewport)

    return () => observer.disconnect()
  }, [handleResize, viewportRef])

  return (
    <div
      ref={setViewportRef}
      role={role ?? "region"}
      aria-label={ariaLabel ?? "Messages"}
      tabIndex={tabIndex ?? 0}
      onKeyDown={handleKeyDown}
      onScroll={handleScroll}
      onTouchMove={handleTouchMove}
      onWheel={handleWheel}
      {...props}
    >
      {children}
    </div>
  )
}

function MessageScrollerContent({
  "aria-relevant": ariaRelevant,
  children,
  ref,
  role,
  spacerClassName,
  ...props
}: MessageScrollerContentProps) {
  const {
    handleContentChange,
    handleResize,
    setContentElement,
    setSpacerElement,
  } = useMessageScrollerContext()
  const contentRef = React.useRef<HTMLDivElement | null>(null)

  const setContentRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      contentRef.current = element
      setContentElement(element)
      composeRefs(ref)?.(element)
    },
    [ref, setContentElement]
  )

  React.useLayoutEffect(() => {
    const content = contentRef.current

    if (!content) {
      return
    }

    handleContentChange()

    if (typeof MutationObserver === "undefined") {
      return
    }

    const observer = new MutationObserver(() => {
      handleContentChange()
    })

    observer.observe(content, { childList: true })

    return () => observer.disconnect()
  }, [handleContentChange])

  React.useEffect(() => {
    const content = contentRef.current

    if (!content || typeof ResizeObserver === "undefined") {
      return
    }

    const observer = new ResizeObserver(handleResize)

    observer.observe(content)

    return () => observer.disconnect()
  }, [handleResize])

  return (
    <div
      ref={setContentRef}
      role={role ?? "log"}
      aria-relevant={ariaRelevant ?? "additions"}
      {...props}
    >
      {children}
      <div
        ref={setSpacerElement}
        aria-hidden="true"
        data-message-scroller-spacer=""
        hidden
        className={spacerClassName}
      />
    </div>
  )
}

function MessageScrollerItem({
  messageId,
  ref,
  scrollAnchor = false,
  ...props
}: MessageScrollerItemProps) {
  const registerMessage = useMessageScrollerItemContext()
  const elementRef = React.useRef<HTMLDivElement | null>(null)

  const setItemRef = React.useCallback(
    (element: HTMLDivElement | null) => {
      const previousElement = elementRef.current

      elementRef.current = element

      if (messageId) {
        registerMessage(messageId, element, previousElement)
      }

      composeRefs(ref)?.(element)
    },
    [messageId, ref, registerMessage]
  )

  return (
    <div
      ref={setItemRef}
      data-message-id={messageId}
      data-scroll-anchor={scrollAnchor ? "true" : "false"}
      {...props}
    />
  )
}

function MessageScrollerButton({
  behavior = "smooth",
  children,
  direction = "end",
  onClick,
  render,
  tabIndex,
  type = "button",
  ...props
}: MessageScrollerButtonProps) {
  const { scrollToEnd, scrollToStart, stateStore } = useMessageScrollerContext()
  const onClickRef = useLatest(onClick)
  const subscribe = React.useCallback(
    (listener: () => void) => stateStore.subscribe(listener),
    [stateStore]
  )
  const getSnapshot = React.useCallback(() => {
    const state = stateStore.getSnapshot()

    return direction === "start" ? state.start : state.end
  }, [direction, stateStore])
  const isActive = React.useSyncExternalStore(
    subscribe,
    getSnapshot,
    getSnapshot
  )

  const handleClick = React.useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      if (!isActive) {
        return
      }

      onClickRef.current?.(event)

      if (!event.defaultPrevented) {
        event.currentTarget.blur()

        if (direction === "start") {
          scrollToStart({ behavior })
        } else {
          scrollToEnd({ behavior })
        }
      }
    },
    [behavior, direction, isActive, onClickRef, scrollToEnd, scrollToStart]
  )

  return useRender({
    defaultTagName: "button",
    props: mergeProps<"button">(
      {
        type,
        inert: !isActive,
        tabIndex: isActive ? tabIndex : -1,
        children: children ?? <span>Scroll to {direction}</span>,
        onClick: handleClick,
      },
      props
    ),
    render,
    state: {
      active: isActive,
      direction,
    },
    stateAttributesMapping: {
      active: (value) => ({
        "data-active": value ? "true" : "false",
      }),
    },
  })
}

export {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
  useMessageScroller,
  useMessageScrollerScrollable,
  useMessageScrollerVisibility,
}
