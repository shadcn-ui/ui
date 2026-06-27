<script setup lang="ts">
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/ui/resizable'
</script>

<template>
  <ResizablePanelGroup
    direction="horizontal"
    class="min-h-[200px] max-w-md rounded-lg border md:min-w-[450px]"
  >
    <ResizablePanel :default-size="25">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Sidebar</span>
      </div>
    </ResizablePanel>
    <ResizableHandle :with-handle="true" />
    <ResizablePanel :default-size="75">
      <div class="flex h-full items-center justify-center p-6">
        <span class="font-semibold">Content</span>
      </div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
