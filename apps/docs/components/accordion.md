# آکاردئون

پرسش‌ها و محتوای تاشو با مدیریت صفحه‌کلید و دسترس‌پذیری Radix Vue.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="layout" title="آکاردئون و محتوای تاشو" description="آکاردئون، Collapsible و Tabs را در یک پیش‌نمایش تعاملی ببینید." />

## استفاده

```vue
<Accordion v-model="value" type="single" collapsible>
  <AccordionItem value="delivery">
    <AccordionTrigger>سفارش چه زمانی می‌رسد؟</AccordionTrigger>
    <AccordionContent>معمولاً طی ۲ تا ۴ روز کاری.</AccordionContent>
  </AccordionItem>
</Accordion>
```

اجزای اصلی: `Accordion`، `AccordionItem`، `AccordionTrigger` و `AccordionContent`.
