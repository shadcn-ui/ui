import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const Attachment = defineComponent({
  name: 'Attachment',
  inheritAttrs: false,
  props: {
    state: {
      type: String as PropType<'idle' | 'uploading' | 'processing' | 'error' | 'done'>,
      default: 'done',
    },
    size: { type: String as PropType<'default' | 'sm' | 'xs'>, default: 'default' },
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'attachment',
          'data-state': props.state,
          'data-size': props.size,
          'data-orientation': props.orientation,
          'aria-busy': ['uploading', 'processing'].includes(props.state) ? 'true' : undefined,
          class: cn(
            'group/attachment relative flex max-w-full min-w-0 shrink-0 flex-wrap gap-2 rounded-2xl border bg-card p-2.5 text-sm text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/30 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed',
            props.orientation === 'vertical' && 'flex-col',
            props.size === 'sm' && 'gap-1.5 p-2 text-xs',
            props.size === 'xs' && 'gap-1 p-1.5 text-xs',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const AttachmentMedia = defineComponent({
  name: 'AttachmentMedia',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<'icon' | 'image'>, default: 'icon' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'attachment-media',
          'data-variant': props.variant,
          class: cn(
            'relative z-10 flex aspect-square w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted text-foreground group-data-[orientation=vertical]/attachment:w-full group-data-[size=sm]/attachment:w-8 group-data-[size=xs]/attachment:w-7 group-data-[size=xs]/attachment:rounded-md group-data-[state=error]/attachment:bg-destructive/10 group-data-[state=error]/attachment:text-destructive [&_svg]:pointer-events-none [&_svg:not([class*="size-"])]:size-4 group-data-[orientation=vertical]/attachment:[&_svg:not([class*="size-"])]:size-6 group-data-[size=xs]/attachment:[&_svg:not([class*="size-"])]:size-3.5 opacity-60 group-data-[state=done]/attachment:opacity-100 group-data-[state=idle]/attachment:opacity-100 [&_img]:aspect-square [&_img]:w-full [&_img]:object-cover',
            props.variant === 'image' && 'bg-transparent p-0 opacity-100',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const AttachmentContent = createPrimitive(
  'AttachmentContent',
  'div',
  'relative z-10 max-w-full min-w-0 flex-1 leading-tight group-data-[orientation=vertical]/attachment:px-1',
  { 'data-slot': 'attachment-content' },
)
export const AttachmentTitle = createPrimitive(
  'AttachmentTitle',
  'span',
  'block max-w-full min-w-0 truncate font-medium group-data-[state=processing]/attachment:animate-pulse group-data-[state=uploading]/attachment:animate-pulse',
  { 'data-slot': 'attachment-title' },
)
export const AttachmentDescription = createPrimitive(
  'AttachmentDescription',
  'span',
  'mt-0.5 block min-w-0 max-w-full truncate text-xs text-muted-foreground group-data-[state=error]/attachment:text-destructive/80',
  { 'data-slot': 'attachment-description' },
)
export const AttachmentActions = createPrimitive(
  'AttachmentActions',
  'div',
  'relative z-10 flex shrink-0 items-center gap-1',
  { 'data-slot': 'attachment-actions' },
)
export const AttachmentAction = createPrimitive(
  'AttachmentAction',
  'button',
  'group/button inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-transparent text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  { type: 'button', 'data-slot': 'attachment-action' },
)
export const AttachmentTrigger = defineComponent({
  name: 'AttachmentTrigger',
  inheritAttrs: false,
  props: { as: { type: String, default: 'button' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          type: props.as === 'button' ? attrs.type ?? 'button' : undefined,
          'data-slot': 'attachment-trigger',
          'aria-label': attrs['aria-label'] ?? 'بازکردن پیوست',
          class: cn(
            'absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})
export const AttachmentGroup = createPrimitive(
  'AttachmentGroup',
  'div',
  'flex min-w-0 max-w-full snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain py-1 [scroll-padding-inline:0.25rem] [&>*]:shrink-0 [&>*]:snap-start',
  { 'data-slot': 'attachment-group' },
)
