<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Example } from "@/components/example"
import { Button } from "@/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/ui/empty"
</script>

<template>
  <Example title="Basic">
    <Empty>
      <EmptyHeader>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven't created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div class="flex gap-2">
          <Button :as-child="true">
            <a href="#">Create project</a>
          </Button>
          <Button variant="outline">
            Import project
          </Button>
        </div>
        <Button variant="link" :as-child="true" class="text-muted-foreground">
          <a href="#">
            Learn more
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
              phosphor="ArrowUpRightIcon"
              remixicon="RiArrowRightUpLine"
            />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  </Example>
</template>
