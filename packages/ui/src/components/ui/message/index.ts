import { defineComponent, h } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const Message = defineComponent({
  name: 'Message',
  inheritAttrs: false,
  props: { align: { type: String, default: 'start' } },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        'article',
        {
          ...attrs,
          'data-message': '',
          'data-align': props.align,
          class: cn(
            'flex min-w-0 items-end gap-3',
            props.align === 'end' && 'flex-row-reverse',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})
export const MessageGroup = createPrimitive('MessageGroup', 'div', 'flex flex-col gap-4')
export const MessageAvatar = createPrimitive('MessageAvatar', 'div', 'shrink-0')
export const MessageContent = createPrimitive('MessageContent', 'div', 'grid min-w-0 max-w-full gap-1')
export const MessageHeader = createPrimitive(
  'MessageHeader',
  'header',
  'flex items-center gap-2 text-xs text-muted-foreground',
)
export const MessageFooter = createPrimitive(
  'MessageFooter',
  'footer',
  'flex items-center gap-2 text-xs text-muted-foreground',
)
