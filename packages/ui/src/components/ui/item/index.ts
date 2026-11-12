import { defineComponent, h } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const Item = defineComponent({
  name: 'Item',
  inheritAttrs: false,
  props: {
    variant: { type: String, default: 'default' },
    size: { type: String, default: 'default' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-variant': props.variant,
          'data-size': props.size,
          class: cn(
            'flex min-w-0 items-center gap-3 rounded-lg p-4',
            props.variant === 'outline' && 'border border-border',
            props.variant === 'muted' && 'bg-muted',
            props.size === 'sm' && 'gap-2 p-3',
            props.size === 'xs' && 'gap-2 p-2',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})
export const ItemGroup = createPrimitive('ItemGroup', 'div', 'flex min-w-0 flex-col gap-2')
export const ItemSeparator = createPrimitive('ItemSeparator', 'div', 'h-px w-full bg-border', {
  role: 'separator',
})
export const ItemMedia = createPrimitive(
  'ItemMedia',
  'div',
  'flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted text-muted-foreground [&>img]:size-full [&>img]:object-cover [&>svg]:size-5',
)
export const ItemContent = createPrimitive('ItemContent', 'div', 'grid min-w-0 flex-1 gap-1')
export const ItemTitle = createPrimitive('ItemTitle', 'div', 'truncate text-sm font-medium')
export const ItemDescription = createPrimitive(
  'ItemDescription',
  'p',
  'text-sm text-muted-foreground',
)
export const ItemActions = createPrimitive('ItemActions', 'div', 'ms-auto flex shrink-0 items-center gap-2')
export const ItemHeader = createPrimitive(
  'ItemHeader',
  'div',
  'flex w-full items-center justify-between gap-2',
)
export const ItemFooter = createPrimitive('ItemFooter', 'div', 'w-full border-t border-border pt-3')
