<script setup lang="ts">
import { Example } from "@/components"
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/ui/field"
import { Switch } from "@/ui/switch"
</script>

<template>
  <Example title="Switch Fields">
    <FieldGroup>
      <Field orientation="horizontal">
        <FieldContent>
          <FieldLabel html-for="switch-airplane">
            Airplane Mode
          </FieldLabel>
          <FieldDescription>
            Turn on airplane mode to disable all connections.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-airplane" />
      </Field>
      <Field orientation="horizontal">
        <FieldLabel html-for="switch-dark">
          Dark Mode
        </FieldLabel>
        <Switch id="switch-dark" />
      </Field>
      <Field orientation="horizontal">
        <Switch id="switch-marketing" />
        <FieldContent>
          <FieldLabel html-for="switch-marketing">
            Marketing Emails
          </FieldLabel>
          <FieldDescription>
            Receive emails about new products, features, and more.
          </FieldDescription>
        </FieldContent>
      </Field>
      <Field>
        <FieldLabel>Privacy Settings</FieldLabel>
        <FieldDescription>Manage your privacy preferences.</FieldDescription>
        <Field orientation="horizontal">
          <Switch id="switch-profile" :default-checked="true" />
          <FieldContent>
            <FieldLabel html-for="switch-profile" class="font-normal">
              Make profile visible to others
            </FieldLabel>
          </FieldContent>
        </Field>
        <Field orientation="horizontal">
          <Switch id="switch-email" />
          <FieldContent>
            <FieldLabel html-for="switch-email" class="font-normal">
              Show email on profile
            </FieldLabel>
          </FieldContent>
        </Field>
      </Field>
      <Field data-invalid orientation="horizontal">
        <FieldContent>
          <FieldLabel html-for="switch-invalid">
            Invalid Switch
          </FieldLabel>
          <FieldDescription>
            This switch has validation errors.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-invalid" :aria-invalid="true" />
      </Field>
      <Field data-disabled orientation="horizontal">
        <FieldContent>
          <FieldLabel html-for="switch-disabled-field">
            Disabled Switch
          </FieldLabel>
          <FieldDescription>
            This switch is currently disabled.
          </FieldDescription>
        </FieldContent>
        <Switch id="switch-disabled-field" disabled />
      </Field>
    </FieldGroup>
  </Example>
</template>
