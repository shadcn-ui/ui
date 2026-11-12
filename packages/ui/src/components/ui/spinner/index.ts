import { defineComponent, h } from 'vue'
import { LoaderCircle } from 'lucide-vue-next'
import { cn } from '@saaze/utils'

export const Spinner = defineComponent({
  name: 'Spinner',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(LoaderCircle, {
        ...attrs,
        role: 'status',
        'aria-label':
          typeof attrs['aria-label'] === 'string' ? attrs['aria-label'] : 'در حال بارگذاری',
        'data-slot': 'spinner',
        class: cn('size-4 animate-spin', attrs.class),
      })
  },
})
