import type { HTMLAttributes } from 'vue'

export type DataTableAlign = 'start' | 'center' | 'end'

export interface DataTableColumn<Row> {
  /** کلید یکتای ستون و کلید دسترسی به فیلد ردیف */
  key: string
  /** عنوان ستون؛ باید فارسی و کوتاه باشد */
  header: string
  /** استخراج مقدار از ردیف؛ در صورت نبود از `row[key]` استفاده می‌شود */
  accessor?: (row: Row) => unknown
  /** قابلیت مرتب‌سازی با کلیک روی سرستون */
  sortable?: boolean
  /** ترازبندی منطقی سلول؛ پیش‌فرض start */
  align?: DataTableAlign
  /** کلاس اختصاصی سلول‌های بدنه */
  class?: string
  /** کلاس اختصاصی سرستون */
  headerClass?: string
  /** مخفی‌کردن ستون در صفحه‌های کوچک */
  hideOnMobile?: boolean
  /** قالب‌بندی اختصاصی مقدار سلول */
  format?: (value: unknown, row: Row) => string
}

export interface DataTableSort {
  key: string
  direction: 'asc' | 'desc'
}

export interface DataTableProps<Row> {
  data: Row[]
  columns: DataTableColumn<Row>[]
  pageSize?: number
  pageSizeOptions?: number[]
  initialPage?: number
  initialSort?: DataTableSort | null
  pagination?: boolean
  loading?: boolean
  emptyText?: string
  loadingText?: string
  rowsPerPageLabel?: string
  ariaLabel?: string
  dir?: 'rtl' | 'ltr'
  striped?: boolean
  stickyHeader?: boolean
  rowKey?: keyof Row | ((row: Row, index: number) => string | number)
  class?: HTMLAttributes['class']
  tableClass?: HTMLAttributes['class']
}
