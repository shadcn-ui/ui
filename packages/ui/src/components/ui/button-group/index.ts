import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const ButtonGroup = defineComponent({
  name: 'ButtonGroup',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'button-group',
          'data-orientation': props.orientation,
          role: 'group',
          'aria-orientation': props.orientation,
          class: cn(
            'inline-flex w-fit items-stretch',
            props.orientation === 'vertical'
              ? 'flex-col [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none [&>*:not(:last-child)]:border-b-0'
              : '[&>*:not(:first-child)]:rounded-s-none [&>*:not(:last-child)]:rounded-e-none [&>*:not(:last-child)]:border-e-0',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const ButtonGroupSeparator = defineComponent({
  name: 'ButtonGroupSeparator',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'vertical' },
  },
  setup(props, { attrs }) {
    return () =>
      h('div', {
        ...attrs,
        'data-slot': 'button-group-separator',
        role: 'separator',
        'aria-orientation': props.orientation,
        class: cn(
          'shrink-0 bg-border',
          props.orientation === 'vertical' ? 'mx-0.5 w-px self-stretch' : 'my-0.5 h-px w-full',
          attrs.class,
        ),
      })
  },
})

export const ButtonGroupText = createPrimitive(
  'ButtonGroupText',
  'span',
  'inline-flex items-center bg-muted px-3 text-sm text-muted-foreground',
  { 'data-slot': 'button-group-text' },
)
