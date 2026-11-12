import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

type BubbleVariant = 'default' | 'secondary' | 'muted' | 'tinted' | 'outline' | 'ghost' | 'destructive'

const bubbleVariants: Record<BubbleVariant, string> = {
  default: 'bg-primary text-primary-foreground',
  secondary: 'bg-secondary text-secondary-foreground',
  muted: 'bg-muted text-muted-foreground',
  tinted: 'bg-primary/10 text-foreground',
  outline: 'border border-border bg-background text-foreground',
  ghost: 'bg-transparent text-foreground',
  destructive: 'bg-destructive text-destructive-foreground',
}

export const Bubble = defineComponent({
  name: 'Bubble',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<BubbleVariant>, default: 'default' },
    align: { type: String as PropType<'start' | 'end'>, default: 'start' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'bubble',
          'data-align': props.align,
          'data-variant': props.variant,
          class: cn(
            'relative flex w-fit max-w-[80%] flex-col gap-2 rounded-2xl px-4 py-2.5 text-sm',
            props.variant === 'ghost' && 'max-w-full px-0 py-0',
            props.align === 'end' ? 'ms-auto' : 'me-auto',
            bubbleVariants[props.variant],
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const BubbleContent = defineComponent({
  name: 'BubbleContent',
  inheritAttrs: false,
  props: { as: { type: String, default: 'div' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          'data-slot': 'bubble-content',
          class: cn(
            'min-w-0 whitespace-pre-wrap',
            ['a', 'button'].includes(props.as) &&
              'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const BubbleReactions = defineComponent({
  name: 'BubbleReactions',
  inheritAttrs: false,
  props: {
    side: { type: String as PropType<'top' | 'bottom'>, default: 'bottom' },
    align: { type: String as PropType<'start' | 'end'>, default: 'end' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'bubble-reactions',
          'data-side': props.side,
          'data-align': props.align,
          class: cn(
            'absolute z-10 flex flex-wrap items-center gap-1 text-xs',
            props.side === 'bottom' ? '-bottom-3' : '-top-3',
            props.align === 'end' ? 'end-2' : 'start-2',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const BubbleGroup = createPrimitive(
  'BubbleGroup',
  'div',
  'flex min-w-0 flex-col gap-4',
  { 'data-slot': 'bubble-group' },
)
