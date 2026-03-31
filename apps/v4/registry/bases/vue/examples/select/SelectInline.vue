<script setup lang="ts">
import { Input } from "@/ui/input"
import { NativeSelect, NativeSelectOption } from "@/ui/native-select"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
</script>

<template>
  <div class="flex items-center gap-2">
    <Input placeholder="Search..." class="flex-1" />
    <Select>
      <SelectTrigger class="w-[140px]">
        <SelectValue placeholder="Filter" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">
            All
          </SelectItem>
          <SelectItem value="active">
            Active
          </SelectItem>
          <SelectItem value="inactive">
            Inactive
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <NativeSelect class="w-[140px]">
      <NativeSelectOption value="">
        Sort by
      </NativeSelectOption>
      <NativeSelectOption value="name">
        Name
      </NativeSelectOption>
      <NativeSelectOption value="date">
        Date
      </NativeSelectOption>
      <NativeSelectOption value="status">
        Status
      </NativeSelectOption>
    </NativeSelect>
  </div>
</template>
