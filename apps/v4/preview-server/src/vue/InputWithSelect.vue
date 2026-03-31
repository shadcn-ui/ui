<script setup lang="ts">
import { Input } from "@/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/ui/select"
</script>

<template>
  <div class="flex w-full gap-2">
    <Input type="text" placeholder="Enter amount" class="flex-1" />
    <Select default-value="usd">
      <SelectTrigger class="w-32">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="usd">
          USD
        </SelectItem>
        <SelectItem value="eur">
          EUR
        </SelectItem>
        <SelectItem value="gbp">
          GBP
        </SelectItem>
      </SelectContent>
    </Select>
  </div>
</template>
