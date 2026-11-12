import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

/**
 * گروه ورودی مطابق shadcn: افزونه‌ها در جریان flex قرار می‌گیرند (نه absolute)، پس
 * فاصله‌گذاری در RTL و LTR بدون پدینگ ثابت درست است.
 */
export const InputGroup = createPrimitive(
  'InputGroup',
  'div',
  [
    'group/input-group relative flex h-10 w-full min-w-0 items-center rounded-md border border-input bg-background shadow-sm outline-none transition-[color,box-shadow]',
    'has-[>textarea]:h-auto',
    'has-[>[data-align=inline-start]]:[&>input]:ps-2 has-[>[data-align=inline-end]]:[&>input]:pe-2',
    'has-[>[data-align=block-start]]:h-auto has-[>[data-align=block-start]]:flex-col has-[>[data-align=block-start]]:[&>input]:pb-3',
    'has-[>[data-align=block-end]]:h-auto has-[>[data-align=block-end]]:flex-col has-[>[data-align=block-end]]:[&>input]:pt-3',
    'has-[[data-slot=input-group-control]:focus-visible]:ring-2 has-[[data-slot=input-group-control]:focus-visible]:ring-ring has-[[data-slot=input-group-control]:focus-visible]:ring-offset-2 ring-offset-background',
    'has-[[data-slot][aria-invalid=true]]:border-destructive has-[[data-slot][aria-invalid=true]]:ring-destructive',
    'has-[[data-slot=input-group-control]:disabled]:opacity-50',
  ].join(' '),
  { 'data-slot': 'input-group', role: 'group' },
)

export const InputGroupInput = createPrimitive(
  'InputGroupInput',
  'input',
  'h-full min-w-0 flex-1 rounded-none border-0 bg-transparent px-3 py-2 text-sm shadow-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
  { 'data-slot': 'input-group-control' },
)

export const InputGroupTextarea = createPrimitive(
  'InputGroupTextarea',
  'textarea',
  'min-h-16 w-full min-w-0 flex-1 resize-none rounded-none border-0 bg-transparent px-3 py-3 text-sm shadow-none outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed',
  { 'data-slot': 'input-group-control' },
)

const addonAlignClasses = {
  'inline-start': 'order-first ps-3 has-[>button]:-ms-1.5 has-[>kbd]:-ms-1',
  'inline-end': 'order-last pe-3 has-[>button]:-me-1.5 has-[>kbd]:-me-1',
  'block-start':
    'order-first w-full justify-start px-3 pt-3 group-has-[>input]/input-group:pt-2.5 [.border-b]:pb-3',
  'block-end':
    'order-last w-full justify-start px-3 pb-3 group-has-[>input]/input-group:pb-2.5 [.border-t]:pt-3',
} as const

export const InputGroupAddon = defineComponent({
  name: 'InputGroupAddon',
  inheritAttrs: false,
  props: {
    align: {
      type: String as PropType<keyof typeof addonAlignClasses>,
      default: 'inline-start',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'group',
          'data-slot': 'input-group-addon',
          'data-align': props.align,
          class: cn(
            'flex h-auto cursor-text select-none items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground [&>svg:not([class*=size-])]:size-4',
            addonAlignClasses[props.align],
            attrs.class,
          ),
          onClick: (event: MouseEvent) => {
            const target = event.target as HTMLElement
            // کلیک روی افزونه (نه دکمه داخل آن) فوکوس را به ورودی می‌برد.
            if (!target.closest('button')) {
              const group = (event.currentTarget as HTMLElement).parentElement
              group?.querySelector<HTMLElement>('[data-slot=input-group-control]')?.focus()
            }
            const handler = attrs.onClick
            if (typeof handler === 'function') handler(event)
          },
        },
        slots.default?.(),
      )
  },
})

export const InputGroupText = createPrimitive(
  'InputGroupText',
  'span',
  'flex items-center gap-2 text-sm text-muted-foreground [&_svg:not([class*=size-])]:size-4 [&_svg]:pointer-events-none',
  { 'data-slot': 'input-group-text' },
)

const buttonVariants: Record<string, string> = {
  default: 'bg-primary text-primary-foreground hover:bg-primary/90',
  destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
}

const buttonSizes: Record<string, string> = {
  xs: 'h-6 gap-1 rounded-[calc(var(--radius)-5px)] px-2 text-xs [&>svg:not([class*=size-])]:size-3.5',
  'icon-xs': 'size-6 rounded-[calc(var(--radius)-5px)] p-0',
  sm: 'h-8 gap-1.5 rounded-md px-2.5 text-sm',
  'icon-sm': 'size-8 p-0',
}

export const InputGroupButton = defineComponent({
  name: 'InputGroupButton',
  inheritAttrs: false,
  props: {
    size: { type: String as PropType<'xs' | 'icon-xs' | 'sm' | 'icon-sm'>, default: 'xs' },
    variant: {
      type: String as PropType<
        'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
      >,
      default: 'ghost',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'button',
        {
          ...attrs,
          type: attrs.type ?? 'button',
          'data-slot': 'input-group-button',
          'data-size': props.size,
          'data-variant': props.variant,
          class: cn(
            'inline-flex shrink-0 items-center justify-center gap-2 font-medium shadow-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
            buttonSizes[props.size],
            buttonVariants[props.variant],
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})
