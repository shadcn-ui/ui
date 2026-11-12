<script setup lang="ts">
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@saaze/ui'
</script>

<template>
  <ResizablePanelGroup
    direction="horizontal"
    class="min-h-40 w-full max-w-xl rounded-lg border"
  >
    <ResizablePanel :default-size="50" :min-size="25">
      <div class="flex h-full items-center justify-center p-4 text-sm">پنل اول</div>
    </ResizablePanel>
    <ResizableHandle with-handle />
    <ResizablePanel :default-size="50" :min-size="25">
      <div class="flex h-full items-center justify-center p-4 text-sm">پنل دوم</div>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
