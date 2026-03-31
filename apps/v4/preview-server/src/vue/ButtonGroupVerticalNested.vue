<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Example } from "@/components"
</script>

<template>
  <Example title="Vertical Nested">
    <ButtonGroup orientation="vertical" aria-label="Design tools palette">
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="CopyIcon"
            tabler="IconCopy"
            hugeicons="Copy01Icon"
            phosphor="CopyIcon"
            remixicon="RiFileCopyLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="ShareIcon"
            tabler="IconShare"
            hugeicons="Share03Icon"
            phosphor="ShareIcon"
            remixicon="RiShareLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup orientation="vertical">
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="FlipHorizontalIcon"
            tabler="IconFlipHorizontal"
            hugeicons="FlipHorizontalIcon"
            phosphor="FlipHorizontalIcon"
            remixicon="RiFlipHorizontalLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="FlipVerticalIcon"
            tabler="IconFlipVertical"
            hugeicons="FlipVerticalIcon"
            phosphor="FlipVerticalIcon"
            remixicon="RiFlipVerticalLine"
          />
        </Button>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="RotateCwIcon"
            tabler="IconRotateClockwise2"
            hugeicons="Rotate01Icon"
            phosphor="ArrowClockwiseIcon"
            remixicon="RiRefreshLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon">
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
          />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </Example>
</template>
