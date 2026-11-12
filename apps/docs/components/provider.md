# ارائه‌دهنده سازه

`SaazeProvider` تنظیمات Radix Vue و جهت پیش‌فرض راست‌به‌چپ را برای فرزندان فراهم می‌کند.

<script setup>
import ProviderDemo from '../demos/ProviderDemo.vue'
</script>

## پیش‌نمایش

<DemoBlock title="تغییر جهت سراسری" description="جهت را عوض کنید تا مقدار RTL یا LTR به ارائه‌دهنده منتقل شود.">
  <ProviderDemo />
</DemoBlock>

## استفاده

```vue
<SaazeProvider dir="rtl">
  <App />
</SaazeProvider>
```

می‌توانید ارائه‌دهنده را دور کل برنامه یا فقط بخش فارسی قرار دهید. مقدار پیش‌فرض `dir` برابر
`rtl` است.

## ارث‌بری جهت

همه کامپوننت‌های سازه (منوها، تب‌ها، تقویم‌ها، صفحه‌بندی، کشوها و …) جهت را از نزدیک‌ترین
`SaazeProvider` یا `DirectionProvider` می‌خوانند؛ فقط وقتی `dir` را روی خود کامپوننت بدهید،
مقدار والد نادیده گرفته می‌شود. برای یک ناحیه LTR داخل برنامه RTL:

```vue
<SaazeProvider dir="rtl">
  <App />
  <DirectionProvider dir="ltr">
    <CodeSettingsPanel />
  </DirectionProvider>
</SaazeProvider>
```
