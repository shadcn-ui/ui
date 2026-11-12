# بلوک کد

نمایش کد و خروجی با سربرگ، محتوای چپ‌به‌راست و دکمه کپی.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="code-block" />

## استفاده

```vue
<CodeBlock>
  <CodeBlockHeader>
    <CodeBlockTitle>hello.ts</CodeBlockTitle>
    <CodeBlockActions>
      <CodeBlockCopyButton value="console.log('hello')" />
    </CodeBlockActions>
  </CodeBlockHeader>
  <CodeBlockContent>console.log('hello')</CodeBlockContent>
</CodeBlock>
```

محتوای کد همیشه با `dir="ltr"` رندر می‌شود. رویدادهای `copied` و `error` نتیجه کپی را گزارش می‌کنند.
