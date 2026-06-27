<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet'

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Sheet
      v-for="side in SHEET_SIDES"
      :key="side"
    >
      <SheetTrigger as-child>
        <Button variant="outline" class="capitalize">
          {{ side }}
        </Button>
      </SheetTrigger>
      <SheetContent
        :side="side"
        class="data-[side=bottom]:max-h-[50vh] data-[side=top]:max-h-[50vh]"
      >
        <SheetHeader>
          <SheetTitle>Edit profile</SheetTitle>
          <SheetDescription>
            Make changes to your profile here. Click save when you're done.
          </SheetDescription>
        </SheetHeader>
        <div class="no-scrollbar overflow-y-auto px-4">
          <p
            v-for="i in 10"
            :key="i"
            class="mb-2 leading-relaxed"
          >
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed
            do eiusmod tempor incididunt ut labore et dolore magna aliqua.
            Ut enim ad minim veniam, quis nostrud exercitation ullamco
            laboris nisi ut aliquip ex ea commodo consequat. Duis aute
            irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat
            cupidatat non proident, sunt in culpa qui officia deserunt
            mollit anim id est laborum.
          </p>
        </div>
        <SheetFooter>
          <Button type="submit">
            Save changes
          </Button>
          <SheetClose as-child>
            <Button variant="outline">
              Cancel
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  </div>
</template>
