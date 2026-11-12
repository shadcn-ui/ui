import { defineComponent, h, inject, onBeforeUnmount, onMounted, provide, ref } from 'vue'
import type { InjectionKey, PropType, Ref } from 'vue'
import { cn } from '@saaze/utils'

interface MessageScrollerContext {
  autoScroll: () => boolean
  scrollPreviousItemPeek: () => number
  viewport: Ref<HTMLDivElement | undefined>
  isFollowing: Ref<boolean>
  unread: Ref<number>
  canScrollStart: Ref<boolean>
  canScrollEnd: Ref<boolean>
  scrollToStart: () => void
  scrollToEnd: () => void
  scrollToMessage: (id: string) => void
  updatePosition: () => void
}

const MESSAGE_SCROLLER_KEY: InjectionKey<MessageScrollerContext> = Symbol('saaze-message-scroller')

function useMessageScroller(name: string): MessageScrollerContext {
  const context = inject(MESSAGE_SCROLLER_KEY)
  if (!context) throw new Error(`${name} must be used inside MessageScrollerProvider.`)
  return context
}

export const MessageScrollerProvider = defineComponent({
  name: 'MessageScrollerProvider',
  props: {
    autoScroll: { type: Boolean, default: false },
    scrollPreviousItemPeek: { type: Number, default: 64 },
  },
  setup(props, { slots }) {
    const viewport = ref<HTMLDivElement>()
    const isFollowing = ref(false)
    const unread = ref(0)
    const canScrollStart = ref(false)
    const canScrollEnd = ref(false)

    const updatePosition = () => {
      const element = viewport.value
      if (!element) return
      canScrollStart.value = element.scrollTop > 1
      canScrollEnd.value = element.scrollHeight - element.clientHeight - element.scrollTop > 1
      if (props.autoScroll) {
        isFollowing.value = !canScrollEnd.value
        if (isFollowing.value) unread.value = 0
      }
    }
    const scrollToEnd = () => {
      const element = viewport.value
      if (!element) return
      element.scrollTo({ top: element.scrollHeight, behavior: 'smooth' })
      isFollowing.value = props.autoScroll
      unread.value = 0
    }
    const scrollToStart = () => {
      viewport.value?.scrollTo({ top: 0, behavior: 'smooth' })
      isFollowing.value = false
    }
    const scrollToMessage = (id: string) => {
      const target = Array.from(
        viewport.value?.querySelectorAll<HTMLElement>('[data-message-id]') ?? [],
      ).find((element) => element.dataset.messageId === id)
      if (!target || !viewport.value) return
      const viewportTop = viewport.value.getBoundingClientRect().top
      viewport.value.scrollTo({
        top: viewport.value.scrollTop + target.getBoundingClientRect().top - viewportTop,
        behavior: 'smooth',
      })
      isFollowing.value = false
    }

    provide(MESSAGE_SCROLLER_KEY, {
      autoScroll: () => props.autoScroll,
      scrollPreviousItemPeek: () => Math.max(0, props.scrollPreviousItemPeek),
      viewport,
      isFollowing,
      unread,
      canScrollStart,
      canScrollEnd,
      scrollToStart,
      scrollToEnd,
      scrollToMessage,
      updatePosition,
    })

    return () => h('div', { 'data-slot': 'message-scroller-provider' }, slots.default?.())
  },
})

export const MessageScroller = defineComponent({
  name: 'MessageScroller',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    useMessageScroller('MessageScroller')
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'message-scroller',
          class: cn('relative flex min-h-0 min-w-0 flex-1 flex-col', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export const MessageScrollerViewport = defineComponent({
  name: 'MessageScrollerViewport',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const context = useMessageScroller('MessageScrollerViewport')
    let mutationObserver: MutationObserver | undefined
    let resizeObserver: ResizeObserver | undefined
    let previousScrollHeight = 0
    let previousFirstItem: HTMLElement | null = null
    let previousItemCount = 0
    const knownScrollAnchors = new WeakSet<Element>()

    const onScroll = (event: Event) => {
      context.updatePosition()
      const handler = attrs.onScroll
      if (typeof handler === 'function') handler(event)
    }

    onMounted(() => {
      const element = context.viewport.value
      if (!element) return
      previousScrollHeight = element.scrollHeight
      previousFirstItem = element.querySelector<HTMLElement>('[data-message-scroller-item]')
      previousItemCount = element.querySelectorAll('[data-message-scroller-item]').length
      element.querySelectorAll('[data-scroll-anchor="true"]').forEach((anchor) => {
        knownScrollAnchors.add(anchor)
      })
      if (context.autoScroll()) {
        element.scrollTop = element.scrollHeight
        context.isFollowing.value = true
      }
      context.updatePosition()

      mutationObserver = new MutationObserver(() => {
        const viewport = context.viewport.value
        if (!viewport) return
        const firstItem = viewport.querySelector<HTMLElement>('[data-message-scroller-item]')
        const newItems = viewport.querySelectorAll('[data-message-scroller-item]').length
        const addedCount = Math.max(0, newItems - previousItemCount)
        const addedAtStart =
          previousItemCount > 0 && addedCount > 0 && firstItem !== previousFirstItem
        const scrollHeightDelta = viewport.scrollHeight - previousScrollHeight
        const newAnchor = Array.from(
          viewport.querySelectorAll<HTMLElement>('[data-scroll-anchor="true"]'),
        ).find((anchor) => !knownScrollAnchors.has(anchor))

        if (newAnchor) {
          knownScrollAnchors.add(newAnchor)
          viewport.scrollTo({
            top: Math.max(
              0,
              viewport.scrollTop +
                newAnchor.getBoundingClientRect().top -
                viewport.getBoundingClientRect().top -
                context.scrollPreviousItemPeek(),
            ),
            behavior: 'smooth',
          })
          context.isFollowing.value = false
          context.unread.value = 0
        } else if (addedAtStart && !context.isFollowing.value) {
          viewport.scrollTop += scrollHeightDelta
        } else if (addedCount > 0) {
          if (context.isFollowing.value && context.autoScroll()) context.scrollToEnd()
          else context.unread.value += addedCount
        } else if (context.isFollowing.value && context.autoScroll()) {
          context.scrollToEnd()
        }
        previousScrollHeight = viewport.scrollHeight
        previousFirstItem = firstItem
        previousItemCount = newItems
        context.updatePosition()
      })
      mutationObserver.observe(element, { childList: true, subtree: true, characterData: true })
      resizeObserver = new ResizeObserver(() => {
        const viewport = context.viewport.value
        if (viewport && context.isFollowing.value && context.autoScroll()) context.scrollToEnd()
        previousScrollHeight = viewport?.scrollHeight ?? previousScrollHeight
        context.updatePosition()
      })
      resizeObserver.observe(element)
    })

    onBeforeUnmount(() => {
      mutationObserver?.disconnect()
      resizeObserver?.disconnect()
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          ref: context.viewport,
          'data-slot': 'message-scroller-viewport',
          'data-autoscrolling': context.isFollowing.value ? 'true' : undefined,
          class: cn('min-h-0 min-w-0 flex-1 overflow-y-auto overscroll-contain', attrs.class),
          onScroll,
        },
        slots.default?.(),
      )
  },
})

export const MessageScrollerContent = defineComponent({
  name: 'MessageScrollerContent',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'message-scroller-content',
          role: 'log',
          'aria-live': 'polite',
          'aria-relevant': 'additions text',
          'aria-atomic': 'false',
          class: cn('flex min-w-0 flex-col gap-6 p-4 pb-16', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export const MessageScrollerItem = defineComponent({
  name: 'MessageScrollerItem',
  inheritAttrs: false,
  props: {
    messageId: { type: String, default: undefined },
    scrollAnchor: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'message-scroller-item',
          'data-message-scroller-item': '',
          'data-message-id': props.messageId,
          'data-scroll-anchor': props.scrollAnchor ? 'true' : undefined,
          class: cn('min-w-0', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export const MessageScrollerButton = defineComponent({
  name: 'MessageScrollerButton',
  inheritAttrs: false,
  props: {
    direction: { type: String as PropType<'start' | 'end'>, default: 'end' },
  },
  setup(props, { attrs, slots }) {
    const context = useMessageScroller('MessageScrollerButton')
    const scroll = props.direction === 'end' ? context.scrollToEnd : context.scrollToStart
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-slot': 'message-scroller-button',
          'data-direction': props.direction,
          disabled:
            attrs.disabled ??
            (props.direction === 'end' ? !context.canScrollEnd.value : !context.canScrollStart.value),
          class: cn(
            'inline-flex min-h-9 items-center justify-center rounded-full border border-border bg-background px-4 text-sm shadow-md transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            attrs.class,
          ),
          onClick: (event: MouseEvent) => {
            scroll()
            const handler = attrs.onClick
            if (typeof handler === 'function') handler(event)
          },
        },
        slots.default?.() ??
          (props.direction === 'end'
            ? context.unread.value > 0
              ? `پیام‌های تازه (${context.unread.value}) · رفتن به آخرین پیام`
              : 'رفتن به آخرین پیام'
            : 'رفتن به پیام‌های قبلی'),
      )
  },
})

export const MessageScrollerJump = MessageScrollerButton
