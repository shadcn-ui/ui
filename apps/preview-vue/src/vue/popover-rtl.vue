<script setup lang="ts">
import { ref } from 'vue'
import { Button } from '@/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from '@/ui/popover'

const physicalSides = ['left', 'top', 'bottom', 'right'] as const

const labels: Record<string, string> = {
  left: 'يسار',
  top: 'أعلى',
  bottom: 'أسفل',
  right: 'يمين',
}
</script>

<template>
  <div class="flex flex-wrap justify-center gap-2" dir="rtl">
    <Popover v-for="side in physicalSides" :key="side">
      <PopoverTrigger as-child>
        <Button variant="outline">{{ labels[side] }}</Button>
      </PopoverTrigger>
      <PopoverContent :side="side" dir="rtl">
        <PopoverHeader>
          <PopoverTitle>الأبعاد</PopoverTitle>
          <PopoverDescription>تعيين الأبعاد للطبقة.</PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  </div>
</template>
