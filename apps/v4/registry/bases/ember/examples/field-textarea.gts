import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from '@/ui/field';
import { Textarea } from '@/ui/textarea';

<template>
  <div class="w-full max-w-md">
    <FieldSet>
      <FieldGroup>
        <Field>
          <FieldLabel @for="feedback">Feedback</FieldLabel>
          <Textarea
            id="feedback"
            placeholder="Your feedback helps us improve..."
            rows="4"
          />
          <FieldDescription>
            Share your thoughts about our service.
          </FieldDescription>
        </Field>
      </FieldGroup>
    </FieldSet>
  </div>
</template>
