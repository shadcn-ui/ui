<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
} from '@/ui/pagination'
</script>

<template>
  <Pagination :items-per-page="1" :total="5" :default-page="2">
    <PaginationContent v-slot="{ items }">
      <template v-for="(item, index) in items" :key="index">
        <PaginationItem
          v-if="item.type === 'page'"
          :value="item.value"
          :is-active="item.value === 2"
        >
          {{ item.value }}
        </PaginationItem>
      </template>
    </PaginationContent>
  </Pagination>
</template>
