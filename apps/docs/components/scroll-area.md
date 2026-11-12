# ناحیه پیمایش

ناحیه پیمایش Radix Vue با نوار پیمایش قابل‌دسترس و جهت پیش‌فرض راست‌به‌چپ.

<script setup>
import ScrollAreaDemo from '../demos/ScrollAreaDemo.vue'
import scrollAreaDemoCode from '../demos/ScrollAreaDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="پیمایش محتوای بلند" description="محتوا را پیمایش کنید؛ نوار عمودی با جهت RTL هماهنگ است." :code="scrollAreaDemoCode">
  <ScrollAreaDemo />
</DemoBlock>

## استفاده

```vue
<ScrollArea class="h-52 rounded-md border" type="always">
  <ScrollAreaViewport class="p-4">
    <p>محتوای بلند این ناحیه قابل پیمایش است.</p>
  </ScrollAreaViewport>
  <ScrollAreaScrollbar orientation="vertical">
    <ScrollAreaThumb />
  </ScrollAreaScrollbar>
  <ScrollAreaCorner />
</ScrollArea>
```

`ScrollArea` ویژگی‌های `type` (`hover`، `scroll`، `auto` یا `always`)، `dir` و
`scrollHideDelay` را از Radix Vue می‌پذیرد. برای پیمایش افقی، جهت نوار را روی
`orientation="horizontal"` بگذارید.

`ScrollBar` میان‌بر هم‌نام shadcn-vue است که نوار پیمایش را همراه با دستگیره رندر می‌کند:
`<ScrollBar orientation="horizontal" />`.
