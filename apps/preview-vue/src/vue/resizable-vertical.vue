<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
</script>

<template>
  <ResizablePanelGroup
    direction="vertical"
    class="min-h-[200px] max-w-sm rounded-lg border"
  >
    <ResizablePanel :default-size="25">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Header</span>
      </div>
    </ResizablePanel>
    <ResizableHandle />
    <ResizablePanel :default-size="75">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Content</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
