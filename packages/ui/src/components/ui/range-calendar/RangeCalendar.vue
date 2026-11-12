<script setup lang="ts">
import { computed, nextTick, ref, watch, type HTMLAttributes } from 'vue'
import {
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
import { useResolvedDirection } from '@/lib/rtl'
import type { DateRange } from './types'

interface Props {
  modelValue?: DateRange | null
  defaultMonth?: Date | null
  minDate?: Date | null
  maxDate?: Date | null
  disabled?: boolean
  dir?: 'rtl' | 'ltr'
  /** تعداد ماه‌هایی که کنار هم نمایش داده می‌شوند */
  numberOfMonths?: number
  weekStartsOn?: number
  showOutsideDays?: boolean
  isDateDisabled?: (date: Date) => boolean
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: null,
  defaultMonth: null,
  minDate: null,
  maxDate: null,
  disabled: false,
  dir: undefined,
  numberOfMonths: 1,
  weekStartsOn: 6,
  showOutsideDays: false,
  isDateDisabled: undefined,
  class: undefined,
})

const emits = defineEmits<{
  'update:modelValue': [value: DateRange]
  /** وقتی هر دو سر بازه انتخاب شد */
  select: [value: { start: Date; end: Date }]
}>()

const direction = useResolvedDirection(() => props.dir)

const isValidDate = (value?: Date | null): value is Date =>
  value instanceof Date && !Number.isNaN(value.getTime())
const cellKey = (date: JalaliDate): string => `${date.year}-${date.month}-${date.day}`
const toJalaliOrNull = (value?: Date | null) =>
  isValidDate(value) ? gregorianToJalali(value) : null

const start = computed(() => toJalaliOrNull(props.modelValue?.start))
const end = computed(() => toJalaliOrNull(props.modelValue?.end))
const minJalali = computed(() => toJalaliOrNull(props.minDate))
const maxJalali = computed(() => toJalaliOrNull(props.maxDate))
const today = todayJalali()

const initial =
  toJalaliOrNull(props.modelValue?.start) ?? toJalaliOrNull(props.defaultMonth) ?? today
const view = ref<JalaliDate>({ year: initial.year, month: initial.month, day: 1 })
const hovered = ref<JalaliDate | null>(null)
const focusedKey = ref(cellKey(start.value ?? today))

const monthCount = computed(() => Math.max(1, Math.floor(props.numberOfMonths)))
const months = computed(() =>
  Array.from({ length: monthCount.value }, (_, offset) => {
    const month = addJalaliMonths({ ...view.value, day: 1 }, offset)
    const grid = getJalaliMonthGrid(month.year, month.month, { weekStartsOn: props.weekStartsOn })
    return {
      key: `${month.year}-${month.month}`,
      year: month.year,
      month: month.month,
      label: `${getJalaliMonthName(month.month)} ${toPersianDigits(month.year)}`,
      weeks: Array.from({ length: 6 }, (_, index) => grid.slice(index * 7, (index + 1) * 7)),
      cells: grid,
    }
  }),
)
const weekdayLabels = computed(() => getJalaliWeekdayLabels(props.weekStartsOn, true))
const fullWeekdayLabels = computed(() => getJalaliWeekdayLabels(props.weekStartsOn, false))

const firstOfMonth = (date: JalaliDate): JalaliDate => ({
  year: date.year,
  month: date.month,
  day: 1,
})
const canGoPrevious = computed(
  () =>
    !props.disabled &&
    (!minJalali.value ||
      compareJalali(firstOfMonth(view.value), firstOfMonth(minJalali.value)) > 0),
)
const canGoNext = computed(() => {
  if (props.disabled) return false
  if (!maxJalali.value) return true
  const lastVisible = addJalaliMonths(firstOfMonth(view.value), monthCount.value - 1)
  return compareJalali(lastVisible, firstOfMonth(maxJalali.value)) < 0
})

function isDisabledJalali(date: JalaliDate): boolean {
  if (props.disabled) return true
  if (!isJalaliInRange(date, minJalali.value, maxJalali.value)) return true
  return Boolean(props.isDateDisabled?.(jalaliToGregorian(date)))
}

/** سر دوم بازه برای نمایش: مقدار انتخاب‌شده یا خانه زیر نشانگر */
const previewEnd = computed(() => end.value ?? (start.value ? hovered.value : null))
const orderedRange = computed<[JalaliDate, JalaliDate] | null>(() => {
  if (!start.value) return null
  const other = previewEnd.value ?? start.value
  return compareJalali(start.value, other) <= 0 ? [start.value, other] : [other, start.value]
})

function isRangeStart(date: JalaliDate) {
  return Boolean(orderedRange.value && isSameJalaliDate(date, orderedRange.value[0]))
}
function isRangeEnd(date: JalaliDate) {
  return Boolean(orderedRange.value && isSameJalaliDate(date, orderedRange.value[1]))
}
function isInRange(date: JalaliDate) {
  return Boolean(
    orderedRange.value && isJalaliInRange(date, orderedRange.value[0], orderedRange.value[1]),
  )
}

function changeMonth(delta: number) {
  if ((delta < 0 && !canGoPrevious.value) || (delta > 0 && !canGoNext.value)) return
  const next = addJalaliMonths(firstOfMonth(view.value), delta)
  view.value = next
}

function selectDate(cell: JalaliDayCell) {
  if (isDisabledJalali(cell.jalali)) return
  focusedKey.value = cell.key
  const picked = jalaliToGregorian(cell.jalali)

  // شروع بازه تازه
  if (!start.value || end.value) {
    emits('update:modelValue', { start: picked, end: null })
    return
  }

  const startDate = jalaliToGregorian(start.value)
  const [from, to] =
    compareJalali(start.value, cell.jalali) <= 0 ? [startDate, picked] : [picked, startDate]
  hovered.value = null
  emits('update:modelValue', { start: from, end: to })
  emits('select', { start: from, end: to })
}

const gridRefs = ref<HTMLElement | null>(null)

function isVisible(date: JalaliDate) {
  const first = firstOfMonth(view.value)
  const last = addJalaliMonths(first, monthCount.value - 1)
  const target = firstOfMonth(date)
  return compareJalali(target, first) >= 0 && compareJalali(target, last) <= 0
}

async function focusDate(date: JalaliDate) {
  if (isDisabledJalali(date)) return
  if (!isVisible(date)) {
    const first = firstOfMonth(view.value)
    view.value =
      compareJalali(firstOfMonth(date), first) < 0
        ? firstOfMonth(date)
        : addJalaliMonths(firstOfMonth(date), -(monthCount.value - 1))
  }
  focusedKey.value = cellKey(date)
  if (start.value && !end.value) hovered.value = date
  await nextTick()
  gridRefs.value
    ?.querySelector<HTMLButtonElement>(`button[data-date="${cellKey(date)}"][data-current-month]`)
    ?.focus()
}

/** ستون خانه در شبکه با توجه به `weekStartsOn` (نه روز هفته شنبه‌مبنا) */
function columnOf(cell: JalaliDayCell): number {
  return (cell.date.getDay() - props.weekStartsOn + 7) % 7
}

async function handleKeydown(event: KeyboardEvent, cells: JalaliDayCell[]) {
  if (event.metaKey || event.ctrlKey || event.altKey) return
  const key = (event.target as HTMLElement).dataset.date
  const cell = cells.find((item) => item.key === key)
  if (!cell) return
  const rtl = direction.value === 'rtl'
  const moves: Record<string, () => JalaliDate> = {
    ArrowRight: () => addJalaliDays(cell.jalali, rtl ? -1 : 1),
    ArrowLeft: () => addJalaliDays(cell.jalali, rtl ? 1 : -1),
    ArrowUp: () => addJalaliDays(cell.jalali, -7),
    ArrowDown: () => addJalaliDays(cell.jalali, 7),
    Home: () => addJalaliDays(cell.jalali, -columnOf(cell)),
    End: () => addJalaliDays(cell.jalali, 6 - columnOf(cell)),
    PageUp: () => addJalaliMonths(cell.jalali, -1),
    PageDown: () => addJalaliMonths(cell.jalali, 1),
  }
  const move = moves[event.key]
  if (!move) return
  event.preventDefault()
  await focusDate(move())
}

watch(
  () => props.modelValue?.start,
  (value) => {
    const jalali = toJalaliOrNull(value)
    if (jalali && !isVisible(jalali)) view.value = firstOfMonth(jalali)
  },
)

defineExpose({ view })
</script>

<template>
  <div
    ref="gridRefs"
    :dir="direction"
    :class="cn('inline-block max-w-full rounded-lg bg-background p-3', props.class)"
    @mouseleave="hovered = null"
  >
    <div class="relative flex flex-col gap-4 sm:flex-row">
      <div class="absolute inset-x-0 top-0 flex items-center justify-between">
        <Button
          variant="outline"
          size="icon-sm"
          :disabled="!canGoPrevious"
          aria-label="ماه قبل"
          @click="changeMonth(-1)"
        >
          <ChevronRight v-if="direction === 'rtl'" aria-hidden="true" />
          <ChevronLeft v-else aria-hidden="true" />
        </Button>
        <Button
          variant="outline"
          size="icon-sm"
          :disabled="!canGoNext"
          aria-label="ماه بعد"
          @click="changeMonth(1)"
        >
          <ChevronLeft v-if="direction === 'rtl'" aria-hidden="true" />
          <ChevronRight v-else aria-hidden="true" />
        </Button>
      </div>

      <div v-for="month in months" :key="month.key" class="w-[17.5rem] max-w-full">
        <div class="flex h-8 items-center justify-center text-sm font-medium" aria-live="polite">
          {{ month.label }}
        </div>
        <table
          role="grid"
          :aria-label="`تقویم ${month.label}`"
          class="saaze-calendar-grid mt-3 w-full table-fixed select-none border-collapse"
          @keydown="handleKeydown($event, month.cells)"
        >
          <thead>
            <tr>
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
            <tr v-for="(week, weekIndex) in month.weeks" :key="weekIndex">
              <td
                v-for="cell in week"
                :key="cell.key"
                role="gridcell"
                :aria-selected="cell.isCurrentMonth && isInRange(cell.jalali) ? true : undefined"
                :class="
                  cn(
                    'p-0 text-center [&>*]:my-0.5',
                    cell.isCurrentMonth && isInRange(cell.jalali) && 'bg-primary/10',
                    cell.isCurrentMonth && isRangeStart(cell.jalali) && 'rounded-s-md',
                    cell.isCurrentMonth && isRangeEnd(cell.jalali) && 'rounded-e-md',
                  )
                "
              >
                <button
                  v-if="cell.isCurrentMonth || showOutsideDays"
                  type="button"
                  :data-date="cell.key"
                  :data-current-month="cell.isCurrentMonth ? '' : undefined"
                  :tabindex="cell.isCurrentMonth && cell.key === focusedKey ? 0 : -1"
                  :disabled="isDisabledJalali(cell.jalali)"
                  :aria-label="getJalaliAccessibleLabel(cell.jalali)"
                  :aria-current="cell.isToday ? 'date' : undefined"
                  :class="
                    cn(
                      'inline-flex size-9 items-center justify-center rounded-md text-sm transition-colors',
                      'hover:bg-accent hover:text-accent-foreground',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1',
                      'disabled:pointer-events-none disabled:opacity-30',
                      !cell.isCurrentMonth && 'text-muted-foreground/45',
                      cell.isToday && 'font-semibold underline underline-offset-4',
                      cell.isCurrentMonth &&
                        (isRangeStart(cell.jalali) || isRangeEnd(cell.jalali)) &&
                        'bg-primary text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground',
                    )
                  "
                  @mouseenter="start && !end ? (hovered = cell.jalali) : undefined"
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
      </div>
    </div>
  </div>
</template>
