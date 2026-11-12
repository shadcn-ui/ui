# جهت نوشتار

ارائه‌دهنده‌ای برای تعیین جهت نوشتار محتوای فرزند و دریافت جهت جاری.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="direction" />

## استفاده

```vue
<DirectionProvider dir="ltr">
  <section>محتوای چپ‌به‌راست؛ منوها، تب‌ها و تقویم‌های داخل آن هم LTR می‌شوند.</section>
</DirectionProvider>
```

`DirectionProvider` جهت را هم روی عنصر پوشاننده (`dir`) و هم در context سازه و Radix Vue
قرار می‌دهد؛ بنابراین همه کامپوننت‌هایی که `dir` صریح نگرفته‌اند از آن پیروی می‌کنند. اگر
نمی‌خواهید عنصر اضافه‌ای رندر شود، `as-child` بدهید. نام قدیمی `direction` نیز پذیرفته
می‌شود و در نبود هر دو، جهت والد (پیش‌فرض `rtl`) به ارث می‌رسد.

در اجزای فرزند، جهت جاری را به‌صورت واکنشی با `useDirection()` دریافت کنید:

```ts
import { useDirection } from '@saaze/ui'

const direction = useDirection() // ComputedRef<'rtl' | 'ltr'>
```
