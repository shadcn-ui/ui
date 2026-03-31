<script setup lang="ts">
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@/ui/native-select"
import { Example } from "@/components"
</script>

<template>
  <Example title="Native Select with OptGroup">
    <div class="grid w-full max-w-sm items-center gap-4">
      <NativeSelect>
        <NativeSelectOption value="">
          Select a fruit
        </NativeSelectOption>
        <NativeSelectOptGroup label="Citrus">
          <NativeSelectOption value="orange">
            Orange
          </NativeSelectOption>
          <NativeSelectOption value="lemon">
            Lemon
          </NativeSelectOption>
          <NativeSelectOption value="lime">
            Lime
          </NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Berries">
          <NativeSelectOption value="strawberry">
            Strawberry
          </NativeSelectOption>
          <NativeSelectOption value="blueberry">
            Blueberry
          </NativeSelectOption>
          <NativeSelectOption value="raspberry">
            Raspberry
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>

      <NativeSelect>
        <NativeSelectOption value="">
          Select a programming language
        </NativeSelectOption>
        <NativeSelectOptGroup label="Frontend">
          <NativeSelectOption value="javascript">
            JavaScript
          </NativeSelectOption>
          <NativeSelectOption value="typescript">
            TypeScript
          </NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Backend">
          <NativeSelectOption value="python">
            Python
          </NativeSelectOption>
          <NativeSelectOption value="java">
            Java
          </NativeSelectOption>
          <NativeSelectOption value="go">
            Go
          </NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
    </div>
  </Example>
</template>
