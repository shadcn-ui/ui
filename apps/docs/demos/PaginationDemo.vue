<script setup lang="ts">
import { ref } from 'vue'
import { Pagination } from '@saaze/ui'
import { toPersianDigits } from '@saaze/utils'

const page = ref(4)
const pageCount = 18
</script>

<template>
  <div class="grid w-full gap-6">
    <div class="grid gap-2">
      <p class="text-xs font-medium text-muted-foreground">صفحه‌بندی کامل</p>
      <Pagination v-model:page="page" :page-count="pageCount" />
    </div>

    <div class="grid gap-2">
      <p class="text-xs font-medium text-muted-foreground">بدون برچسب متنی</p>
      <Pagination
        v-model:page="page"
        :page-count="pageCount"
        :show-labels="false"
        :sibling-count="2"
      />
    </div>

    <p class="text-xs text-muted-foreground">
      صفحه فعال: <span class="font-semibold text-foreground">{{ toPersianDigits(page) }}</span>
    </p>
  </div>
</template>
