import { Checkbox } from '@/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
  FieldSet,
} from '@/ui/field';

<template>
  <div class="w-full max-w-md">
    <FieldGroup>
      <FieldSet>
        <FieldLabel>Responses</FieldLabel>
        <FieldDescription>
          Get notified when ChatGPT responds to requests that take time, like
          research or image generation.
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field @orientation="horizontal">
            <Checkbox @checked={{true}} @disabled={{true}} id="push" />
            <FieldLabel @class="font-normal" @for="push">
              Push notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
      <FieldSeparator />
      <FieldSet>
        <FieldLabel>Tasks</FieldLabel>
        <FieldDescription>
          Get notified when tasks you've created have updates.
          <a href="#">Manage tasks</a>
        </FieldDescription>
        <FieldGroup data-slot="checkbox-group">
          <Field @orientation="horizontal">
            <Checkbox id="push-tasks" />
            <FieldLabel @class="font-normal" @for="push-tasks">
              Push notifications
            </FieldLabel>
          </Field>
          <Field @orientation="horizontal">
            <Checkbox id="email-tasks" />
            <FieldLabel @class="font-normal" @for="email-tasks">
              Email notifications
            </FieldLabel>
          </Field>
        </FieldGroup>
      </FieldSet>
    </FieldGroup>
  </div>
</template>
