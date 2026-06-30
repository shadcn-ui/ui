<script setup lang="ts">
import { ref } from 'vue'
import { useMediaQuery } from '@vueuse/core'
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
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
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'

const isDesktop = useMediaQuery('(min-width: 768px)')
const open = ref(false)
</script>

<template>
  <Dialog v-if="isDesktop" v-model:open="open">
    <DialogTrigger as-child>
      <Button variant="outline">
        Edit Profile
      </Button>
    </DialogTrigger>
    <DialogContent class="sm:max-w-[425px]">
      <DialogHeader>
        <DialogTitle>Edit profile</DialogTitle>
        <DialogDescription>
          Make changes to your profile here. Click save when you're done.
        </DialogDescription>
      </DialogHeader>
      <form class="grid items-start gap-6">
        <div class="grid gap-3">
          <Label for="email">Email</Label>
          <Input type="email" id="email" default-value="shadcn@example.com" />
        </div>
        <div class="grid gap-3">
          <Label for="username">Username</Label>
          <Input id="username" default-value="@shadcn" />
        </div>
        <Button type="submit">
          Save changes
        </Button>
      </form>
    </DialogContent>
  </Dialog>

  <Drawer v-else v-model:open="open">
    <DrawerTrigger as-child>
      <Button variant="outline">
        Edit Profile
      </Button>
    </DrawerTrigger>
    <DrawerContent>
      <DrawerHeader class="text-left">
        <DrawerTitle>Edit profile</DrawerTitle>
        <DrawerDescription>
          Make changes to your profile here. Click save when you're done.
        </DrawerDescription>
      </DrawerHeader>
      <form class="grid items-start gap-6 px-4">
        <div class="grid gap-3">
          <Label for="email-drawer">Email</Label>
          <Input type="email" id="email-drawer" default-value="shadcn@example.com" />
        </div>
        <div class="grid gap-3">
          <Label for="username-drawer">Username</Label>
          <Input id="username-drawer" default-value="@shadcn" />
        </div>
        <Button type="submit">
          Save changes
        </Button>
      </form>
      <DrawerFooter class="pt-2">
        <DrawerClose as-child>
          <Button variant="outline">
            Cancel
          </Button>
        </DrawerClose>
      </DrawerFooter>
    </DrawerContent>
  </Drawer>
</template>
