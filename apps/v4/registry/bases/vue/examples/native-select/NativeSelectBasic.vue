<script setup lang="ts">
import {
  NativeSelect,
  NativeSelectOption,
} from "@/ui/native-select"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Basic Native Select">
    <div class="grid w-full max-w-sm items-center gap-4">
      <NativeSelect>
        <NativeSelectOption value="">
          Choose an option
        </NativeSelectOption>
        <NativeSelectOption value="option1">
          Option 1
        </NativeSelectOption>
        <NativeSelectOption value="option2">
          Option 2
        </NativeSelectOption>
        <NativeSelectOption value="option3">
          Option 3
        </NativeSelectOption>
      </NativeSelect>

      <NativeSelect>
        <NativeSelectOption value="">
          Select a country
        </NativeSelectOption>
        <NativeSelectOption value="us">
          United States
        </NativeSelectOption>
        <NativeSelectOption value="uk">
          United Kingdom
        </NativeSelectOption>
        <NativeSelectOption value="ca">
          Canada
        </NativeSelectOption>
        <NativeSelectOption value="au">
          Australia
        </NativeSelectOption>
      </NativeSelect>
    </div>
  </Example>
</template>
