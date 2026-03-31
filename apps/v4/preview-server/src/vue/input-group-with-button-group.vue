<script setup lang="ts">
import { Link2Icon } from 'lucide-vue-next'
import { ButtonGroup, ButtonGroupText } from '@/ui/button-group'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/ui/input-group'
import { Label } from '@/ui/label'
</script>

<template>
  <div class="grid w-full max-w-sm">
    <ButtonGroup class="!gap-0">
      <ButtonGroupText as-child>
        <Label for="url">https://</Label>
      </ButtonGroupText>
      <InputGroup>
        <InputGroupInput id="url" />
        <InputGroupAddon align="inline-end">
          <Link2Icon />
        </InputGroupAddon>
      </InputGroup>
      <ButtonGroupText>.com</ButtonGroupText>
    </ButtonGroup>
  </div>
</template>
