<script setup lang="ts">
import { Example } from "@/components"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/ui/field"
import { Textarea } from "@/ui/textarea"
</script>

<template>
  <Example title="Textarea Fields">
    <FieldGroup>
      <Field>
        <FieldLabel html-for="textarea-basic">
          Basic Textarea
        </FieldLabel>
        <Textarea id="textarea-basic" placeholder="Enter your message" />
      </Field>
      <Field>
        <FieldLabel html-for="textarea-comments">
          Comments
        </FieldLabel>
        <Textarea
          id="textarea-comments"
          placeholder="Share your thoughts..."
          class="min-h-[100px]"
        />
        <FieldDescription>Maximum 500 characters allowed.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="textarea-bio">
          Bio
        </FieldLabel>
        <FieldDescription>
          Tell us about yourself in a few sentences.
        </FieldDescription>
        <Textarea
          id="textarea-bio"
          placeholder="I am a..."
          class="min-h-[120px]"
        />
      </Field>
      <Field>
        <FieldLabel html-for="textarea-desc-after">
          Message
        </FieldLabel>
        <Textarea id="textarea-desc-after" placeholder="Enter your message" />
        <FieldDescription>
          Enter your message so it is long enough to test the layout.
        </FieldDescription>
      </Field>
      <Field data-invalid>
        <FieldLabel html-for="textarea-invalid">
          Invalid Textarea
        </FieldLabel>
        <Textarea
          id="textarea-invalid"
          placeholder="This field has an error"
          :aria-invalid="true"
        />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel html-for="textarea-disabled-field">
          Disabled Field
        </FieldLabel>
        <Textarea
          id="textarea-disabled-field"
          placeholder="Cannot edit"
          disabled
        />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
</template>
