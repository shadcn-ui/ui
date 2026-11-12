# فرم

اجزای ترکیبی فرم برای فیلدهای دسترس‌پذیر و ادغام با VeeValidate و Zod.

<script setup>
import FormDemo from '../demos/FormDemo.vue'
import formDemoCode from '../demos/FormDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="فرم فارسی با اعتبارسنجی" description="ارسال فرم را با نام و ایمیل معتبر آزمایش کنید." :code="formDemoCode">
  <FormDemo />
</DemoBlock>

## استفاده

```vue
<FormField v-slot="{ componentField }" name="email">
  <FormItem>
    <FormLabel>ایمیل</FormLabel>
    <FormControl>
      <Input v-bind="componentField" type="email" dir="ltr" />
    </FormControl>
    <FormMessage />
  </FormItem>
</FormField>
```

اجزای پایه شامل `FormField`، `FormItem`، `FormLabel`، `FormControl`، `FormDescription` و
`FormMessage` هستند.
