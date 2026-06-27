<script setup lang="ts">
import {
  Field,
  FieldLabel,
} from '@/ui/field'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/ui/pagination'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
</script>

<template>
  <div class="flex items-center justify-between gap-4">
    <Field orientation="horizontal" class="w-fit">
      <FieldLabel for="select-rows-per-page">Rows per page</FieldLabel>
      <Select default-value="25">
        <SelectTrigger class="w-20" id="select-rows-per-page">
          <SelectValue />
        </SelectTrigger>
        <SelectContent align="start">
          <SelectGroup>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="25">25</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
    <Pagination class="mx-0 w-auto" :total="100" :items-per-page="25">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</template>
