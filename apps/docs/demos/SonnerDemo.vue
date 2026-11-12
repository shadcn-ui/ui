<script setup lang="ts">
import { Button, Sonner, sonner } from '@saaze/ui'

function showDefault() {
  sonner('رویداد ثبت شد', {
    description: 'جلسه تیم، پنجشنبه ساعت ۱۰ صبح',
    action: { label: 'بازگردانی', onClick: () => sonner.info('ثبت رویداد لغو شد.') },
  })
}

function showPromise() {
  sonner.promise(new Promise((resolve) => setTimeout(resolve, 1500)), {
    loading: 'در حال ذخیره‌سازی…',
    success: 'تغییرات ذخیره شد.',
    error: 'ذخیره‌سازی ناموفق بود.',
  })
}
</script>

<template>
  <div class="flex flex-wrap items-center justify-center gap-2">
    <Button variant="outline" @click="showDefault">اعلان ساده</Button>
    <Button variant="outline" @click="sonner.success('پرداخت با موفقیت انجام شد.')">موفقیت</Button>
    <Button variant="outline" @click="sonner.error('اتصال به سرور برقرار نشد.')">خطا</Button>
    <Button variant="outline" @click="showPromise">وعده (Promise)</Button>
    <Sonner rich-colors close-button />
  </div>
</template>
