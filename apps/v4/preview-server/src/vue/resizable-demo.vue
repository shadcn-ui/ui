<script setup lang="ts">
import { ref } from "vue"
import { Example, ExampleWrapper } from "@/components"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/ui/resizable"

const sizes = ref([30, 70])
</script>

<template>
  <ExampleWrapper>
    <Example title="Horizontal">
      <ResizablePanelGroup
        direction="horizontal"
        class="min-h-[200px] rounded-lg border"
      >
        <ResizablePanel :default-size="25">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Sidebar</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="75">
          <div class="flex h-full items-center justify-center p-6">
            <span class="font-semibold">Content</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>

    <Example title="Vertical">
      <ResizablePanelGroup
        direction="vertical"
        class="min-h-[200px] rounded-lg border"
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
    </Example>

    <Example title="With Handle">
      <ResizablePanelGroup
        direction="horizontal"
        class="min-h-[200px] rounded-lg border"
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
    </Example>

    <Example title="Nested">
      <ResizablePanelGroup direction="horizontal" class="rounded-lg border">
        <ResizablePanel :default-size="50">
          <div class="flex h-[200px] items-center justify-center p-6">
            <span class="font-semibold">One</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="50">
          <ResizablePanelGroup direction="vertical">
            <ResizablePanel :default-size="25">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Two</span>
              </div>
            </ResizablePanel>
            <ResizableHandle />
            <ResizablePanel :default-size="75">
              <div class="flex h-full items-center justify-center p-6">
                <span class="font-semibold">Three</span>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>

    <Example title="Controlled">
      <ResizablePanelGroup
        direction="horizontal"
        class="min-h-[200px] rounded-lg border"
        @layout="(newSizes) => { sizes = newSizes }"
      >
        <ResizablePanel :default-size="30" :min-size="20">
          <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span class="font-semibold">{{ Math.round(sizes[0] ?? 30) }}%</span>
          </div>
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel :default-size="70" :min-size="30">
          <div class="flex h-full flex-col items-center justify-center gap-2 p-6">
            <span class="font-semibold">{{ Math.round(sizes[1] ?? 70) }}%</span>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </Example>
  </ExampleWrapper>
</template>
