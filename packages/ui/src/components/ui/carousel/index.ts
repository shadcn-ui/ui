import { computed, defineComponent, h, inject, onBeforeUnmount, provide, ref, watch } from 'vue'
import type { InjectionKey, PropType, Ref } from 'vue'
import useEmblaCarousel from 'embla-carousel-vue'
import type { EmblaCarouselType, EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp } from 'lucide-vue-next'
import { cn } from '@saaze/utils'
import { useResolvedDirection, type Direction } from '../../../lib/rtl'

interface CarouselContext {
  emblaRef: Ref<HTMLElement | undefined>
  api: Ref<EmblaCarouselType | undefined>
  orientation: Ref<'horizontal' | 'vertical'>
  direction: Ref<Direction>
  canScrollPrev: Ref<boolean>
  canScrollNext: Ref<boolean>
  scrollPrev: () => void
  scrollNext: () => void
}

const CAROUSEL_KEY: InjectionKey<CarouselContext> = Symbol('saaze-carousel')

export type CarouselApi = EmblaCarouselType

export const Carousel = defineComponent({
  name: 'Carousel',
  inheritAttrs: false,
  props: {
    orientation: { type: String as PropType<'horizontal' | 'vertical'>, default: 'horizontal' },
    opts: { type: Object as PropType<EmblaOptionsType>, default: () => ({}) },
    plugins: { type: Array as PropType<EmblaPluginType[]>, default: () => [] },
    dir: { type: String as PropType<'ltr' | 'rtl'>, default: undefined },
    setApi: {
      type: Function as PropType<(api: EmblaCarouselType | undefined) => void>,
      default: undefined,
    },
  },
  emits: ['init', 'select', 'reInit'],
  setup(props, { attrs, slots, emit }) {
    const orientation = computed(() => props.orientation)
    const direction = useResolvedDirection(() => props.dir ?? props.opts.direction)
    const options = ref<EmblaOptionsType>({
      ...props.opts,
      axis: props.orientation === 'vertical' ? 'y' : 'x',
      direction: direction.value,
    })
    watch([orientation, direction, () => props.opts], () => {
      options.value = {
        ...props.opts,
        axis: props.orientation === 'vertical' ? 'y' : 'x',
        direction: direction.value,
      }
    })
    const [emblaRef, api] = useEmblaCarousel(
      options,
      computed(() => props.plugins),
    )
    const canScrollPrev = ref(false)
    const canScrollNext = ref(false)

    const updateControls = () => {
      canScrollPrev.value = api.value?.canScrollPrev() ?? false
      canScrollNext.value = api.value?.canScrollNext() ?? false
      emit('select', api.value)
    }
    const scrollPrev = () => api.value?.scrollPrev()
    const scrollNext = () => api.value?.scrollNext()

    watch(
      api,
      (instance, previous) => {
        previous?.off('select', updateControls)
        previous?.off('reInit', updateControls)
        if (instance) {
          instance.on('select', updateControls)
          instance.on('reInit', updateControls)
          updateControls()
          props.setApi?.(instance)
          emit('init', instance)
        } else {
          props.setApi?.(undefined)
        }
      },
      { immediate: true },
    )

    onBeforeUnmount(() => {
      props.setApi?.(undefined)
    })

    provide(CAROUSEL_KEY, {
      emblaRef,
      api,
      orientation,
      direction,
      canScrollPrev,
      canScrollNext,
      scrollPrev,
      scrollNext,
    })

    return () =>
      h(
        'div',
        {
          ...attrs,
          dir: direction.value,
          role: 'region',
          'aria-roledescription': 'carousel',
          'data-slot': 'carousel',
          'data-orientation': props.orientation,
          class: cn('group/carousel relative min-w-0', attrs.class),
          onKeydownCapture: (event: KeyboardEvent) => {
            const vertical = props.orientation === 'vertical'
            const rtl = direction.value === 'rtl'
            const prevKey = vertical ? 'ArrowUp' : rtl ? 'ArrowRight' : 'ArrowLeft'
            const nextKey = vertical ? 'ArrowDown' : rtl ? 'ArrowLeft' : 'ArrowRight'
            if (event.key === prevKey) {
              event.preventDefault()
              scrollPrev()
            } else if (event.key === nextKey) {
              event.preventDefault()
              scrollNext()
            }
          },
        },
        slots.default?.(),
      )
  },
})

export const CarouselContent = defineComponent({
  name: 'CarouselContent',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const context = injectCarousel('CarouselContent')
    return () =>
      h(
        'div',
        {
          ...Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'class')),
          ref: context.emblaRef,
          'data-slot': 'carousel-content',
          class: cn(
            'overflow-hidden',
            context.orientation.value === 'horizontal' ? 'touch-pan-y' : 'touch-pan-x',
          ),
        },
        [
          h(
            'div',
            {
              class: cn(
                'flex',
                context.orientation.value === 'horizontal'
                  ? 'ms-[-0.5rem]'
                  : 'mt-[-0.5rem] flex-col',
                attrs.class,
              ),
            },
            slots.default?.(),
          ),
        ],
      )
  },
})

export const CarouselItem = defineComponent({
  name: 'CarouselItem',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const context = injectCarousel('CarouselItem')
    return () =>
      h(
        'div',
        {
          ...attrs,
          'data-slot': 'carousel-item',
          role: 'group',
          'aria-roledescription': 'slide',
          class: cn(
            'min-w-0 shrink-0 grow-0 basis-full',
            context.orientation.value === 'horizontal' ? 'ps-2' : 'pt-2',
            attrs.class,
          ),
        },
        slots.default?.(),
      )
  },
})

function createCarouselControl(name: string, previous: boolean) {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const context = injectCarousel(name)
      return () =>
        h(
          'button',
          {
            ...attrs,
            type: 'button',
            'data-slot': previous ? 'carousel-previous' : 'carousel-next',
            'aria-label': attrs['aria-label'] ?? (previous ? 'اسلاید قبلی' : 'اسلاید بعدی'),
            disabled:
              attrs.disabled ??
              !(previous ? context.canScrollPrev.value : context.canScrollNext.value),
            class: cn(
              'absolute inline-flex size-8 items-center justify-center rounded-full border border-input bg-background text-foreground shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
              context.orientation.value === 'horizontal'
                ? cn('top-1/2 -translate-y-1/2', previous ? '-start-12' : '-end-12')
                : cn(
                    'start-1/2 -translate-x-1/2 rtl:translate-x-1/2',
                    previous ? '-top-12' : '-bottom-12',
                  ),
              attrs.class,
            ),
            onClick: (event: MouseEvent) => {
              if (previous) context.scrollPrev()
              else context.scrollNext()
              const handler = attrs.onClick
              if (typeof handler === 'function') handler(event)
            },
          },
          slots.default?.() ?? [
            h(
              // «قبلی» در RTL به سمت راست و در LTR به سمت چپ اشاره می‌کند.
              context.orientation.value === 'vertical'
                ? previous
                  ? ArrowUp
                  : ArrowDown
                : previous === (context.direction.value === 'rtl')
                  ? ArrowRight
                  : ArrowLeft,
              { 'aria-hidden': 'true' },
            ),
          ],
        )
    },
  })
}

function injectCarousel(name: string): CarouselContext {
  const context = inject(CAROUSEL_KEY)
  if (!context) throw new Error(`${name} must be used inside Carousel.`)
  return context
}

export const CarouselPrevious = createCarouselControl('CarouselPrevious', true)
export const CarouselNext = createCarouselControl('CarouselNext', false)
