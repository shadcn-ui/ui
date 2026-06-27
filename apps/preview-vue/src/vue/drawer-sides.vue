<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'

const DRAWER_SIDES = ['top', 'right', 'bottom', 'left'] as const
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <Drawer
      v-for="side in DRAWER_SIDES"
      :key="side"
      :direction="side === 'bottom' ? undefined : side"
    >
      <DrawerTrigger as-child>
        <Button variant="outline" class="capitalize">
          {{ side }}
        </Button>
      </DrawerTrigger>
      <DrawerContent class="data-[vaul-drawer-direction=bottom]:max-h-[50vh] data-[vaul-drawer-direction=top]:max-h-[50vh]">
        <DrawerHeader>
          <DrawerTitle>Move Goal</DrawerTitle>
          <DrawerDescription>
            Set your daily activity goal.
          </DrawerDescription>
        </DrawerHeader>
        <div class="no-scrollbar overflow-y-auto px-4">
          <p
            v-for="i in 10"
            :key="i"
            class="mb-4 leading-normal"
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
        <DrawerFooter>
          <Button>Submit</Button>
          <DrawerClose as-child>
            <Button variant="outline">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  </div>
</template>
