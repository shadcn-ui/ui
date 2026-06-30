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
    class="max-w-sm rounded-lg border"
    dir="rtl"
  >
    <ResizablePanel :default-size="50">
      <div class="flex h-[200px] items-center justify-center p-6">
        <span class="font-semibold">واحد</span>
      </div>
    </ResizablePanel>
    <ResizableHandle :with-handle="true" />
    <ResizablePanel :default-size="50">
      <ResizablePanelGroup direction="vertical" dir="rtl">
        <ResizablePanel :default-size="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">اثنان</span>
          </div>
        </ResizablePanel>
        <ResizableHandle :with-handle="true" />
        <ResizablePanel :default-size="75">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">ثلاثة</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ResizablePanel>
  </ResizablePanelGroup>
</template>
