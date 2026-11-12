import { defineComponent, h } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const Marker = defineComponent({
  name: 'Marker',
  inheritAttrs: false,
  props: { variant: { type: String, default: 'default' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-variant': props.variant,
          class: cn(
            'flex min-w-0 items-center gap-2 text-sm text-muted-foreground',
            props.variant === 'border' && 'border-b border-border py-3',
            props.variant === 'separator' &&
              'before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})
export const MarkerIcon = createPrimitive(
  'MarkerIcon',
  'span',
  'inline-flex shrink-0 items-center justify-center [&>svg]:size-4',
  { 'aria-hidden': 'true' },
)
export const MarkerContent = createPrimitive('MarkerContent', 'span', 'min-w-0')
