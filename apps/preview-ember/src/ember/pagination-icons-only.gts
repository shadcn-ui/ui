import {
  Field,
  FieldLabel,
} from '@/ember-ui/field';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/ember-ui/pagination';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';

<template>
  <div class="flex items-center justify-between gap-4">
    <Field @orientation="horizontal" @class="w-fit">
      <FieldLabel @for="select-rows-per-page">Rows per page</FieldLabel>
      <Select>
        <SelectTrigger @class="w-20" id="select-rows-per-page">
          <SelectValue @placeholder="25" />
        </SelectTrigger>
        <SelectContent @align="start">
          <SelectGroup>
            <SelectItem @value="10">10</SelectItem>
            <SelectItem @value="25">25</SelectItem>
            <SelectItem @value="50">50</SelectItem>
            <SelectItem @value="100">100</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </Field>
    <Pagination @class="mx-0 w-auto">
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href="#" />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href="#" />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</template>
