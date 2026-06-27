<script setup lang="ts">
import CopyIcon from "@material-symbols/svg-400/rounded/content_copy.svg?component"
import FileCodeIcon from "@material-symbols/svg-400/rounded/code.svg?component"
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/ui/field'
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText, InputGroupTextarea } from '@/ui/input-group'
</script>

<template>
  <FieldGroup class="max-w-sm">
    <Field>
      <FieldLabel for="block-start-input">Input</FieldLabel>
      <InputGroup class="h-auto">
        <InputGroupInput id="block-start-input" placeholder="Enter your name" />
        <InputGroupAddon align="block-start">
          <InputGroupText>Full Name</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Header positioned above the input.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel for="block-start-textarea">Textarea</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="block-start-textarea"
          placeholder="console.log('Hello, world!');"
          class="font-mono text-sm"
        />
        <InputGroupAddon align="block-start">
          <FileCodeIcon class="text-muted-foreground" />
          <InputGroupText class="font-mono">script.js</InputGroupText>
          <InputGroupButton size="icon-xs" class="ml-auto">
            <CopyIcon />
            <span class="sr-only">Copy</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Header positioned above the textarea.</FieldDescription>
    </Field>
  </FieldGroup>
</template>
