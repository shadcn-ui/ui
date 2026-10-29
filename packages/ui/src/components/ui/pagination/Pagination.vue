<script setup lang="ts">
import { computed, type HTMLAttributes } from 'vue'
import { toPersianDigits } from '@saaze/utils'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Props {
  page?: number
  pageCount?: number
  siblingCount?: number
  disabled?: boolean
  dir?: 'rtl' | 'ltr'
  showLabels?: boolean
  previousLabel?: string
  nextLabel?: string
  ariaLabel?: string
  class?: HTMLAttributes['class']
}

const props = withDefaults(defineProps<Props>(), {
  page: 1,
  pageCount: 1,
  siblingCount: 1,
  disabled: false,
  dir: 'rtl',
  showLabels: true,
  previousLabel: 'قبلی',
  nextLabel: 'بعدی',
  ariaLabel: 'صفحه‌بندی',
})

const emit = defineEmits<{
  'update:page': [page: number]
  change: [page: number]
}>()

type PageItem = number | 'ellipsis-start' | 'ellipsis-end'

const safePageCount = computed(() => Math.max(1, Math.floor(props.pageCount || 1)))
const currentPage = computed(() =>
  Math.min(Math.max(1, Math.floor(props.page || 1)), safePageCount.value),
)

const pageItems = computed<PageItem[]>(() => {
  const total = safePageCount.value
  const current = currentPage.value
  const siblings = Math.max(0, props.siblingCount)

  const range = (start: number, end: number): number[] =>
    Array.from({ length: end - start + 1 }, (_, index) => start + index)

  const visibleSlots = siblings * 2 + 5
  if (total <= visibleSlots) return range(1, total)

  const leftSibling = Math.max(current - siblings, 1)
  const rightSibling = Math.min(current + siblings, total)
  const showLeftEllipsis = leftSibling > 2
  const showRightEllipsis = rightSibling < total - 1

  if (!showLeftEllipsis && showRightEllipsis) {
    return [...range(1, 3 + siblings * 2), 'ellipsis-end', total]
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, 'ellipsis-start', ...range(total - (3 + siblings * 2) + 1, total)]
  }

  return [1, 'ellipsis-start', ...range(leftSibling, rightSibling), 'ellipsis-end', total]
})

const isPreviousDisabled = computed(() => props.disabled || currentPage.value <= 1)
const isNextDisabled = computed(() => props.disabled || currentPage.value >= safePageCount.value)

function goToPage(page: number) {
  if (props.disabled) return
  const next = Math.min(Math.max(1, page), safePageCount.value)
  if (next === currentPage.value) return
  emit('update:page', next)
  emit('change', next)
}

function pageLabel(page: number): string {
  return `صفحه ${toPersianDigits(page)}`
}
</script>

<template>
  <nav :dir="dir" :aria-label="ariaLabel" :class="cn('flex items-center gap-1', props.class)">
    <Button
      variant="outline"
      size="sm"
      :disabled="isPreviousDisabled"
      :aria-label="previousLabel"
      @click="goToPage(currentPage - 1)"
    >
      <ChevronRight v-if="dir === 'rtl'" aria-hidden="true" />
      <ChevronLeft v-else aria-hidden="true" />
      <span v-if="showLabels" class="hidden sm:inline">{{ previousLabel }}</span>
    </Button>

    <template v-for="item in pageItems" :key="item">
      <span
        v-if="typeof item === 'string'"
        class="flex size-8 select-none items-center justify-center text-sm text-muted-foreground"
        aria-hidden="true"
      >
        …
      </span>
      <Button
        v-else
        :variant="item === currentPage ? 'default' : 'outline'"
        size="icon-sm"
        :aria-label="pageLabel(item)"
        :aria-current="item === currentPage ? 'page' : undefined"
        :disabled="disabled"
        @click="goToPage(item)"
      >
        {{ toPersianDigits(item) }}
      </Button>
    </template>

    <Button
      variant="outline"
      size="sm"
      :disabled="isNextDisabled"
      :aria-label="nextLabel"
      @click="goToPage(currentPage + 1)"
    >
      <span v-if="showLabels" class="hidden sm:inline">{{ nextLabel }}</span>
      <ChevronLeft v-if="dir === 'rtl'" aria-hidden="true" />
      <ChevronRight v-else aria-hidden="true" />
    </Button>
  </nav>
</template>
