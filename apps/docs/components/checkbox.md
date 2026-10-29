# چک‌باکس

<div class="saaze-badges">
  <span>Vue 3</span>
  <span>Radix Vue Checkbox</span>
  <span>Indeterminate</span>
</div>

<p class="saaze-lead">
  چک‌باکس برای انتخاب‌های چندگانه و حالت نیمه‌انتخاب. مقدار آن با
  <code>v-model:checked</code> کنترل می‌شود.
</p>

<script setup>
import CheckboxDemo from '../demos/CheckboxDemo.vue'
import checkboxDemoCode from '../demos/CheckboxDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="حالت‌های چک‌باکس" description="انتخاب‌شده، انتخاب‌نشده، نیمه‌انتخاب و غیرفعال." :code="checkboxDemoCode">

  <CheckboxDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { Checkbox, Label } from '@saaze/ui'
import { ref } from 'vue'

const accepted = ref(false)
</script>

<template>
  <div class="flex items-center gap-2">
    <Checkbox id="terms" v-model:checked="accepted" />
    <Label for="terms">قوانین را می‌پذیرم</Label>
  </div>
</template>
```

## حالت نیمه‌انتخاب

برای «انتخاب همه» از مقدار `indeterminate` استفاده کنید. پس از اولین تعامل، مقدار به
`boolean` تبدیل می‌شود:

```vue
<script setup lang="ts">
import { ref } from 'vue'

const state = ref<boolean | 'indeterminate'>('indeterminate')
</script>

<template>
  <Checkbox :checked="state" @update:checked="state = $event" aria-label="انتخاب همه" />
</template>
```

## API

| ویژگی            | نوع                          | پیش‌فرض  | توضیح                                 |
| ---------------- | ---------------------------- | -------- | ------------------------------------- |
| `checked`        | `boolean \| "indeterminate"` | —        | مقدار کنترل‌شده؛ با `v-model:checked` |
| `defaultChecked` | `boolean`                    | —        | مقدار اولیه در حالت کنترل‌نشده        |
| `disabled`       | `boolean`                    | `false`  | غیرفعال‌کردن                          |
| `required`       | `boolean`                    | `false`  | الزامی در فرم                         |
| `name`           | `string`                     | —        | نام فیلد فرم                          |
| `value`          | `string`                     | `"on"`   | مقدار ارسالی در فرم                   |
| `id`             | `string`                     | —        | شناسه برای اتصال به Label             |
| `as`             | `string \| Component`        | `button` | عنصر ریشه                             |
| `asChild`        | `boolean`                    | `false`  | انتقال ویژگی‌ها به فرزند              |
| `class`          | `string`                     | —        | کلاس‌های اضافی                        |

### رویدادها

| رویداد           | نوع       | توضیح              |
| ---------------- | --------- | ------------------ |
| `update:checked` | `boolean` | تغییر وضعیت انتخاب |

## فرم‌ها

با `name` و `value` می‌توانید چک‌باکس را در فرم HTML شرکت دهید:

```vue
<form>
  <Checkbox name="newsletter" value="yes" v-model:checked="subscribed" />
</form>
```

## دسترس‌پذیری

- چک‌باکس نقش `checkbox` و وضعیت `aria-checked` را خودکار مدیریت می‌کند.
- همیشه با `Label` یا `aria-label` نامی برای آن فراهم کنید.
- حالت نیمه‌انتخاب با `aria-checked="mixed"` به فناوری کمکی اعلام می‌شود.
- برای گروه چک‌باکس‌ها از `fieldset` و `legend` استفاده کنید.
