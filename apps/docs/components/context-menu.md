# منوی زمینه‌ای

منوی زمینه‌ای با کلیک راست یا لمس طولانی باز می‌شود. مدیریت فوکوس، پیمایش صفحه‌کلید، زیرمنوها
و انتخاب‌های چک‌باکسی و رادیویی بر عهده primitiveهای Radix Vue است.

<script setup>
import ContextMenuDemo from '../demos/ContextMenuDemo.vue'
import contextMenuDemoCode from '../demos/ContextMenuDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="گزینه‌های سند" description="روی ناحیه پیش‌نمایش کلیک راست کنید تا منوی زمینه‌ای باز شود." :code="contextMenuDemoCode">

  <ContextMenuDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuTrigger,
} from '@saaze/ui'
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex min-h-32 items-center justify-center rounded-md border">
      روی این ناحیه کلیک راست کنید
    </ContextMenuTrigger>
    <ContextMenuContent>
      <ContextMenuLabel>گزینه‌های سند</ContextMenuLabel>
      <ContextMenuSeparator />
      <ContextMenuItem>
        کپی
        <ContextMenuShortcut>⌘C</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem disabled>چسباندن</ContextMenuItem>
    </ContextMenuContent>
  </ContextMenu>
</template>
```

## اجزا

علاوه بر اجزای نمونه، `ContextMenuCheckboxItem`، `ContextMenuRadioGroup` و
`ContextMenuRadioItem` برای گزینه‌های انتخابی، و `ContextMenuSub`،
`ContextMenuSubTrigger` و `ContextMenuSubContent` برای زیرمنوها در دسترس‌اند.
`ContextMenuArrow` و `ContextMenuGroup` نیز از Radix Vue صادر می‌شوند.

ریشه جهت RTL را به‌صورت پیش‌فرض دارد و ویژگی `dir` برای تغییر جهت را می‌پذیرد. ویژگی‌های
موقعیت‌یابی مانند `sideOffset` و `collisionPadding` را روی محتوا تنظیم کنید؛ موقعیت منو
نسبت به نقطه کلیک توسط primitive مدیریت می‌شود.
