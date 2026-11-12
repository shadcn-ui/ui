# کارت

سطحی مستقل برای دسته‌بندی عنوان، توضیح، محتوا و اقدام‌ها.

<script setup>
import ComponentCatalogPreview from '../demos/ComponentCatalogPreview.vue'
</script>

## پیش‌نمایش

<ComponentCatalogPreview category="display" title="کارت و محتوای آن" description="کارت نمونه شامل عنوان، توضیح، محتوا و دکمه پایانی است." />

## استفاده

```vue
<Card>
  <CardHeader>
    <CardTitle>گزارش فروش</CardTitle>
    <CardDescription>خلاصه عملکرد این ماه</CardDescription>
  </CardHeader>
  <CardContent>درآمد این ماه: ۱۲٫۴ میلیون تومان</CardContent>
  <CardFooter><Button>مشاهده گزارش</Button></CardFooter>
</Card>
```

## اقدام سربرگ

`CardAction` را داخل `CardHeader` بگذارید تا در لبه پایانی، کنار عنوان و توضیح قرار بگیرد:

```vue
<CardHeader>
  <CardTitle>گزارش ماهانه</CardTitle>
  <CardDescription>آبان ۱۴۰۵</CardDescription>
  <CardAction><Button variant="link">مشاهده</Button></CardAction>
</CardHeader>
```
