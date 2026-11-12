import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { ChevronDown } from 'lucide-vue-next'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export const NativeSelect = defineComponent({
  name: 'NativeSelect',
  inheritAttrs: false,
  props: {
    modelValue: { type: [String, Number] as PropType<string | number>, default: undefined },
  },
  emits: ['update:modelValue'],
  setup(props, { attrs, slots, emit }) {
    return () =>
      h(
        'div',
        {
          'data-slot': 'native-select-wrapper',
          class: cn(
            'group/native-select relative inline-block w-full min-w-0 align-middle has-[select:disabled]:opacity-50',
            attrs.class,
          ),
        },
        [
          h(
            'select',
            {
              ...attrs,
              'data-slot': 'native-select',
              value: props.modelValue === undefined ? attrs.value : props.modelValue,
              class:
                'flex h-9 w-full appearance-none rounded-md border border-input bg-background px-3 py-1 pe-9 text-sm text-foreground shadow-sm outline-none transition-colors focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-destructive/20',
              onChange: (event: Event) => {
                emit('update:modelValue', (event.currentTarget as HTMLSelectElement).value)
                const handler = attrs.onChange
                if (typeof handler === 'function') handler(event)
              },
            },
            slots.default?.(),
          ),
          h(ChevronDown, {
            'aria-hidden': 'true',
            class:
              'pointer-events-none absolute end-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground',
          }),
        ],
      )
  },
})

export const NativeSelectOption = createPrimitive('NativeSelectOption', 'option')
export const NativeSelectOptGroup = createPrimitive('NativeSelectOptGroup', 'optgroup')
