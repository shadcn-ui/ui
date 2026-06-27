<script setup lang="ts">
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
  <Select disabled>
    <SelectTrigger class="w-full max-w-48">
      <SelectValue placeholder="Select a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectGroup>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana">Banana</SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
        <SelectItem value="grapes" disabled>Grapes</SelectItem>
        <SelectItem value="pineapple">Pineapple</SelectItem>
      </SelectGroup>
    </SelectContent>
  </Select>
</template>
