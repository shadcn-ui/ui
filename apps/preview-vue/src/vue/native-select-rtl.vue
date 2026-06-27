<script setup lang="ts">
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select'
</script>

<template>
  <NativeSelect dir="rtl">
    <NativeSelectOption value="">اختر الحالة</NativeSelectOption>
    <NativeSelectOption value="todo">مهام</NativeSelectOption>
    <NativeSelectOption value="in-progress">قيد التنفيذ</NativeSelectOption>
    <NativeSelectOption value="done">منجز</NativeSelectOption>
    <NativeSelectOption value="cancelled">ملغي</NativeSelectOption>
  </NativeSelect>
</template>
