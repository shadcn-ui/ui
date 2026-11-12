# کارت شناور

با مکث روی پیوند، اطلاعات تکمیلی را بدون ترک صفحه نمایش می‌دهد.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="کارت شناور و لایه‌های رویی" description="روی پیوند @saaze_ui مکث کنید تا کارت اطلاعات باز شود." />

## استفاده

```vue
<HoverCard>
  <HoverCardTrigger as-child><Button variant="link">@saaze_ui</Button></HoverCardTrigger>
  <HoverCardContent>
    <p class="font-medium">سازه UI</p>
    <p class="text-sm text-muted-foreground">کتابخانه فارسی Vue 3</p>
  </HoverCardContent>
</HoverCard>
```
