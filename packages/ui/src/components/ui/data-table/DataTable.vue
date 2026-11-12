<script setup lang="ts" generic="T extends object">
import { computed, ref, watch } from 'vue'
import { formatJalali, formatNumber, toPersianDigits } from '@saaze/utils'
import { ArrowDown, ArrowUp, ArrowUpDown, Inbox, Loader2 } from 'lucide-vue-next'
import { Pagination } from '@/components/ui/pagination'
import { cn } from '@/lib/utils'
import { useResolvedDirection } from '@/lib/rtl'
import type { DataTableAlign, DataTableColumn, DataTableProps, DataTableSort } from './types'

const props = withDefaults(defineProps<DataTableProps<T>>(), {
  pageSize: 10,
  pageSizeOptions: () => [5, 10, 20, 50],
  initialPage: 1,
  initialSort: null,
  pagination: true,
  loading: false,
  emptyText: 'داده‌ای برای نمایش وجود ندارد.',
  loadingText: 'در حال بارگذاری…',
  rowsPerPageLabel: 'تعداد در صفحه',
  ariaLabel: 'جدول داده',
  dir: undefined,
  striped: false,
  stickyHeader: false,
  rowKey: undefined,
  class: undefined,
  tableClass: undefined,
})

const direction = useResolvedDirection(() => props.dir)
const emits = defineEmits<{
  'update:page': [page: number]
  'update:pageSize': [pageSize: number]
  'sort-change': [sort: DataTableSort | null]
}>()

const alignClass: Record<DataTableAlign, string> = {
  start: 'text-start',
  center: 'text-center',
  end: 'text-end',
}

const justifyClass: Record<DataTableAlign, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
}

const page = ref(Math.max(1, props.initialPage))
const internalPageSize = ref(props.pageSize)
const sort = ref<DataTableSort | null>(props.initialSort ? { ...props.initialSort } : null)

watch(
  () => props.pageSize,
  (value) => {
    if (value > 0 && value !== internalPageSize.value) {
      internalPageSize.value = value
      page.value = 1
    }
  },
)

const safePageSize = computed(() => Math.max(1, internalPageSize.value))
const totalRows = computed(() => props.data.length)
const pageCount = computed(() => Math.max(1, Math.ceil(totalRows.value / safePageSize.value)))
const currentPage = computed(() => Math.min(Math.max(1, page.value), pageCount.value))

watch(pageCount, (count) => {
  if (page.value > count) page.value = count
})

function getColumnValue(row: T, column: DataTableColumn<T>): unknown {
  if (column.accessor) return column.accessor(row)
  return (row as Record<string, unknown>)[column.key]
}

function compareValues(a: unknown, b: unknown): number {
  const aEmpty = a === null || a === undefined || a === ''
  const bEmpty = b === null || b === undefined || b === ''

  if (aEmpty && bEmpty) return 0
  if (aEmpty) return 1
  if (bEmpty) return -1

  if (typeof a === 'number' && typeof b === 'number') return a - b
  if (a instanceof Date && b instanceof Date) return a.getTime() - b.getTime()

  return String(a).localeCompare(String(b), 'fa', {
    numeric: true,
    sensitivity: 'base',
  })
}

const sortedData = computed(() => {
  if (!sort.value) return props.data

  const column = props.columns.find((item) => item.key === sort.value?.key)
  if (!column) return props.data

  return props.data
    .map((row, index) => ({ row, index }))
    .sort((a, b) => {
      const result = compareValues(getColumnValue(a.row, column), getColumnValue(b.row, column))
      const directed = sort.value?.direction === 'desc' ? -result : result
      return directed || a.index - b.index
    })
    .map((item) => item.row)
})

const visibleRows = computed(() => {
  if (!props.pagination) return sortedData.value
  const start = (currentPage.value - 1) * safePageSize.value
  return sortedData.value.slice(start, start + safePageSize.value)
})

const startIndex = computed(() => (currentPage.value - 1) * safePageSize.value)
const rangeStart = computed(() => (totalRows.value === 0 ? 0 : startIndex.value + 1))
const rangeEnd = computed(() => Math.min(startIndex.value + safePageSize.value, totalRows.value))

function toggleSort(column: DataTableColumn<T>) {
  if (!column.sortable) return

  if (!sort.value || sort.value.key !== column.key) {
    sort.value = { key: column.key, direction: 'asc' }
  } else if (sort.value.direction === 'asc') {
    sort.value = { key: column.key, direction: 'desc' }
  } else {
    sort.value = null
  }

  page.value = 1
  emits('sort-change', sort.value ? { ...sort.value } : null)
}

function ariaSort(column: DataTableColumn<T>): 'ascending' | 'descending' | 'none' | undefined {
  if (!column.sortable) return undefined
  if (sort.value?.key !== column.key) return 'none'
  return sort.value.direction === 'asc' ? 'ascending' : 'descending'
}

function sortLabel(column: DataTableColumn<T>): string {
  if (sort.value?.key !== column.key) return `مرتب‌سازی بر اساس ${column.header}`
  return sort.value.direction === 'asc'
    ? `مرتب‌سازی نزولی بر اساس ${column.header}`
    : `مرتب‌سازی صعودی بر اساس ${column.header}`
}

function setPage(value: number) {
  page.value = Math.min(Math.max(1, value), pageCount.value)
  emits('update:page', page.value)
}

function setPageSize(value: number) {
  if (!Number.isFinite(value) || value <= 0) return
  internalPageSize.value = value
  page.value = 1
  emits('update:pageSize', value)
}

function getRowKey(row: T, index: number): string | number {
  if (typeof props.rowKey === 'function') return props.rowKey(row, index)
  if (props.rowKey) {
    const value = row[props.rowKey]
    if (typeof value === 'string' || typeof value === 'number') return value
  }
  return index
}

function formatCellValue(value: unknown, row: T, column: DataTableColumn<T>): string {
  if (column.format) return column.format(value, row)
  if (value === null || value === undefined || value === '') return '—'
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? '—' : formatJalali(value, { pattern: 'YYYY/MM/DD' })
  }
  if (typeof value === 'number') return formatNumber(value)
  if (typeof value === 'boolean') return value ? 'بله' : 'خیر'
  return toPersianDigits(String(value))
}

defineExpose({ page, pageSize: internalPageSize, sort, pageCount, setPage })
</script>

<template>
  <div :dir="direction" :class="cn('w-full', props.class)">
    <div class="relative w-full overflow-auto rounded-lg border bg-card" :aria-busy="loading">
      <table :aria-label="ariaLabel" :class="cn('w-full caption-bottom text-sm', props.tableClass)">
        <thead :class="cn('bg-muted/50', stickyHeader && 'sticky top-0 z-10 backdrop-blur')">
          <tr class="border-b transition-colors">
            <th
              v-for="column in columns"
              :key="column.key"
              scope="col"
              :aria-sort="ariaSort(column)"
              :class="
                cn(
                  'h-11 px-3 align-middle text-xs font-medium text-muted-foreground',
                  alignClass[column.align ?? 'start'],
                  column.hideOnMobile && 'hidden md:table-cell',
                  stickyHeader && 'bg-muted/90',
                  column.headerClass,
                )
              "
            >
              <button
                v-if="column.sortable"
                type="button"
                :aria-label="sortLabel(column)"
                :class="
                  cn(
                    'inline-flex w-full items-center gap-1.5 whitespace-nowrap transition-colors hover:text-foreground',
                    justifyClass[column.align ?? 'start'],
                  )
                "
                @click="toggleSort(column)"
              >
                <span>{{ column.header }}</span>
                <ArrowUp
                  v-if="sort?.key === column.key && sort.direction === 'asc'"
                  class="size-3.5"
                  aria-hidden="true"
                />
                <ArrowDown
                  v-else-if="sort?.key === column.key && sort.direction === 'desc'"
                  class="size-3.5"
                  aria-hidden="true"
                />
                <ArrowUpDown v-else class="size-3.5 opacity-50" aria-hidden="true" />
              </button>
              <span v-else>{{ column.header }}</span>
            </th>
          </tr>
        </thead>

        <tbody>
          <tr v-if="visibleRows.length === 0">
            <td :colspan="columns.length" class="h-32 text-center">
              <div class="flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Inbox class="size-6 opacity-60" aria-hidden="true" />
                <span class="text-sm">{{ emptyText }}</span>
              </div>
            </td>
          </tr>

          <tr
            v-for="(row, rowIndex) in visibleRows"
            :key="getRowKey(row, startIndex + rowIndex)"
            :class="
              cn(
                'border-b transition-colors last:border-0 hover:bg-muted/40',
                striped && rowIndex % 2 === 1 && 'bg-muted/20',
              )
            "
          >
            <td
              v-for="column in columns"
              :key="column.key"
              :class="
                cn(
                  'px-3 py-3 align-middle',
                  alignClass[column.align ?? 'start'],
                  column.hideOnMobile && 'hidden md:table-cell',
                  column.class,
                )
              "
            >
              <slot
                :name="`cell-${column.key}`"
                :row="row"
                :value="getColumnValue(row, column)"
                :index="startIndex + rowIndex"
                :column="column"
              >
                {{ formatCellValue(getColumnValue(row, column), row, column) }}
              </slot>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="loading"
        class="absolute inset-0 z-20 flex items-center justify-center gap-2 bg-background/70 text-sm text-muted-foreground backdrop-blur-[1px]"
        role="status"
      >
        <Loader2 class="size-4 animate-spin" aria-hidden="true" />
        <span>{{ loadingText }}</span>
      </div>
    </div>

    <div
      v-if="pagination && totalRows > 0"
      class="mt-3 flex flex-col gap-3 text-sm sm:flex-row sm:items-center sm:justify-between"
    >
      <div class="flex flex-col gap-2 text-muted-foreground sm:flex-row sm:items-center sm:gap-4">
        <span>
          نمایش {{ toPersianDigits(rangeStart) }} تا {{ toPersianDigits(rangeEnd) }} از
          {{ toPersianDigits(totalRows) }} مورد
        </span>
        <label class="flex items-center gap-2">
          <span class="sr-only sm:not-sr-only">{{ rowsPerPageLabel }}</span>
          <select
            :value="safePageSize"
            :disabled="loading"
            :aria-label="rowsPerPageLabel"
            class="h-8 cursor-pointer rounded-md border border-input bg-background px-2 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 disabled:cursor-not-allowed disabled:opacity-50"
            @change="setPageSize(Number(($event.target as HTMLSelectElement).value))"
          >
            <option v-for="size in pageSizeOptions" :key="size" :value="size">
              {{ toPersianDigits(size) }}
            </option>
          </select>
        </label>
      </div>

      <Pagination
        :page="currentPage"
        :page-count="pageCount"
        :dir="direction"
        :disabled="loading"
        @update:page="setPage"
      />
    </div>
  </div>
</template>
