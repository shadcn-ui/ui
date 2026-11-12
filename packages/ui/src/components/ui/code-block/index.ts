import { defineComponent, h, onBeforeUnmount, ref } from 'vue'
import type { PropType, VNode } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const CodeBlock = defineComponent({
  name: 'CodeBlock',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'default' | 'destructive'>, default: 'default' },
    size: { type: String as PropType<'default' | 'sm'>, default: 'default' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'section',
        {
          ...attrs,
          'data-slot': 'code-block',
          'data-variant': props.variant,
          'data-size': props.size,
          class: cn(
            'group/code-block relative min-w-0 overflow-hidden rounded-xl border bg-muted/40 text-foreground',
            props.variant === 'destructive' && 'border-destructive/30 bg-destructive/5',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const CodeBlockHeader = createPrimitive(
  'CodeBlockHeader',
  'header',
  'flex min-w-0 items-center justify-between gap-3 border-b border-border px-3 py-2',
  { 'data-slot': 'code-block-header' },
)
export const CodeBlockTitle = createPrimitive(
  'CodeBlockTitle',
  'div',
  'min-w-0 truncate text-sm font-medium',
  { 'data-slot': 'code-block-title' },
)
export const CodeBlockActions = createPrimitive(
  'CodeBlockActions',
  'div',
  'flex shrink-0 items-center gap-1',
  { 'data-slot': 'code-block-actions' },
)
export const CodeBlockFooter = createPrimitive(
  'CodeBlockFooter',
  'footer',
  'flex items-center border-t border-border px-3 py-2 text-xs text-muted-foreground',
  { 'data-slot': 'code-block-footer' },
)

export const CodeBlockContent = defineComponent({
  name: 'CodeBlockContent',
  inheritAttrs: false,
  props: {
    wrap: { type: Boolean, default: false },
    lineNumbers: { type: Boolean, default: false },
    startLine: { type: Number, default: 1 },
    tabIndex: { type: Number, default: 0 },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const children = slots.default?.() ?? []
      const textContent = getPlainText(children)
      const canNumber = props.lineNumbers && textContent !== undefined
      const lines = canNumber ? (textContent ?? '').replace(/\n$/, '').split('\n') : []
      return h(
        'pre',
        {
          ...attrs,
          dir: 'ltr',
          tabindex: props.tabIndex,
          'data-slot': 'code-block-content',
          'data-wrap': props.wrap ? 'true' : undefined,
          class: cn(
            'max-h-[32rem] min-w-0 overflow-auto p-3 font-mono text-xs leading-relaxed',
            props.wrap ? 'whitespace-pre-wrap break-words' : 'whitespace-pre',
            attrs.class,
          ),
        },
        [
          h(
            'code',
            { class: 'block min-w-0' },
            canNumber
              ? lines.map((line, index) =>
                  h('span', { class: 'flex min-h-5' }, [
                    h(
                      'span',
                      {
                        'aria-hidden': 'true',
                        class: 'me-4 w-8 shrink-0 select-none text-end text-muted-foreground/60',
                      },
                      String(props.startLine + index),
                    ),
                    h('span', { class: 'min-w-0' }, line || ' '),
                  ]),
                )
              : children,
          ),
        ],
      )
    }
  },
})

function getPlainText(nodes: VNode[]): string | undefined {
  let text = ''
  for (const node of nodes) {
    if (typeof node.children === 'string') {
      text += node.children
    } else if (Array.isArray(node.children)) {
      const nested = getPlainText(node.children as VNode[])
      if (nested === undefined) return undefined
      text += nested
    } else if (node.type !== Symbol.for('v-cmt')) {
      return undefined
    }
  }
  return text
}

export const CodeBlockLine = defineComponent({
  name: 'CodeBlockLine',
  inheritAttrs: false,
  props: {
    variant: {
      type: String as PropType<'default' | 'added' | 'removed' | 'highlighted'>,
      default: 'default',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'code-block-line',
          'data-variant': props.variant,
          class: cn(
            'min-h-5 whitespace-pre',
            props.variant === 'added' && 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
            props.variant === 'removed' && 'bg-destructive/10 text-destructive',
            props.variant === 'highlighted' && 'bg-primary/10',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const CodeBlockCopyButton = defineComponent({
  name: 'CodeBlockCopyButton',
  inheritAttrs: false,
  props: { value: { type: String, required: true } },
  emits: ['copied', 'error'],
  setup(props, { attrs, slots, emit }) {
    const copied = ref(false)
    let timeout: ReturnType<typeof setTimeout> | undefined
    onBeforeUnmount(() => {
      if (timeout) clearTimeout(timeout)
    })
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: 'button',
          'data-slot': 'code-block-copy-button',
          'aria-label': copied.value ? 'کپی شد' : 'کپی کد',
          class: cn(
            'inline-flex size-7 items-center justify-center rounded-md text-xs text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
            attrs.class,
          ),
          onClick: async (event: MouseEvent) => {
            try {
              await navigator.clipboard.writeText(props.value)
              copied.value = true
              emit('copied')
              if (timeout) clearTimeout(timeout)
              timeout = setTimeout(() => (copied.value = false), 1500)
            } catch (error) {
              emit('error', error)
            }
            const handler = attrs.onClick
            if (typeof handler === 'function') handler(event)
          },
        },
        [
          slots.default?.() ?? (copied.value ? 'کپی شد' : 'کپی'),
          h('span', { 'aria-live': 'polite', class: 'sr-only' }, copied.value ? 'کپی شد' : ''),
        ],
      )
  },
})
