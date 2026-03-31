<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
</script>

<template>
  <Tabs default-value="preview">
    <TabsList>
      <TabsTrigger value="preview">
        <IconPlaceholder
          lucide="AppWindowIcon"
          tabler="IconAppWindow"
          hugeicons="CursorInWindowIcon"
          phosphor="AppWindowIcon"
          remixicon="RiWindow2Line"
        />
        Preview
      </TabsTrigger>
      <TabsTrigger value="code">
        <IconPlaceholder
          lucide="CodeIcon"
          tabler="IconCode"
          hugeicons="CodeIcon"
          phosphor="CodeIcon"
          remixicon="RiCodeLine"
        />
        Code
      </TabsTrigger>
    </TabsList>
  </Tabs>
</template>
