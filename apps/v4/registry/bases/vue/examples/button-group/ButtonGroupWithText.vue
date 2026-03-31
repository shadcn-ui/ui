<script setup lang="ts">
import { Button } from "@/ui/button"
import { ButtonGroup, ButtonGroupText } from "@/ui/button-group"
import { Input } from "@/ui/input"
import { Label } from "@/ui/label"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="With Text">
    <div class="flex flex-col gap-4">
      <ButtonGroup>
        <ButtonGroupText>Text</ButtonGroupText>
        <Button variant="outline">
          Another Button
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <ButtonGroupText :as-child="true">
          <Label html-for="input-text">
            GPU Size
          </Label>
        </ButtonGroupText>
        <Input id="input-text" placeholder="Type something here..." />
      </ButtonGroup>
    </div>
  </Example>
</template>
