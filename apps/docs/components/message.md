# پیام

چیدمان پیام گفتگو شامل آواتار، سربرگ، سطح پیام و اطلاعات پایانی.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="message" />

## استفاده

```vue
<Message align="end">
  <MessageAvatar><Avatar><AvatarFallback>ش</AvatarFallback></Avatar></MessageAvatar>
  <MessageContent>
    <MessageHeader>شما · اکنون</MessageHeader>
    <Bubble><BubbleContent>سلام!</BubbleContent></Bubble>
    <MessageFooter>ارسال‌شده</MessageFooter>
  </MessageContent>
</Message>
```
