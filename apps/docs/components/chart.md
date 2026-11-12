# نمودار

ظرف نمودار دسترس‌پذیر با متغیرهای رنگی برای ساخت نمودارهای SVG یا کتابخانه‌های نمودارسازی.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="chart" />

## استفاده

```vue
<ChartContainer
  label="نمودار فروش"
  :config="{ sales: { label: 'فروش', color: 'hsl(var(--primary))' } }"
>
  <svg viewBox="0 0 320 140" role="presentation">
    <path d="M20 110 90 70 160 85 230 35 300 50" fill="none" stroke="var(--color-sales)" />
  </svg>
</ChartContainer>
```

برای نمودارهای اختصاصی، محتوای SVG یا کامپوننت کتابخانه نمودارسازی خود را داخل `ChartContainer` قرار دهید.
