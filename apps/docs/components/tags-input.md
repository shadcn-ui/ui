# ورودی برچسب

افزودن و حذف چند مقدار متنی در یک ورودی، بر پایه TagsInput در Radix Vue.

<script setup>
import TagsInputDemo from '../demos/TagsInputDemo.vue'
import demoCode from '../demos/TagsInputDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="برچسب‌های مقاله" description="برچسب تازه بنویسید و Enter بزنید؛ با Backspace برچسب آخر را حذف کنید." :code="demoCode">

  <TagsInputDemo />
</DemoBlock>

## استفاده

```vue
<TagsInput v-model="tags" delimiter="،">
  <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
    <TagsInputItemText />
    <TagsInputItemDelete />
  </TagsInputItem>
  <TagsInputInput placeholder="برچسب جدید…" />
</TagsInput>
```

## اجزا

`TagsInput` ویژگی‌های `modelValue`، `max`، `delimiter`، `addOnPaste`، `duplicate`، `disabled` و `dir` را می‌پذیرد. برای فارسی‌نویسان، `delimiter="،"` (ویرگول فارسی) را پیشنهاد می‌کنیم. `TagsInputClear` برای پاک‌کردن همه برچسب‌ها نیز صادر شده است.
