<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
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

const formSchema = z.object({
  language: z
    .string()
    .min(1, 'Please select your spoken language.')
    .refine(val => val !== 'auto', {
      message:
        'Auto-detection is not allowed. Please select a specific language.',
    }),
})

const form = useForm({
  defaultValues: {
    language: '',
  },
  validators: {
    onSubmit: formSchema,
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
      <form id="form-tanstack-select" @submit.prevent="form.handleSubmit">
        <FieldGroup>
          <form.Field v-slot="{ field }" name="language">
            <Field orientation="responsive" :data-invalid="isInvalid(field)">
              <FieldContent>
                <FieldLabel for="form-tanstack-select-language">
                  Spoken Language
                </FieldLabel>
                <FieldDescription>
                  For best results, select the language you speak.
                </FieldDescription>
                <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
              </FieldContent>
              <Select
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              >
                <SelectTrigger
                  id="form-tanstack-select-language"
                  :aria-invalid="isInvalid(field)"
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
          </form.Field>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="form.reset()">
          Reset
        </Button>
        <Button type="submit" form="form-tanstack-select">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
