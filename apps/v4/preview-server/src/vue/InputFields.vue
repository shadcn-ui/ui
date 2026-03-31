<script setup lang="ts">
import { Example } from "@/components"
import { Badge } from "@/ui/badge"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/ui/field"
import { Input } from "@/ui/input"
</script>

<template>
  <Example title="Input Fields">
    <FieldGroup>
      <Field>
        <FieldLabel html-for="input-basic">
          Basic Input
        </FieldLabel>
        <Input id="input-basic" placeholder="Enter text" />
      </Field>
      <Field>
        <FieldLabel html-for="input-with-desc">
          Input with Description
        </FieldLabel>
        <Input id="input-with-desc" placeholder="Enter your username" />
        <FieldDescription>
          Choose a unique username for your account.
        </FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="input-desc-first">
          Email Address
        </FieldLabel>
        <FieldDescription>
          We'll never share your email with anyone.
        </FieldDescription>
        <Input
          id="input-desc-first"
          type="email"
          placeholder="email@example.com"
        />
      </Field>
      <Field>
        <FieldLabel html-for="input-required">
          Required Field <span class="text-destructive">*</span>
        </FieldLabel>
        <Input
          id="input-required"
          placeholder="This field is required"
          required
        />
        <FieldDescription>This field must be filled out.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="input-disabled">
          Disabled Input
        </FieldLabel>
        <Input id="input-disabled" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
      <Field>
        <FieldLabel html-for="input-badge">
          Input with Badge
          <Badge variant="secondary" class="ml-auto">
            Recommended
          </Badge>
        </FieldLabel>
        <Input id="input-badge" placeholder="Enter value" />
      </Field>
      <Field data-invalid>
        <FieldLabel html-for="input-invalid">
          Invalid Input
        </FieldLabel>
        <Input
          id="input-invalid"
          placeholder="This field has an error"
          :aria-invalid="true"
        />
        <FieldDescription>
          This field contains validation errors.
        </FieldDescription>
      </Field>
      <Field data-disabled>
        <FieldLabel html-for="input-disabled-field">
          Disabled Field
        </FieldLabel>
        <Input id="input-disabled-field" placeholder="Cannot edit" disabled />
        <FieldDescription>This field is currently disabled.</FieldDescription>
      </Field>
    </FieldGroup>
  </Example>
</template>
