<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
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
  FieldLabel,
} from '@/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'

const spokenLanguages = [
  { label: 'English', value: 'en' },
  { label: 'Spanish', value: 'es' },
  { label: 'French', value: 'fr' },
  { label: 'German', value: 'de' },
  { label: 'Italian', value: 'it' },
  { label: 'Chinese', value: 'zh' },
  { label: 'Japanese', value: 'ja' },
] as const

const formSchema = toTypedSchema(
  z.object({
    language: z
      .string()
      .min(1, 'Please select your spoken language.')
      .refine(val => val !== 'auto', {
        message:
          'Auto-detection is not allowed. Please select a specific language.',
      }),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    language: '',
  },
})

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
  <Card class="w-full sm:max-w-lg">
    <CardHeader>
      <CardTitle>Language Preferences</CardTitle>
      <CardDescription>
        Select your preferred spoken language.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-select" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="language">
            <Field
              orientation="responsive"
              :data-invalid="!!errors.length"
            >
              <FieldContent>
                <FieldLabel for="form-vee-select-language">
                  Spoken Language
                </FieldLabel>
                <FieldDescription>
                  For best results, select the language you speak.
                </FieldDescription>
                <FieldError v-if="errors.length" :errors="errors" />
              </FieldContent>
              <Select
                :name="field.name"
                :model-value="field.value"
                @update:model-value="field.onChange"
              >
                <SelectTrigger
                  id="form-vee-select-language"
                  :aria-invalid="!!errors.length"
                  class="min-w-[120px]"
                >
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent position="item-aligned">
                  <SelectItem value="auto">
                    Auto
                  </SelectItem>
                  <SelectSeparator />
                  <SelectItem
                    v-for="language in spokenLanguages"
                    :key="language.value"
                    :value="language.value"
                  >
                    {{ language.label }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
        <Button type="submit" form="form-vee-select">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
