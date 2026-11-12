# پیمایشگر پیام

ظرف پیمایش گفتگو با حفظ کنترل پیمایش در اختیار خواننده و اعلان دسترس‌پذیر پیام‌های تازه.

<script setup>
import ExtendedComponentsPreview from '../demos/ExtendedComponentsPreview.vue'
</script>

## پیش‌نمایش

<ExtendedComponentsPreview component="message-scroller" />

## استفاده

```vue
<MessageScrollerProvider :auto-scroll="true">
  <MessageScroller class="h-80">
    <MessageScrollerViewport>
      <MessageScrollerContent>
        <MessageScrollerItem message-id="answer">
          <Message align="start">
            <MessageContent>
              <Bubble variant="secondary"><BubbleContent>پاسخ آماده است.</BubbleContent></Bubble>
            </MessageContent>
          </Message>
        </MessageScrollerItem>
      </MessageScrollerContent>
    </MessageScrollerViewport>
    <MessageScrollerButton class="absolute bottom-3 end-3" />
  </MessageScroller>
</MessageScrollerProvider>
```

پیمایش خودکار به‌صورت پیش‌فرض خاموش است؛ آن را فقط برای گفتگوهایی فعال کنید که باید هنگام دریافت پیام به انتها دنبال شوند. برای بارگذاری پیام‌های قدیمی، آن‌ها را در ابتدای `MessageScrollerContent` اضافه کنید تا موقعیت فعلی خواننده حفظ شود.
