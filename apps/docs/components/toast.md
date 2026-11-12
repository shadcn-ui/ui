# اعلان

پیام کوتاه و گذرا برای تأیید عملیات یا اطلاع‌رسانی وضعیت.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="اعلان‌ها و لایه‌های رویی" description="دکمه «نمایش اعلان» یک پیام موفقیت فارسی نشان می‌دهد." />

## استفاده

```ts
import { toast } from '@saaze/ui'

toast({
  title: 'تغییرات ذخیره شد',
  description: 'تنظیمات شما با موفقیت به‌روزرسانی شد.',
})
```

برای نمایش اعلان‌ها، یک‌بار `Toaster` را در ریشه برنامه قرار دهید.
