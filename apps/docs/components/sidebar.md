# نوار کناری

ساختار ترکیبی نوار کناری واکنش‌گرا با گروه‌بندی، منو، ریل تغییر وضعیت و محتوای اصلی.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="sidebar" />

## استفاده

```vue
<SidebarProvider>
  <Sidebar>
    <SidebarHeader>فضای کاری</SidebarHeader>
    <SidebarContent>
      <SidebarGroup>
        <SidebarGroupLabel>برنامه</SidebarGroupLabel>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton is-active>نمای کلی</SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroup>
    </SidebarContent>
    <SidebarFooter>حساب کاربری</SidebarFooter>
    <SidebarRail />
  </Sidebar>
  <SidebarInset>
    <SidebarTrigger aria-label="باز و بسته کردن نوار کناری" />
    <main>محتوای اصلی</main>
  </SidebarInset>
</SidebarProvider>
```

`SidebarRail` و `SidebarTrigger` وضعیت نوار را تغییر می‌دهند. برای کنترل بیرونی، `v-model:open` را روی `SidebarProvider` قرار دهید. با `side`، `variant` و `collapsible` می‌توان سمت، ظاهر و رفتار جمع‌شدن را تعیین کرد؛ میانبر صفحه‌کلید پیش‌فرض `Ctrl/⌘ + B` است.

## لبه نوار کناری

`side` مقدارهای منطقی `start` (پیش‌فرض) و `end` را می‌پذیرد؛ در RTL، `start` یعنی سمت راست.
مقدارهای `left` و `right` برای سازگاری با shadcn به ترتیب معادل `start` و `end` هستند.
رنگ‌ها از توکن‌های `--sidebar-*` در تم خوانده می‌شوند. `SidebarTrigger` بدون محتوا، آیکون
پیش‌فرض نمایش می‌دهد و `SidebarInput` و `SidebarMenuSkeleton` (با `show-icon`) نیز در دسترس‌اند.
