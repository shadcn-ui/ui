<script setup lang="ts">
import { Button } from '@/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import { Input } from '@/ui/input'
import { Label } from '@/ui/label'
</script>

<template>
  <Dialog>
    <form>
      <DialogTrigger as-child>
        <Button variant="outline">
          فتح الحوار
        </Button>
      </DialogTrigger>
      <DialogContent class="sm:max-w-sm" dir="rtl">
        <DialogHeader>
          <DialogTitle>تعديل الملف الشخصي</DialogTitle>
          <DialogDescription>
            قم بإجراء تغييرات على ملفك الشخصي هنا. انقر فوق حفظ عند الانتهاء.
          </DialogDescription>
        </DialogHeader>
        <div class="grid gap-4">
          <div class="grid gap-3">
            <Label for="name-rtl">الاسم</Label>
            <Input id="name-rtl" name="name" default-value="Pedro Duarte" />
          </div>
          <div class="grid gap-3">
            <Label for="username-rtl">اسم المستخدم</Label>
            <Input id="username-rtl" name="username" default-value="@peduarte" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose as-child>
            <Button variant="outline">
              إلغاء
            </Button>
          </DialogClose>
          <Button type="submit">
            حفظ التغييرات
          </Button>
        </DialogFooter>
      </DialogContent>
    </form>
  </Dialog>
</template>
