import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { cn } from '@saaze/utils'

type TypographyVariant = 'prose' | 'lead' | 'large' | 'small' | 'muted' | 'inlineCode'

const variantClasses: Record<TypographyVariant, string> = {
  prose: 'space-y-4 leading-7 [&_h1]:scroll-m-20 [&_h1]:text-3xl [&_h1]:font-bold [&_h2]:mt-10 [&_h2]:scroll-m-20 [&_h2]:border-b [&_h2]:pb-2 [&_h2]:text-2xl [&_h2]:font-semibold [&_p]:leading-7 [&_ul]:my-6 [&_ul]:list-disc [&_ul]:ps-6',
  lead: 'text-xl text-muted-foreground',
  large: 'text-lg font-semibold',
  small: 'text-sm font-medium leading-none',
  muted: 'text-sm text-muted-foreground',
  inlineCode: 'rounded bg-muted px-1.5 py-0.5 font-mono text-sm',
}

export const Typography = defineComponent({
  name: 'Typography',
  inheritAttrs: false,
  props: {
    variant: { type: String as PropType<TypographyVariant>, default: 'prose' },
    as: { type: String, default: 'div' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        { ...attrs, class: cn(variantClasses[props.variant], attrs.class) },
        slots.default?.(),
      )
  },
})
