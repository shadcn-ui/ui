<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { X } from 'lucide-vue-next'
import { useFieldArray, useForm, Field as VeeField } from 'vee-validate'
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

const formSchema = toTypedSchema(
  z.object({
    emails: z
      .array(
        z.object({
          address: z.string().email('Enter a valid email address.'),
        }),
      )
      .min(1, 'Add at least one email address.')
      .max(5, 'You can add up to 5 email addresses.'),
  }),
)

const { handleSubmit, resetForm, errors } = useForm({
  validationSchema: formSchema,
  initialValues: {
    emails: [{ address: '' }, { address: '' }],
  },
})

const { remove, push, fields } = useFieldArray('emails')

function addEmail() {
  push({ address: '' })
}

const onSubmit = handleSubmit((data) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'bg-code text-code-foreground mt-2 w-[320px] overflow-x-auto rounded-md p-4' }, h('code', JSON.stringify(data, null, 2))),
    position: 'bottom-right',
    class: 'flex flex-col gap-2',
    style: {
      '--border-radius': 'calc(var(--radius)  + 4px)',
    },
  })
})
</script>

<template>
  <Card class="w-full sm:max-w-md">
    <CardHeader class="border-b">
      <CardTitle>Contact Emails</CardTitle>
      <CardDescription>Manage your contact email addresses.</CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-array" @submit="onSubmit">
        <FieldSet class="gap-4">
          <FieldLegend variant="label">
            Email Addresses
          </FieldLegend>
          <FieldDescription>
            Add up to 5 email addresses where we can contact you.
          </FieldDescription>
          <FieldGroup class="gap-4">
            <VeeField
              v-for="(field, index) in fields"
              :key="field.key"
              v-slot="{ field: fieldProps, errors: fieldErrors }"
              :name="`emails[${index}].address`"
            >
              <Field
                orientation="horizontal"
                :data-invalid="!!fieldErrors.length"
              >
                <FieldContent>
                  <InputGroup>
                    <InputGroupInput
                      :id="`form-vee-array-email-${index}`"
                      v-bind="fieldProps"
                      :aria-invalid="!!fieldErrors.length"
                      placeholder="name@example.com"
                      type="email"
                      autocomplete="email"
                    />
                    <InputGroupAddon
                      v-if="fields.length > 1"
                      align="inline-end"
                    >
                      <InputGroupButton
                        type="button"
                        variant="ghost"
                        size="icon-xs"
                        :aria-label="`Remove email ${index + 1}`"
                        @click="remove(index)"
                      >
                        <X />
                      </InputGroupButton>
                    </InputGroupAddon>
                  </InputGroup>
                  <FieldError v-if="fieldErrors.length" :errors="fieldErrors" />
                </FieldContent>
              </Field>
            </VeeField>
            <Button
              type="button"
              variant="outline"
              size="sm"
              :disabled="fields.length >= 5"
              @click="addEmail"
            >
              Add Email Address
            </Button>
          </FieldGroup>
          <FieldError v-if="errors.emails" :errors="[errors.emails]" />
        </FieldSet>
      </form>
    </CardContent>
    <CardFooter class="border-t">
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
        <Button type="submit" form="form-vee-array">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
