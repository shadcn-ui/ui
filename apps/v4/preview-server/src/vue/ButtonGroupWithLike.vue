<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Example } from "@/components"
</script>

<template>
  <Example title="With Like">
    <ButtonGroup>
      <Button variant="outline">
        <IconPlaceholder
          lucide="HeartIcon"
          tabler="IconHeart"
          hugeicons="HeartIcon"
          phosphor="HeartIcon"
          remixicon="RiHeartLine"
          data-icon="inline-start"
        />
        Like
      </Button>
      <Button variant="outline" :as-child="true" size="icon" class="w-12">
        <span>1.2K</span>
      </Button>
    </ButtonGroup>
  </Example>
</template>
