import { computed, defineComponent, h, inject, provide, ref } from 'vue'
import type { InjectionKey, PropType, Ref } from 'vue'
import { cn } from '@saaze/utils'
import { createPrimitive } from '../../../lib/createPrimitive'

export interface QuestionnaireItemData {
  name: string
  required?: boolean
}

interface QuestionnaireContext {
  items: Readonly<Ref<QuestionnaireItemData[]>>
  activeIndex: Ref<number>
  error: Ref<string>
  form: Ref<HTMLFormElement | undefined>
  progress: Readonly<Ref<number>>
  isLast: Readonly<Ref<boolean>>
  currentItem: Readonly<Ref<QuestionnaireItemData | undefined>>
  isActive: (name?: string, index?: number) => boolean
  next: () => void
  previous: () => void
  skip: () => void
  itemName: Ref<string | undefined>
}

const QUESTIONNAIRE_KEY: InjectionKey<QuestionnaireContext> = Symbol('saaze-questionnaire')
const QUESTIONNAIRE_ITEM_KEY: InjectionKey<Ref<string | undefined>> = Symbol(
  'saaze-questionnaire-item',
)

export const Questionnaire = defineComponent({
  name: 'Questionnaire',
  inheritAttrs: false,
  props: {
    items: { type: Array as PropType<QuestionnaireItemData[]>, default: () => [] },
    modelValue: { type: Number, default: undefined },
    defaultValue: { type: Number, default: 0 },
  },
  emits: ['update:modelValue', 'next', 'previous', 'skip', 'invalid'],
  setup(props, { attrs, slots, emit }) {
    const form = ref<HTMLFormElement>()
    const localIndex = ref(props.defaultValue)
    const activeIndex = computed({
      get: () => props.modelValue ?? localIndex.value,
      set: (value: number) => {
        localIndex.value = value
        emit('update:modelValue', value)
      },
    })
    const error = ref('')
    const progress = computed(() =>
      props.items.length ? Math.min(100, ((activeIndex.value + 1) / props.items.length) * 100) : 0,
    )
    const isLast = computed(
      () => props.items.length > 0 && activeIndex.value >= props.items.length - 1,
    )
    const currentItem = computed(() => props.items[activeIndex.value])
    const itemName = ref<string>()
    const isActive = (name?: string, index?: number) => {
      if (!props.items.length) return true
      const currentItem = props.items[activeIndex.value]
      if (!currentItem) return false
      return name ? currentItem.name === name : index === activeIndex.value
    }

    const next = () => {
      const currentItem = props.items[activeIndex.value]
      if (!currentItem) return
      if (currentItem.required) {
        const values = form.value ? new FormData(form.value).getAll(currentItem.name) : []
        if (!values.some((value) => String(value).trim())) {
          error.value = 'لطفاً برای ادامه به این پرسش پاسخ دهید.'
          emit('invalid', currentItem.name)
          const firstControl = Array.from(form.value?.elements ?? []).find(
            (element) => element.getAttribute('name') === currentItem.name,
          )
          if (firstControl instanceof HTMLElement) firstControl.focus()
          return
        }
      }
      error.value = ''
      if (!isLast.value) {
        activeIndex.value += 1
        emit('next', currentItem.name)
      }
    }
    const previous = () => {
      error.value = ''
      if (activeIndex.value > 0) {
        activeIndex.value -= 1
        emit('previous', props.items[activeIndex.value]?.name)
      }
    }
    const skip = () => {
      const currentItem = props.items[activeIndex.value]
      error.value = ''
      if (!isLast.value) activeIndex.value += 1
      emit('skip', currentItem?.name)
    }

    provide(QUESTIONNAIRE_KEY, {
      items: computed(() => props.items),
      activeIndex,
      error,
      form,
      progress,
      isLast,
      currentItem,
      isActive,
      next,
      previous,
      skip,
      itemName,
    })

    return () =>
      h(
        'form',
        {
          ...attrs,
          ref: form,
          'data-slot': 'questionnaire',
          class: cn('grid min-w-0 gap-6', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export const QuestionnaireItem = defineComponent({
  name: 'QuestionnaireItem',
  inheritAttrs: false,
  props: {
    name: { type: String, default: undefined },
    required: { type: Boolean, default: false },
  },
  setup(props, { attrs, slots }) {
    const context = inject(QUESTIONNAIRE_KEY)
    const index = computed(
      () => context?.items.value.findIndex((item) => item.name === props.name) ?? -1,
    )
    const isActive = computed(() => context?.isActive(props.name, index.value) ?? true)
    const name = computed(() => props.name)
    provide(QUESTIONNAIRE_ITEM_KEY, name)
    return () =>
      h(
        'fieldset',
        {
          ...attrs,
          'data-slot': 'questionnaire-item',
          'data-active': isActive.value ? 'true' : 'false',
          'aria-hidden': isActive.value ? undefined : 'true',
          hidden: !isActive.value,
          disabled: !isActive.value,
          class: cn('grid min-w-0 gap-4 border-0 p-0', attrs.class),
        },
        slots.default?.(),
      )
  },
})

export const QuestionnaireTitle = createPrimitive(
  'QuestionnaireTitle',
  'legend',
  'text-base font-semibold',
  { 'data-slot': 'questionnaire-title' },
)
export const QuestionnaireDescription = createPrimitive(
  'QuestionnaireDescription',
  'p',
  'text-sm text-muted-foreground',
  { 'data-slot': 'questionnaire-description' },
)
export const QuestionnaireChoices = createPrimitive('QuestionnaireChoices', 'div', 'grid gap-2', {
  'data-slot': 'questionnaire-choices',
})

export const QuestionnaireChoice = defineComponent({
  name: 'QuestionnaireChoice',
  inheritAttrs: false,
  props: {
    value: { type: String, required: true },
    name: { type: String, default: undefined },
    type: { type: String as PropType<'radio' | 'checkbox'>, default: 'radio' },
  },
  setup(props, { attrs, slots }) {
    const itemName = inject(QUESTIONNAIRE_ITEM_KEY, ref())
    return () =>
      h(
        'label',
        {
          'data-slot': 'questionnaire-choice',
          class: cn(
            'flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 text-sm transition-colors hover:bg-accent/50 has-[:checked]:border-primary has-[:checked]:bg-primary/5',
            attrs.class,
          ),
        },
        [
          h('input', {
            ...attrs,
            class: 'mt-0.5 accent-primary',
            type: props.type,
            name: props.name ?? itemName.value ?? 'answer',
            value: props.value,
          }),
          h('span', { class: 'min-w-0 flex-1' }, slots.default?.()),
        ],
      )
  },
})

export const QuestionnaireInput = defineComponent({
  name: 'QuestionnaireInput',
  inheritAttrs: false,
  props: { name: { type: String, default: undefined } },
  setup(props, { attrs }) {
    const itemName = inject(QUESTIONNAIRE_ITEM_KEY, ref())
    return () =>
      h('input', {
        ...attrs,
        name: props.name ?? itemName.value ?? 'answer',
        'data-slot': 'questionnaire-input',
        class: cn(
          'h-10 w-full rounded-md border border-input bg-background px-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring aria-[invalid=true]:border-destructive',
          attrs.class,
        ),
      })
  },
})

export const QuestionnaireProgress = defineComponent({
  name: 'QuestionnaireProgress',
  inheritAttrs: false,
  setup(_, { attrs }) {
    const context = inject(QUESTIONNAIRE_KEY)
    if (!context) throw new Error('QuestionnaireProgress must be used inside Questionnaire.')
    return () =>
      h(
        'div',
        {
          ...attrs,
          role: 'progressbar',
          'aria-label': 'پیشرفت پرسش‌نامه',
          'aria-valuemin': 0,
          'aria-valuemax': 100,
          'aria-valuenow': context.progress.value,
          'data-slot': 'questionnaire-progress',
          class: cn('h-2 w-full overflow-hidden rounded-full bg-muted', attrs.class),
        },
        [
          h('div', {
            class: 'h-full rounded-full bg-primary transition-[width]',
            style: { width: `${context.progress.value}%` },
          }),
        ],
      )
  },
})

export const QuestionnaireError = defineComponent({
  name: 'QuestionnaireError',
  inheritAttrs: false,
  setup(_, { attrs, slots }) {
    const context = inject(QUESTIONNAIRE_KEY)
    return () => {
      const content = slots.default?.()
      if (!content?.length && !context?.error.value) return null
      return h(
        'p',
        {
          ...attrs,
          role: 'alert',
          'data-slot': 'questionnaire-error',
          class: cn('text-sm font-medium text-destructive', attrs.class),
        },
        content?.length ? content : context?.error.value,
      )
    }
  },
})

export const QuestionnaireActions = createPrimitive(
  'QuestionnaireActions',
  'div',
  'flex flex-wrap items-center gap-2',
  { 'data-slot': 'questionnaire-actions' },
)

function createQuestionnaireAction(name: string, action: 'previous' | 'next' | 'skip' | 'submit') {
  return defineComponent({
    name,
    inheritAttrs: false,
    setup(_, { attrs, slots }) {
      const context = inject(QUESTIONNAIRE_KEY)
      const classes =
        action === 'next' || action === 'submit'
          ? 'inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:pointer-events-none disabled:opacity-50'
          : action === 'previous'
            ? 'inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50'
            : 'inline-flex h-9 items-center justify-center rounded-md px-4 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent disabled:pointer-events-none disabled:opacity-50'
      return () => {
        if (action === 'next' && context?.isLast.value) return null
        if (action === 'submit' && context && !context.isLast.value) return null
        if (action === 'skip' && context?.currentItem.value?.required) return null
        return h(
          'button',
          {
            ...attrs,
            type: action === 'submit' ? 'submit' : 'button',
            'data-slot': `questionnaire-${action}`,
            disabled:
              attrs.disabled ??
              (action === 'previous' ? context?.activeIndex.value === 0 : undefined),
            class: cn(classes, attrs.class),
            onClick: (event: MouseEvent) => {
              if (action === 'previous') context?.previous()
              if (action === 'next') context?.next()
              if (action === 'skip') context?.skip()
              const handler = attrs.onClick
              if (typeof handler === 'function') handler(event)
            },
          },
          slots.default?.() ??
            {
              previous: 'قبلی',
              next: 'ادامه',
              skip: 'رد کردن',
              submit: 'ارسال',
            }[action],
        )
      }
    },
  })
}

export const QuestionnairePrevious = createQuestionnaireAction('QuestionnairePrevious', 'previous')
export const QuestionnaireNext = createQuestionnaireAction('QuestionnaireNext', 'next')
export const QuestionnaireSkip = createQuestionnaireAction('QuestionnaireSkip', 'skip')
export const QuestionnaireSubmit = createQuestionnaireAction('QuestionnaireSubmit', 'submit')
