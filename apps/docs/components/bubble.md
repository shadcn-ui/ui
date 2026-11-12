# حباب گفتگو

سطح محتوای پیام برای متن گفتگو، پاسخ ساخت‌یافته و واکنش‌ها.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="bubble" />

## استفاده

```vue
<Bubble variant="secondary" align="start">
  <BubbleContent>گزارش آماده است.</BubbleContent>
  <BubbleReactions>👍 ۲</BubbleReactions>
</Bubble>
```

گونه‌های `default`، `secondary`، `muted`، `tinted`، `outline`، `ghost` و `destructive` پشتیبانی می‌شوند.
