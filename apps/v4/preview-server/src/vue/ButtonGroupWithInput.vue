<script setup lang="ts">
import { Button } from "@/ui/button"
import { ButtonGroup } from "@/ui/button-group"
import { Input } from "@/ui/input"
import { Example } from "@/components"
</script>

<template>
  <Example title="With Input">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <Button variant="outline">
          Button
        </Button>
        <Input placeholder="Type something here..." />
      </ButtonGroup>
      <ButtonGroup>
        <Input placeholder="Type something here..." />
        <Button variant="outline">
          Button
        </Button>
      </ButtonGroup>
    </div>
  </Example>
</template>
