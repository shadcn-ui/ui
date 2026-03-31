<script setup lang="ts">
import { Button } from "@/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/ui/dialog"
import { Example } from "@/components"
</script>

<template>
  <Example title="No Close Button" class="items-center justify-center">
    <Dialog>
      <DialogTrigger :as-child="true">
        <Button variant="outline">
          No Close Button
        </Button>
      </DialogTrigger>
      <DialogContent :show-close-button="false">
        <DialogHeader>
          <DialogTitle>No Close Button</DialogTitle>
          <DialogDescription>
            This dialog doesn't have a close button in the top-right
            corner.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose :as-child="true">
            <Button variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Example>
</template>
