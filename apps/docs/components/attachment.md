# پیوست

نمایش فایل یا تصویر همراه با نام، مشخصات، وضعیت و اقدام‌های مرتبط.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="attachment" />

## استفاده

```vue
<Attachment>
  <AttachmentMedia><FileText /></AttachmentMedia>
  <AttachmentContent>
    <AttachmentTitle>گزارش.pdf</AttachmentTitle>
    <AttachmentDescription>PDF · ۲٫۴ مگابایت</AttachmentDescription>
  </AttachmentContent>
  <AttachmentActions>
    <AttachmentAction aria-label="حذف گزارش"><X /></AttachmentAction>
  </AttachmentActions>
</Attachment>
```

اجزای `AttachmentGroup`، `AttachmentTrigger` و بخش‌های رسانه، محتوا و اقدام‌ها برای چیدمان‌های سفارشی نیز در دسترس هستند.
