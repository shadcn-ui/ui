<script setup lang="ts">
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select'
</script>

<template>
  <NativeSelect aria-invalid="true">
    <NativeSelectOption value="">
      Select role
    </NativeSelectOption>
    <NativeSelectOption value="admin">
      Admin
    </NativeSelectOption>
    <NativeSelectOption value="editor">
      Editor
    </NativeSelectOption>
    <NativeSelectOption value="viewer">
      Viewer
    </NativeSelectOption>
    <NativeSelectOption value="guest">
      Guest
    </NativeSelectOption>
  </NativeSelect>
</template>
