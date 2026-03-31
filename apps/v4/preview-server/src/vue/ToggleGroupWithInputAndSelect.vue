<script setup lang="ts">
import { Input } from "@/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
import { ToggleGroup, ToggleGroupItem } from "@/ui/toggle-group"
</script>

<template>
  <div class="flex items-center gap-2">
    <Input type="search" placeholder="Search..." class="flex-1" />
    <Select default-value="all">
      <SelectTrigger class="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectItem value="all">
            All
          </SelectItem>
          <SelectItem value="active">
            Active
          </SelectItem>
          <SelectItem value="archived">
            Archived
          </SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
    <ToggleGroup type="single" default-value="grid" variant="outline">
      <ToggleGroupItem value="grid" aria-label="Grid view">
        Grid
      </ToggleGroupItem>
      <ToggleGroupItem value="list" aria-label="List view">
        List
      </ToggleGroupItem>
    </ToggleGroup>
  </div>
</template>
