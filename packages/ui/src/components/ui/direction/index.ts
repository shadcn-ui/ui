import { computed, defineComponent, h, provide } from 'vue'
import type { ComputedRef, PropType } from 'vue'
import { ConfigProvider } from 'radix-vue'
import { createPrimitive } from '../../../lib/createPrimitive'
import { saazeDirectionKey, useSaazeDirection, type Direction } from '../../../lib/rtl'

export type { Direction }

/**
 * جهت نوشتار را برای همه مؤلفه‌های سازه و Radix داخل این ناحیه تعیین می‌کند و
 * خود ناحیه را با ویژگی `dir` می‌پوشاند تا چیدمان CSS منطقی هم درست شود.
 */
export const DirectionProvider = defineComponent({
  name: 'DirectionProvider',
  inheritAttrs: false,
  props: {
    /** نام هم‌خوان با shadcn/ui */
    dir: { type: String as PropType<Direction>, default: undefined },
    /** نام قدیمی؛ همچنان پشتیبانی می‌شود */
    direction: { type: String as PropType<Direction>, default: undefined },
    /** اگر `true` باشد عنصر پوشاننده رندر نمی‌شود و فقط context فراهم می‌شود. */
    asChild: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const inherited = useSaazeDirection()
    const direction = computed<Direction>(() => props.dir ?? props.direction ?? inherited.value)
    provide(saazeDirectionKey, direction)
    return () =>
      h(
        ConfigProvider,
        { dir: direction.value },
        {
          default: () =>
            props.asChild
              ? slots.default?.()
              : h('div', { ...attrs, dir: direction.value }, slots.default?.()),
        },
      )
  },
})

/** جهت فعال را به‌صورت واکنشی برمی‌گرداند. */
export function useDirection(): ComputedRef<Direction> {
  return useSaazeDirection()
}

export const DirectionContent = createPrimitive('DirectionContent', 'div', 'min-w-0')
