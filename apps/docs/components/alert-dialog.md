# دیالوگ هشدار

برای تأیید تصمیم‌های مهم یا برگشت‌ناپذیر از دیالوگ تأیید استفاده کنید.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="overlays" title="لایه‌های رویی" description="دیالوگ تأیید در کنار کشو، پاپ‌اور، منو و اعلان قابل آزمایش است." />

## استفاده

```vue
<AlertDialog>
  <AlertDialogTrigger as-child><Button variant="destructive">حذف حساب</Button></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>حذف حساب؟</AlertDialogTitle>
      <AlertDialogDescription>این عملیات قابل بازگشت نیست.</AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>انصراف</AlertDialogCancel>
      <AlertDialogAction>حذف</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
```
