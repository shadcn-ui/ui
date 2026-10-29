<script setup lang="ts">
import { computed, ref } from 'vue'
import { DataTable, Input, type DataTableColumn } from '@saaze/ui'
import { formatToman, jalaliToGregorian, toPersianDigits } from '@saaze/utils'
import { Search } from 'lucide-vue-next'

type InvoiceStatus = 'paid' | 'pending' | 'overdue'

interface Invoice {
  id: string
  customer: string
  date: Date
  amount: number
  status: InvoiceStatus
}

const invoices: Invoice[] = [
  {
    id: 'SZ-1405-001',
    customer: 'سارا احمدی',
    date: jalaliToGregorian({ year: 1405, month: 8, day: 6 }),
    amount: 2_450_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-002',
    customer: 'رضا کریمی',
    date: jalaliToGregorian({ year: 1405, month: 8, day: 5 }),
    amount: 890_000,
    status: 'pending',
  },
  {
    id: 'SZ-1405-003',
    customer: 'نگار موسوی',
    date: jalaliToGregorian({ year: 1405, month: 8, day: 3 }),
    amount: 12_700_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-004',
    customer: 'امیرحسین رضایی',
    date: jalaliToGregorian({ year: 1405, month: 8, day: 2 }),
    amount: 4_300_000,
    status: 'overdue',
  },
  {
    id: 'SZ-1405-005',
    customer: 'مریم شریفی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 30 }),
    amount: 675_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-006',
    customer: 'علی صادقی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 28 }),
    amount: 9_150_000,
    status: 'pending',
  },
  {
    id: 'SZ-1405-007',
    customer: 'زهرا نعمتی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 26 }),
    amount: 1_200_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-008',
    customer: 'محمد یاسمی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 24 }),
    amount: 3_680_000,
    status: 'overdue',
  },
  {
    id: 'SZ-1405-009',
    customer: 'پریسا اکبری',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 21 }),
    amount: 7_420_000,
    status: 'pending',
  },
  {
    id: 'SZ-1405-010',
    customer: 'حسین قاسمی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 19 }),
    amount: 540_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-011',
    customer: 'نازنین فراهانی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 17 }),
    amount: 15_900_000,
    status: 'paid',
  },
  {
    id: 'SZ-1405-012',
    customer: 'بهنام مرادی',
    date: jalaliToGregorian({ year: 1405, month: 7, day: 15 }),
    amount: 2_950_000,
    status: 'overdue',
  },
]

const query = ref('')

const filteredInvoices = computed(() => {
  const term = query.value.trim()
  if (!term) return invoices
  return invoices.filter((invoice) => invoice.customer.includes(term) || invoice.id.includes(term))
})

const columns: DataTableColumn<Invoice>[] = [
  { key: 'id', header: 'شماره فاکتور', sortable: true },
  { key: 'customer', header: 'مشتری', sortable: true },
  { key: 'date', header: 'تاریخ', sortable: true, hideOnMobile: true },
  {
    key: 'amount',
    header: 'مبلغ',
    sortable: true,
    align: 'end',
    format: (value) => formatToman(Number(value)),
  },
  { key: 'status', header: 'وضعیت', align: 'center' },
]

const statusMeta: Record<InvoiceStatus, { label: string; class: string }> = {
  paid: {
    label: 'پرداخت‌شده',
    class: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
  },
  pending: {
    label: 'در انتظار',
    class: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  },
  overdue: {
    label: 'معوق',
    class: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
  },
}

function statusOf(value: unknown) {
  return statusMeta[value as InvoiceStatus] ?? statusMeta.pending
}
</script>

<template>
  <div class="grid w-full gap-4">
    <div class="flex flex-wrap items-center justify-between gap-3">
      <div class="relative w-full max-w-xs">
        <Search
          class="pointer-events-none absolute start-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          aria-hidden="true"
        />
        <Input
          v-model="query"
          class="ps-9"
          placeholder="جستجوی مشتری یا شماره فاکتور…"
          aria-label="جستجوی فاکتور"
        />
      </div>
      <span class="text-xs text-muted-foreground">
        {{ toPersianDigits(filteredInvoices.length) }} فاکتور
      </span>
    </div>

    <DataTable
      :data="filteredInvoices"
      :columns="columns"
      :page-size="5"
      :page-size-options="[5, 10, 20]"
      row-key="id"
      striped
      aria-label="فهرست فاکتورها"
    >
      <template #cell-status="{ value }">
        <span
          :class="[
            'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
            statusOf(value).class,
          ]"
        >
          {{ statusOf(value).label }}
        </span>
      </template>
    </DataTable>
  </div>
</template>
