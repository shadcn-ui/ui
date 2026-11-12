# ردگیری

فهرست مرحله‌های کاری با آیکن، عنوان و جزئیات بازشونده.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="trace" />

## استفاده

```vue
<Trace>
  <TraceCollapsible>
    <TraceCollapsibleTrigger>
      <TraceLine>
        <TraceIcon><Terminal /></TraceIcon>
        <TraceTitle>اجرای بررسی نوع‌ها</TraceTitle>
      </TraceLine>
    </TraceCollapsibleTrigger>
    <TraceCollapsibleContent>بررسی با موفقیت پایان یافت.</TraceCollapsibleContent>
  </TraceCollapsible>
</Trace>
```
