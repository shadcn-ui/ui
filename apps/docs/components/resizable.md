# تغییر اندازه

گروه پنل‌های قابل تغییر اندازه با صفحه‌کلید و اشاره‌گر کار می‌کند و بر پایه primitiveهای
Splitter در Radix Vue ساخته شده است.

<script setup>
import ResizableDemo from '../demos/ResizableDemo.vue'
import resizableDemoCode from '../demos/ResizableDemo.vue?raw'
</script>

## پیش‌نمایش

<DemoBlock title="دو پنل قابل تغییر اندازه" description="دستگیره را بکشید یا با صفحه‌کلید روی آن اندازه پنل‌ها را تغییر دهید." :code="resizableDemoCode">

  <ResizableDemo />
</DemoBlock>

## استفاده

```vue
<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@saaze/ui'
</script>

<template>
  <ResizablePanelGroup direction="horizontal" class="min-h-40 rounded-lg border">
    <ResizablePanel :default-size="50" :min-size="25">
      <div class="flex h-full items-center justify-center p-4">پنل اول</div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="50" :min-size="25">
      <div class="flex h-full items-center justify-center p-4">پنل دوم</div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
```

## اجزا و ویژگی‌ها

- `ResizablePanelGroup` گروه را می‌سازد. `direction` برابر `horizontal` یا `vertical` است؛
  مقدار پیش‌فرض `horizontal` است. `autoSaveId` چیدمان را در ذخیره‌سازی محلی حفظ می‌کند.
- `ResizablePanel` ویژگی‌های Radix Vue مانند `defaultSize`، `minSize`، `maxSize` و
  `collapsible` را می‌پذیرد.
- `ResizableHandle` دستگیره قابل جابه‌جایی است. `withHandle` نشانگر ظاهری را اضافه می‌کند و
  `orientation` ظاهر عمودی یا افقی خط جداکننده را تعیین می‌کند.

هنگام استفاده از `direction="vertical"`، ارتفاع گروه را مشخص کنید تا پنل‌ها فضای قابل تقسیم
داشته باشند. خود گروه رویداد `layout` را هنگام تغییر اندازه منتشر می‌کند.
