<script setup lang="ts">
import { Input } from "@/ui/input"
import { NativeSelect, NativeSelectOption } from "@/ui/native-select"
</script>

<template>
  <div class="flex w-full gap-2">
    <Input type="tel" placeholder="(555) 123-4567" class="flex-1" />
    <NativeSelect default-value="+1">
      <NativeSelectOption value="+1">
        +1
      </NativeSelectOption>
      <NativeSelectOption value="+44">
        +44
      </NativeSelectOption>
      <NativeSelectOption value="+46">
        +46
      </NativeSelectOption>
    </NativeSelect>
  </div>
</template>
