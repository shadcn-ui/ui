<script setup lang="ts">
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Basic">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">
          Button
        </Button>
        <Button variant="outline">
          Another Button
        </Button>
      </ButtonGroup>
    </div>
  </Example>
</template>
