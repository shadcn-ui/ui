import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const Field = defineComponent({
  name: 'Field',
  inheritAttrs: false,
  props: {
    orientation: {
      type: String as PropType<'vertical' | 'horizontal' | 'responsive'>,
      default: 'vertical',
    },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'field',
          'data-orientation': props.orientation,
          role: 'group',
          class: cn(
            'group/field flex w-full min-w-0 gap-3',
            props.orientation === 'vertical' && 'flex-col',
            props.orientation === 'horizontal' && 'flex-row items-center',
            props.orientation === 'responsive' &&
              '@container/field-group flex-col @sm/field-group:flex-row @sm/field-group:items-center',
            Boolean(attrs['data-invalid']) && '[&_[data-slot=field-label]]:text-destructive',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const FieldGroup = createPrimitive(
  'FieldGroup',
  'div',
  '@container/field-group flex min-w-0 flex-col gap-6',
  { 'data-slot': 'field-group' },
)
export const FieldSet = createPrimitive(
  'FieldSet',
  'fieldset',
  'flex min-w-0 flex-col gap-6 border-0 p-0',
  { 'data-slot': 'field-set' },
)

export const FieldLegend = defineComponent({
  name: 'FieldLegend',
  inheritAttrs: false,
  props: { variant: { type: String as PropType<'legend' | 'label'>, default: 'legend' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'legend',
        {
          ...attrs,
          'data-slot': 'field-legend',
          'data-variant': props.variant,
          class: cn(
            props.variant === 'legend'
              ? 'mb-1 text-base font-semibold'
              : 'text-sm font-medium leading-none',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

export const FieldContent = createPrimitive(
  'FieldContent',
  'div',
  'grid min-w-0 flex-1 gap-1',
  { 'data-slot': 'field-content' },
)
export const FieldLabel = createPrimitive(
  'FieldLabel',
  'label',
  'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
  { 'data-slot': 'field-label' },
)
export const FieldTitle = createPrimitive(
  'FieldTitle',
  'div',
  'text-sm font-medium',
  { 'data-slot': 'field-title' },
)
export const FieldDescription = createPrimitive(
  'FieldDescription',
  'p',
  'text-sm leading-relaxed text-muted-foreground',
  { 'data-slot': 'field-description' },
)

export const FieldSeparator = defineComponent({
  name: 'FieldSeparator',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'field-separator',
          role: slots.default ? undefined : 'separator',
          class: cn(
            'relative my-1 flex min-h-5 w-full items-center justify-center text-xs text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border',
            attrs.class,
          ),
        },
        slots.default ? [h('span', { class: 'bg-background px-2' }, slots.default())] : [],
      )
  },
})

export const FieldError = defineComponent({
  name: 'FieldError',
  inheritAttrs: false,
  props: {
    errors: {
      type: Array as PropType<Array<{ message?: string } | undefined>>,
      default: undefined,
    },
    issues: {
      type: Array as PropType<Array<{ message?: string } | undefined>>,
      default: undefined,
    },
  },
  setup(props, { attrs, slots }) {
    return () => {
      const messages = [...(props.errors ?? []), ...(props.issues ?? [])]
        .map((error) => error?.message)
        .filter((message): message is string => Boolean(message))
      const content = slots.default?.()
      if (!content?.length && messages.length === 0) return null
      return h(
        messages.length > 1 && !content?.length ? 'ul' : 'p',
        {
          ...attrs,
          'data-slot': 'field-error',
          role: 'alert',
          class: cn('text-sm font-medium text-destructive', attrs.class),
        },
        content?.length
          ? content
          : messages.map((message, index) =>
              h('li', { key: index, class: messages.length > 1 ? 'ms-4 list-disc' : undefined }, message),
            ),
      )
    }
  },
})
