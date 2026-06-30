import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/ember-ui/input-group';

import Copy from '~icons/ms/content_copy';
import FileCode from '~icons/ms/code';

<template>
  <FieldGroup @class="max-w-sm">
    <Field>
      <FieldLabel @for="block-start-input">Input</FieldLabel>
      <InputGroup @class="h-auto">
        <InputGroupInput id="block-start-input" placeholder="Enter your name" />
        <InputGroupAddon @align="block-start">
          <InputGroupText>Full Name</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Header positioned above the input.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel @for="block-start-textarea">Textarea</FieldLabel>
      <InputGroup>
        <InputGroupTextarea
          id="block-start-textarea"
          @class="font-mono text-sm"
          placeholder="console.log('Hello, world!');"
        />
        <InputGroupAddon @align="block-start">
          <FileCode class="text-muted-foreground" />
          <InputGroupText @class="font-mono">script.js</InputGroupText>
          <InputGroupButton @class="ml-auto" @size="icon-xs">
            <Copy />
            <span class="sr-only">Copy</span>
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Header positioned above the textarea.</FieldDescription>
    </Field>
  </FieldGroup>
</template>
