<script setup lang="ts">
import { ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-vue-next'
import { Button } from '@saaze/ui'
</script>

<template>
  <div class="grid w-full gap-8">
    <div class="grid gap-3">
      <p class="text-xs font-medium text-muted-foreground">گونه‌ها</p>
      <div class="flex flex-wrap items-center gap-3">
        <Button>ثبت سفارش</Button>
        <Button variant="secondary">ذخیره پیش‌نویس</Button>
        <Button variant="outline">ویرایش</Button>
        <Button variant="soft">پرداخت سریع</Button>
        <Button variant="ghost">انصراف</Button>
        <Button variant="destructive">
          <Trash2 aria-hidden="true" />
          حذف
        </Button>
        <Button variant="link">راهنما</Button>
      </div>
    </div>

    <div class="grid gap-3">
      <p class="text-xs font-medium text-muted-foreground">اندازه‌ها</p>
      <div class="flex flex-wrap items-center gap-3">
        <Button size="sm">کوچک</Button>
        <Button>پیش‌فرض</Button>
        <Button size="lg">بزرگ</Button>
        <Button size="icon" aria-label="افزودن">
          <Plus aria-hidden="true" />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="افزودن مورد">
          <Plus aria-hidden="true" />
        </Button>
      </div>
    </div>

    <div class="grid gap-3">
      <p class="text-xs font-medium text-muted-foreground">حالت‌ها</p>
      <div class="flex flex-wrap items-center gap-3">
        <Button disabled>غیرفعال</Button>
        <Button disabled>
          <Loader2 class="animate-spin" aria-hidden="true" />
          در حال ارسال…
        </Button>
        <Button variant="outline">
          مرحله بعد
          <ArrowLeft aria-hidden="true" />
        </Button>
      </div>
    </div>
  </div>
</template>
