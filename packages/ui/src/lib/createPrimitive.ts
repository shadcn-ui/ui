import { defineComponent, h } from 'vue'
import type { Component, HTMLAttributes } from 'vue'
import { cn } from '@saaze/utils'

export function createPrimitive(
  name: string,
  tag: string,
  className = '',
  defaultAttrs: Record<string, unknown> = {},
): Component {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      return () =>
        h(
          tag,
          {
            ...defaultAttrs,
            ...attrs,
            class: cn(className, attrs.class as HTMLAttributes['class']),
          },
          slots.default?.(),
        )
    },
  })
}
