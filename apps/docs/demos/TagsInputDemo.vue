<script setup lang="ts">
import { ref } from 'vue'
import {
  Label,
  TagsInput,
  TagsInputInput,
  TagsInputItem,
  TagsInputItemDelete,
  TagsInputItemText,
} from '@saaze/ui'

const tags = ref(['طراحی', 'ویو', 'راست‌به‌چپ'])
</script>

<template>
  <div class="grid w-full max-w-md gap-2">
    <Label for="tags">برچسب‌های مقاله</Label>
    <TagsInput v-model="tags" add-on-paste :delimiter="'،'">
      <TagsInputItem v-for="tag in tags" :key="tag" :value="tag">
        <TagsInputItemText />
        <TagsInputItemDelete />
      </TagsInputItem>
      <TagsInputInput id="tags" />
    </TagsInput>
    <p class="text-xs text-muted-foreground">
      برای افزودن، Enter یا ویرگول فارسی (،) بزنید. Backspace آخرین برچسب را انتخاب و حذف می‌کند.
    </p>
  </div>
</template>
