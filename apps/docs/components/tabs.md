# زبانه‌ها

محتوای بخش‌بندی‌شده با جابه‌جایی صفحه‌کلیدی بین زبانه‌ها.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="layout" title="آکاردئون، محتوای تاشو و زبانه‌ها" description="میان زبانه‌های حساب و امنیت جابه‌جا شوید." />

## استفاده

```vue
<Tabs v-model="tab">
  <TabsList>
    <TabsTrigger value="account">حساب</TabsTrigger>
    <TabsTrigger value="security">امنیت</TabsTrigger>
  </TabsList>
  <TabsContent value="account">اطلاعات حساب کاربری</TabsContent>
  <TabsContent value="security">تنظیمات امنیتی</TabsContent>
</Tabs>
```
