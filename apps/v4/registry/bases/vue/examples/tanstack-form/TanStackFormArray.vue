<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { XIcon } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ui/card'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLegend,
  FieldSet,
} from '@/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ui/input-group'

const formSchema = z.object({
  emails: z
    .array(
      z.object({
        address: z.string().email('Enter a valid email address.'),
      }),
    )
    .min(1, 'Add at least one email address.')
    .max(5, 'You can add up to 5 email addresses.'),
})

const form = useForm({
  defaultValues: {
    emails: [{ address: '' }],
  },
  validators: {
    onBlur: formSchema,
  },
  onSubmit: async ({ value }) => {
    toast('You submitted the following values:', {
      description: h('pre', { class: 'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4' }, h('code', JSON.stringify(value, null, 2))),
      position: 'bottom-right',
      class: 'flex flex-col gap-2',
      style: {
        '--border-radius': 'calc(var(--radius)  + 4px)',
      },
    })
  },
})

function isInvalid(field: any) {
  return field.state.meta.isTouched && !field.state.meta.isValid
}

function isSubFieldInvalid(subField: any) {
  return subField.state.meta.isTouched && !subField.state.meta.isValid
}
</script>

<template>
  <Card class="w-full sm:max-w-md">
    <CardHeader class="border-b">
      <CardTitle>Contact Emails</CardTitle>
      <CardDescription>Manage your contact email addresses.</CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-tanstack-array" @submit.prevent="form.handleSubmit">
        <form.Field v-slot="{ field }" name="emails" mode="array">
          <FieldSet class="gap-4">
            <FieldLegend variant="label">
              Email Addresses
            </FieldLegend>
            <FieldDescription>
              Add up to 5 email addresses where we can contact you.
            </FieldDescription>
            <FieldGroup class="gap-4">
              <form.Field
                v-for="(_, index) in field.state.value"
                :key="index"
                v-slot="{ field: subField }"
                :name="`emails[${index}].address`"
              >
                <Field
                  orientation="horizontal"
                  :data-invalid="isSubFieldInvalid(subField)"
                >
                  <FieldContent>
                    <InputGroup>
                      <InputGroupInput
                        :id="`form-tanstack-array-email-${index}`"
                        :name="subField.name"
                        :model-value="subField.state.value"
                        :aria-invalid="isSubFieldInvalid(subField)"
                        placeholder="name@example.com"
                        type="email"
                        autocomplete="email"
                        @blur="subField.handleBlur"
                        @input="subField.handleChange"
                      />
                      <InputGroupAddon v-if="field.state.value.length > 1" align="inline-end">
                        <InputGroupButton
                          type="button"
                          variant="ghost"
                          size="icon-xs"
                          :aria-label="`Remove email ${index + 1}`"
                          @click="field.removeValue(index)"
                        >
                          <XIcon />
                        </InputGroupButton>
                      </InputGroupAddon>
                    </InputGroup>
                    <FieldError v-if="isSubFieldInvalid(subField)" :errors="subField.state.meta.errors" />
                  </FieldContent>
                </Field>
              </form.Field>
              <Button
                type="button"
                variant="outline"
                size="sm"
                :disabled="field.state.value.length >= 5"
                @click="field.pushValue({ address: '' })"
              >
                Add Email Address
              </Button>
            </FieldGroup>
            <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
          </FieldSet>
        </form.Field>
      </form>
    </CardContent>
    <CardFooter class="border-t">
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="form.reset()">
          Reset
        </Button>
        <Button type="submit" form="form-tanstack-array">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
