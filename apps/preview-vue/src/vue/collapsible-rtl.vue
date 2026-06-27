<script setup lang="ts">
import ChevronsUpDown from "@material-symbols/svg-400/rounded/unfold_more.svg?component"
import { ref } from 'vue'
import { Button } from '@/ui/button'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'

const isOpen = ref(false)
</script>

<template>
  <Collapsible
    v-model:open="isOpen"
    class="flex w-[350px] flex-col gap-2"
    dir="rtl"
  >
    <div class="flex items-center justify-between gap-4 px-4">
      <h4 class="text-sm font-semibold">الطلب #4189</h4>
      <CollapsibleTrigger as-child>
        <Button variant="ghost" size="icon" class="size-8">
          <ChevronsUpDown />
          <span class="sr-only">Toggle details</span>
        </Button>
      </CollapsibleTrigger>
    </div>
    <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
      <span class="text-muted-foreground">الحالة</span>
      <span class="font-medium">تم الشحن</span>
    </div>
    <CollapsibleContent class="flex flex-col gap-2">
      <div class="rounded-md border px-4 py-2 text-sm">
        <p class="font-medium">عنوان الشحن</p>
        <p class="text-muted-foreground">100 Market St, San Francisco</p>
      </div>
      <div class="rounded-md border px-4 py-2 text-sm">
        <p class="font-medium">العناصر</p>
        <p class="text-muted-foreground">2x سماعات الاستوديو</p>
      </div>
    </CollapsibleContent>
  </Collapsible>
</template>
