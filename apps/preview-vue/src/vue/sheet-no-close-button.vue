<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet'
</script>

<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button variant="outline">
        Open Sheet
      </Button>
    </SheetTrigger>
    <SheetContent :show-close-button="false">
      <SheetHeader>
        <SheetTitle>No Close Button</SheetTitle>
        <SheetDescription>
          This sheet doesn't have a close button in the top-right corner.
          Click outside to close.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
