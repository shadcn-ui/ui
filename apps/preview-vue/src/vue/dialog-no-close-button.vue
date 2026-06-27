<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
</script>

<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline">
        No Close Button
      </Button>
    </DialogTrigger>
    <DialogContent :show-close-button="false">
      <DialogHeader>
        <DialogTitle>No Close Button</DialogTitle>
        <DialogDescription>
          This dialog doesn't have a close button in the top-right corner.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
