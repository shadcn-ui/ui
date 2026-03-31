<script setup lang="ts">
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select'
</script>

<template>
  <NativeSelect disabled>
    <NativeSelectOption value="">
      Select priority
    </NativeSelectOption>
    <NativeSelectOption value="low">
      Low
    </NativeSelectOption>
    <NativeSelectOption value="medium">
      Medium
    </NativeSelectOption>
    <NativeSelectOption value="high">
      High
    </NativeSelectOption>
    <NativeSelectOption value="critical">
      Critical
    </NativeSelectOption>
  </NativeSelect>
</template>
