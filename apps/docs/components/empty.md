# حالت خالی

الگوی قابل ترکیب برای نمایش وضعیت بدون داده، پیام راهنما و اقدام بعدی.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="empty" />

## استفاده

```vue
<Empty class="border border-dashed">
  <EmptyHeader>
    <EmptyMedia><FolderOpen /></EmptyMedia>
    <EmptyTitle>هنوز فایلی ندارید</EmptyTitle>
    <EmptyDescription>برای شروع، فایلی بارگذاری کنید.</EmptyDescription>
  </EmptyHeader>
  <EmptyContent><Button>بارگذاری فایل</Button></EmptyContent>
</Empty>
```
