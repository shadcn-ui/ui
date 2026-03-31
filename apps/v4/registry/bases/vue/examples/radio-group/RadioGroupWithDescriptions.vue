<script setup lang="ts">
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldLabel,
} from "@/ui/field"
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group"
</script>

<template>
  <RadioGroup default-value="plus">
    <FieldLabel html-for="plus-plan">
      <Field orientation="horizontal">
        <FieldContent>
          <div class="font-medium">
            Plus
          </div>
          <FieldDescription>
            For individuals and small teams
          </FieldDescription>
        </FieldContent>
        <RadioGroupItem id="plus-plan" value="plus" />
      </Field>
    </FieldLabel>
    <FieldLabel html-for="pro-plan">
      <Field orientation="horizontal">
        <FieldContent>
          <div class="font-medium">
            Pro
          </div>
          <FieldDescription>For growing businesses</FieldDescription>
        </FieldContent>
        <RadioGroupItem id="pro-plan" value="pro" />
      </Field>
    </FieldLabel>
    <FieldLabel html-for="enterprise-plan">
      <Field orientation="horizontal">
        <FieldContent>
          <div class="font-medium">
            Enterprise
          </div>
          <FieldDescription>
            For large teams and enterprises
          </FieldDescription>
        </FieldContent>
        <RadioGroupItem id="enterprise-plan" value="enterprise" />
      </Field>
    </FieldLabel>
  </RadioGroup>
</template>
