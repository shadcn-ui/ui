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

<template>
  <FieldGroup @class="max-w-sm">
    <Field>
      <FieldLabel @for="block-end-input">Input</FieldLabel>
      <InputGroup @class="h-auto">
        <InputGroupInput id="block-end-input" placeholder="Enter amount" />
        <InputGroupAddon @align="block-end">
          <InputGroupText>USD</InputGroupText>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Footer positioned below the input.</FieldDescription>
    </Field>
    <Field>
      <FieldLabel @for="block-end-textarea">Textarea</FieldLabel>
      <InputGroup>
        <InputGroupTextarea id="block-end-textarea" placeholder="Write a comment..." />
        <InputGroupAddon @align="block-end">
          <InputGroupText>0/280</InputGroupText>
          <InputGroupButton @variant="default" @size="sm" @class="ml-auto">
            Post
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <FieldDescription>Footer positioned below the textarea.</FieldDescription>
    </Field>
  </FieldGroup>
</template>
