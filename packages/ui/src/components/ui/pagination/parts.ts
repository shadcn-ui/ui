import { defineComponent, h } from 'vue'
import type { PropType } from 'vue'
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-vue-next'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'
import { buttonVariants, type ButtonVariants } from '../button/variants'

/**
 * اجزای ترکیب‌پذیر صفحه‌بندی هم‌خوان با shadcn. برای صفحه‌بندی آماده با منطق
 * محاسبه صفحه‌ها از `Pagination` استفاده کنید.
 */
export const PaginationRoot = createPrimitive(
  'PaginationRoot',
  'nav',
  'mx-auto flex w-full justify-center',
  { role: 'navigation', 'aria-label': 'صفحه‌بندی', 'data-slot': 'pagination' },
)

export const PaginationContent = createPrimitive(
  'PaginationContent',
  'ul',
  'flex flex-row items-center gap-1',
  { 'data-slot': 'pagination-content' },
)

export const PaginationItem = createPrimitive('PaginationItem', 'li', '', {
  'data-slot': 'pagination-item',
})

export const PaginationLink = defineComponent({
  name: 'PaginationLink',
  inheritAttrs: false,
  props: {
    isActive: { type: Boolean, default: false },
    size: { type: String as PropType<ButtonVariants['size']>, default: 'icon' },
    as: { type: String, default: 'a' },
  },
  setup(props, { attrs, slots }) {
    return () =>
      h(
        props.as,
        {
          ...attrs,
          type: props.as === 'button' ? (attrs.type ?? 'button') : undefined,
          'aria-current': props.isActive ? 'page' : undefined,
          'data-slot': 'pagination-link',
          'data-active': props.isActive ? 'true' : undefined,
          class: cn(
            buttonVariants({ variant: props.isActive ? 'outline' : 'ghost', size: props.size }),
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

function createDirectionalLink(name: string, previous: boolean) {
  return defineComponent({
    name,
    inheritAttrs: false,
    props: {
      as: { type: String, default: 'a' },
      label: { type: String, default: previous ? 'قبلی' : 'بعدی' },
    },
    setup(props, { attrs, slots }) {
      // آیکون LTR است و در محیط RTL (dir="rtl" روی والد) آینه می‌شود.
      const icon = () =>
        h(previous ? ChevronLeft : ChevronRight, {
          'aria-hidden': 'true',
          class: 'rtl:rotate-180',
        })
      return () =>
        h(
          PaginationLink,
          {
            ...attrs,
            as: props.as,
            size: 'default',
            'aria-label':
              attrs['aria-label'] ?? (previous ? 'رفتن به صفحه قبلی' : 'رفتن به صفحه بعدی'),
            class: cn('gap-1 px-2.5', previous ? 'sm:ps-2.5' : 'sm:pe-2.5', attrs.class),
          },
          {
            default: () =>
              slots.default?.() ??
              (previous
                ? [icon(), h('span', { class: 'hidden sm:block' }, props.label)]
                : [h('span', { class: 'hidden sm:block' }, props.label), icon()]),
          },
        )
    },
  })
}

export const PaginationPrevious = createDirectionalLink('PaginationPrevious', true)
export const PaginationNext = createDirectionalLink('PaginationNext', false)

export const PaginationEllipsis = defineComponent({
  name: 'PaginationEllipsis',
  inheritAttrs: false,
  setup(_, { attrs }) {
    return () =>
      h(
        'span',
        {
          ...attrs,
          'aria-hidden': 'true',
          'data-slot': 'pagination-ellipsis',
          class: cn('flex size-9 items-center justify-center', attrs.class),
        },
        [h(MoreHorizontal, { class: 'size-4' }), h('span', { class: 'sr-only' }, 'صفحه‌های بیشتر')],
      )
  },
})
