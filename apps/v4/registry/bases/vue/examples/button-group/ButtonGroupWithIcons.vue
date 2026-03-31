<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="With Icons">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">
          <IconPlaceholder
            lucide="FlipHorizontalIcon"
            tabler="IconFlipHorizontal"
            hugeicons="FlipHorizontalIcon"
            phosphor="FlipHorizontalIcon"
            remixicon="RiFlipHorizontalLine"
          />
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="FlipVerticalIcon"
            tabler="IconFlipVertical"
            hugeicons="FlipVerticalIcon"
            phosphor="FlipVerticalIcon"
            remixicon="RiFlipVerticalLine"
          />
        </Button>
        <Button variant="outline">
          <IconPlaceholder
            lucide="RotateCwIcon"
            tabler="IconRotateClockwise2"
            hugeicons="Rotate01Icon"
            phosphor="ArrowClockwiseIcon"
            remixicon="RiRefreshLine"
          />
        </Button>
      </ButtonGroup>
    </div>
  </Example>
</template>
