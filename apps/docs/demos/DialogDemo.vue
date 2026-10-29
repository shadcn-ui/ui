<script setup lang="ts">
import { ref } from 'vue'
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
} from '@saaze/ui'

const open = ref(false)
const title = ref('')
</script>

<template>
  <div class="grid w-full place-items-center">
    <Dialog v-model:open="open">
      <DialogTrigger as-child>
        <Button variant="outline">ایجاد پروژه جدید</Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>پروژه تازه</DialogTitle>
          <DialogDescription>
            نام پروژه را وارد کنید. بعد از ایجاد می‌توانید اعضای تیم را اضافه کنید.
          </DialogDescription>
        </DialogHeader>

        <div class="grid gap-2 py-2">
          <Label for="dialog-project-title">نام پروژه</Label>
          <Input id="dialog-project-title" v-model="title" placeholder="مثلاً فروشگاه سازه" />
        </div>

        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">انصراف</Button>
          </DialogClose>
          <DialogClose as-child>
            <Button>ایجاد پروژه</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <p class="mt-4 text-xs text-muted-foreground" aria-live="polite">
      وضعیت دیالوگ: {{ open ? 'باز' : 'بسته' }}
    </p>
  </div>
</template>
