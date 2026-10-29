<script setup lang="ts">
import { computed, nextTick, ref, watch, type HTMLAttributes } from 'vue'
import {
  JALALI_MONTHS,
  addJalaliDays,
  addJalaliMonths,
  compareJalali,
  getJalaliAccessibleLabel,
  getJalaliMonthGrid,
  getJalaliMonthName,
  getJalaliWeekdayLabels,
  gregorianToJalali,
  isJalaliInRange,
  isSameJalaliDate,
  jalaliToGregorian,
  todayJalali,
  toPersianDigits,
  type JalaliDate,
  type JalaliDayCell,
} from '@saaze/utils'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  modelValue?: Date | null
  defaultMonth?: Date | null
  minDate?: Date | null
  maxDate?: Date | null
  disabled?: boolean
  dir?: 'rtl' | 'ltr'
  weekStartsOn?: number
  showOutsideDays?: boolean
  showToday?: boolean
  isDateDisabled?: (date: Date) => boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  defaultMonth: null,
  minDate: null,
  maxDate: null,
  disabled: false,
  dir: 'rtl',
  weekStartsOn: 6,
  showOutsideDays: true,
  showToday: true,
  isDateDisabled: undefined,
  class: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: Date]
  select: [value: Date]
}>()

const isValidDate = (value?: Date | null): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())

const cellKey = (date: JalaliDate): string => `${date.year}-${date.month}-${date.day}`

const getInitialView = (): JalaliDate => {
  const base = isValidDate(props.modelValue)
    ? props.modelValue
    : isValidDate(props.defaultMonth)
      ? props.defaultMonth
      : new Date()
  const jalali = gregorianToJalali(base)
  return { year: jalali.year, month: jalali.month, day: 1 }
}

const view = ref<JalaliDate>(getInitialView())
const selected = computed<JalaliDate | null>(() =>
  isValidDate(props.modelValue) ? gregorianToJalali(props.modelValue) : null,
)
const minJalali = computed<JalaliDate | null>(() =>
  isValidDate(props.minDate) ? gregorianToJalali(props.minDate) : null,
)
const maxJalali = computed<JalaliDate | null>(() =>
  isValidDate(props.maxDate) ? gregorianToJalali(props.maxDate) : null,
)
const today = computed(() => todayJalali())

const grid = computed(() =>
  getJalaliMonthGrid(view.value.year, view.value.month, {
    weekStartsOn: props.weekStartsOn,
  }),
)
const weeks = computed(() =>
  Array.from({ length: 6 }, (_, index) => grid.value.slice(index * 7, (index + 1) * 7)),
)
const weekdayLabels = computed(() => getJalaliWeekdayLabels(props.weekStartsOn, true))
const fullWeekdayLabels = computed(() => getJalaliWeekdayLabels(props.weekStartsOn, false))
const monthName = computed(() => getJalaliMonthName(view.value.month))
const gridLabel = computed(() => `تقویم ${monthName.value} ${toPersianDigits(view.value.year)}`)

const focusedKey = ref<string>(cellKey(view.value))

const getDefaultFocusKey = (year: number, month: number): string => {
  if (selected.value && selected.value.year === year && selected.value.month === month) {
    return cellKey(selected.value)
  }
  if (today.value.year === year && today.value.month === month) {
    return cellKey(today.value)
  }
  return `${year}-${month}-1`
}
focusedKey.value = getDefaultFocusKey(view.value.year, view.value.month)

const monthModel = computed({
  get: () => view.value.month,
  set: (month: number) => {
    setView(view.value.year, month)
  },
})
const yearModel = computed({
  get: () => view.value.year,
  set: (year: number) => {
    setView(year, view.value.month)
  },
})

const yearOptions = computed(() => {
  const currentYear = view.value.year
  const first = minJalali.value?.year ?? currentYear - 50
  const last = maxJalali.value?.year ?? currentYear + 20
  const start = Math.min(first, currentYear)
  const end = Math.max(last, currentYear)
  return Array.from({ length: end - start + 1 }, (_, index) => start + index)
})

const canGoPrevious = computed(() => {
  if (props.disabled) return false
  if (!minJalali.value) return true
  return (
    compareJalali(
      { year: view.value.year, month: view.value.month, day: 1 },
      { year: minJalali.value.year, month: minJalali.value.month, day: 1 },
    ) > 0
  )
})

const canGoNext = computed(() => {
  if (props.disabled) return false
  if (!maxJalali.value) return true
  return (
    compareJalali(
      { year: view.value.year, month: view.value.month, day: 1 },
      { year: maxJalali.value.year, month: maxJalali.value.month, day: 1 },
    ) < 0
  )
})

const isTodayDisabled = computed(() => isDisabledJalali(today.value))

function isDisabledJalali(date: JalaliDate): boolean {
  if (props.disabled) return true
  if (!isJalaliInRange(date, minJalali.value, maxJalali.value)) return true
  if (!props.isDateDisabled) return false
  return Boolean(props.isDateDisabled(jalaliToGregorian(date)))
}

function isSelected(cell: JalaliDayCell): boolean {
  return Boolean(selected.value && isSameJalaliDate(cell.jalali, selected.value))
}

function isCellDisabled(cell: JalaliDayCell): boolean {
  return isDisabledJalali(cell.jalali)
}

function isMonthOptionDisabled(month: number): boolean {
  const candidate = { year: view.value.year, month, day: 1 }
  if (
    minJalali.value &&
    compareJalali(candidate, {
      year: minJalali.value.year,
      month: minJalali.value.month,
      day: 1,
    }) < 0
  ) {
    return true
  }
  if (
    maxJalali.value &&
    compareJalali(candidate, {
      year: maxJalali.value.year,
      month: maxJalali.value.month,
      day: 1,
    }) > 0
  ) {
    return true
  }
  return false
}

function clampMonthToBounds(year: number, month: number): number {
  let result = Math.min(Math.max(month, 1), 12)
  if (minJalali.value && year === minJalali.value.year) {
    result = Math.max(result, minJalali.value.month)
  }
  if (maxJalali.value && year === maxJalali.value.year) {
    result = Math.min(result, maxJalali.value.month)
  }
  return result
}

function setView(year: number, month: number, focusKey?: string) {
  const normalizedMonth = clampMonthToBounds(year, month)
  view.value = { year, month: normalizedMonth, day: 1 }
  focusedKey.value = focusKey ?? getDefaultFocusKey(year, normalizedMonth)
}

function changeMonth(delta: number) {
  if ((delta < 0 && !canGoPrevious.value) || (delta > 0 && !canGoNext.value)) return
  const next = addJalaliMonths({ ...view.value, day: 1 }, delta)
  setView(next.year, next.month)
}

function emitDate(date: JalaliDate) {
  const value = jalaliToGregorian(date)
  emits('update:modelValue', value)
  emits('select', value)
}

function selectDate(cell: JalaliDayCell) {
  if (isCellDisabled(cell)) return
  if (cell.jalali.year !== view.value.year || cell.jalali.month !== view.value.month) {
    setView(cell.jalali.year, cell.jalali.month, cell.key)
  } else {
    focusedKey.value = cell.key
  }
  emitDate(cell.jalali)
}

function selectToday() {
  if (isTodayDisabled.value) return
  setView(today.value.year, today.value.month, cellKey(today.value))
  emitDate(today.value)
}

async function focusDate(date: JalaliDate) {
  if (isDisabledJalali(date)) return
  if (date.year !== view.value.year || date.month !== view.value.month) {
    setView(date.year, date.month, cellKey(date))
  } else {
    focusedKey.value = cellKey(date)
  }

  await nextTick()
  const button = gridRef.value?.querySelector<HTMLButtonElement>(
    `button[data-date="${cellKey(date)}"]`,
  )
  button?.focus()
}

async function handleGridKeydown(event: KeyboardEvent) {
  if (event.metaKey || event.ctrlKey || event.altKey) return

  const target = event.target as HTMLElement
  const key = target.dataset.date
  if (!key) return

  const cell = grid.value.find((item) => item.key === key)
  if (!cell) return

  let nextDate: JalaliDate | null = null

  switch (event.key) {
    case 'ArrowRight':
      nextDate = addJalaliDays(cell.jalali, props.dir === 'rtl' ? -1 : 1)
      break
    case 'ArrowLeft':
      nextDate = addJalaliDays(cell.jalali, props.dir === 'rtl' ? 1 : -1)
      break
    case 'ArrowUp':
      nextDate = addJalaliDays(cell.jalali, -7)
      break
    case 'ArrowDown':
      nextDate = addJalaliDays(cell.jalali, 7)
      break
    case 'Home':
      nextDate = addJalaliDays(cell.jalali, -cell.weekday)
      break
    case 'End':
      nextDate = addJalaliDays(cell.jalali, 6 - cell.weekday)
      break
    case 'PageUp':
      nextDate = addJalaliMonths(cell.jalali, -1)
      break
    case 'PageDown':
      nextDate = addJalaliMonths(cell.jalali, 1)
      break
    default:
      return
  }

  event.preventDefault()
  if (nextDate) await focusDate(nextDate)
}

const gridRef = ref<HTMLTableElement | null>(null)

watch(
  () => props.modelValue,
  (value) => {
    if (!isValidDate(value)) return
    const jalali = gregorianToJalali(value)
    setView(jalali.year, jalali.month, cellKey(jalali))
  },
)

defineExpose({ view, selectToday })
</script>

<template>
  <div :dir="dir" :class="cn('w-[19rem] max-w-full rounded-lg bg-background p-3', props.class)">
    <h2 class="sr-only" aria-live="polite">{{ monthName }} {{ toPersianDigits(view.year) }}</h2>

    <div class="flex items-center justify-between gap-2">
      <Button
        variant="outline"
        size="icon-sm"
        :disabled="!canGoPrevious"
        aria-label="ماه قبل"
        @click="changeMonth(-1)"
      >
        <ChevronRight v-if="dir === 'rtl'" aria-hidden="true" />
        <ChevronLeft v-else aria-hidden="true" />
      </Button>

      <div class="flex items-center gap-1">
        <select
          v-model.number="monthModel"
          :disabled="disabled"
          aria-label="ماه"
          class="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option
            v-for="month in JALALI_MONTHS"
            :key="month.value"
            :value="month.value"
            :disabled="isMonthOptionDisabled(month.value)"
          >
            {{ month.label }}
          </option>
        </select>

        <select
          v-model.number="yearModel"
          :disabled="disabled"
          aria-label="سال"
          class="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <option v-for="year in yearOptions" :key="year" :value="year">
            {{ toPersianDigits(year) }}
          </option>
        </select>
      </div>

      <Button
        variant="outline"
        size="icon-sm"
        :disabled="!canGoNext"
        aria-label="ماه بعد"
        @click="changeMonth(1)"
      >
        <ChevronLeft v-if="dir === 'rtl'" aria-hidden="true" />
        <ChevronRight v-else aria-hidden="true" />
      </Button>
    </div>

    <table
      ref="gridRef"
      role="grid"
      :aria-label="gridLabel"
      class="mt-3 w-full table-fixed select-none border-collapse"
      @keydown="handleGridKeydown"
    >
      <thead>
        <tr role="row">
          <th
            v-for="(label, index) in weekdayLabels"
            :key="label"
            scope="col"
            class="pb-1 text-center text-xs font-normal text-muted-foreground"
          >
            <abbr :title="fullWeekdayLabels[index]" class="no-underline">{{ label }}</abbr>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(week, weekIndex) in weeks" :key="weekIndex" role="row">
          <td
            v-for="cell in week"
            :key="cell.key"
            role="gridcell"
            :aria-selected="isSelected(cell)"
            class="p-0.5 text-center"
          >
            <button
              v-if="cell.isCurrentMonth || showOutsideDays"
              type="button"
              :data-date="cell.key"
              :tabindex="cell.key === focusedKey ? 0 : -1"
              :disabled="isCellDisabled(cell)"
              :aria-label="getJalaliAccessibleLabel(cell.jalali)"
              :aria-current="cell.isToday ? 'date' : undefined"
              :class="
                cn(
                  'relative inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                  'disabled:pointer-events-none disabled:opacity-30',
                  !cell.isCurrentMonth && 'text-muted-foreground/45',
                  cell.isToday &&
                    !isSelected(cell) &&
                    'bg-accent/60 font-semibold text-accent-foreground',
                  isSelected(cell) &&
                    'bg-primary text-primary-foreground shadow hover:bg-primary/90 focus-visible:ring-primary',
                )
              "
              @focus="focusedKey = cell.key"
              @click="selectDate(cell)"
            >
              {{ toPersianDigits(cell.day) }}
            </button>
            <span v-else class="inline-block size-9" aria-hidden="true" />
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="showToday" class="mt-2 flex justify-center">
      <Button variant="ghost" size="sm" :disabled="isTodayDisabled" @click="selectToday">
        امروز
      </Button>
    </div>
  </div>
</template>
