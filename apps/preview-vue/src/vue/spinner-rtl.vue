<script setup lang="ts">
import {
  Item,
  ItemContent,
  ItemMedia,
  ItemTitle,
} from '@/ui/item'
import { Spinner } from '@/ui/spinner'
</script>

<template>
  <div class="flex w-full max-w-xs flex-col gap-4 [--radius:1rem]" dir="rtl">
    <Item variant="muted" dir="rtl">
      <ItemMedia>
        <Spinner />
      </ItemMedia>
      <ItemContent>
        <ItemTitle class="line-clamp-1">جاري معالجة الدفع...</ItemTitle>
      </ItemContent>
      <ItemContent class="flex-none justify-end">
        <span class="text-sm tabular-nums">١٠٠.٠٠ دولار</span>
      </ItemContent>
    </Item>
  </div>
</template>
