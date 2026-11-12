# منوی ناوبری

منوی ناوبری ترکیبی با محتوای بازشونده و پشتیبانی از جهت راست‌به‌چپ.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="منوی ناوبری و لایه‌های رویی" description="منوی محصولات را باز کنید؛ رنگ متن در حالت hover و focus با پس‌زمینه هماهنگ می‌شود." />

## استفاده

```vue
<NavigationMenu>
  <NavigationMenuList>
    <NavigationMenuItem>
      <NavigationMenuTrigger>محصولات</NavigationMenuTrigger>
      <NavigationMenuContent>
        <NavigationMenuLink href="/analytics">تحلیل داده</NavigationMenuLink>
      </NavigationMenuContent>
    </NavigationMenuItem>
  </NavigationMenuList>
</NavigationMenu>
```
