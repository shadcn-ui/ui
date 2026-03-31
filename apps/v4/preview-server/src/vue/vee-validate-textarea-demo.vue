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
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
import { Textarea } from '@/ui/textarea'

const formSchema = toTypedSchema(
  z.object({
    about: z
      .string()
      .min(10, 'Please provide at least 10 characters.')
      .max(200, 'Please keep it under 200 characters.'),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    about: '',
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
  <Card class="w-full sm:max-w-md">
    <CardHeader>
      <CardTitle>Personalization</CardTitle>
      <CardDescription>
        Customize your experience by telling us more about yourself.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-textarea" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="about">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-textarea-about">
                More about you
              </FieldLabel>
              <Textarea
                id="form-vee-textarea-about"
                v-bind="field"
                :aria-invalid="!!errors.length"
                placeholder="I'm a software engineer..."
                class="min-h-[120px]"
              />
              <FieldDescription>
                Tell us more about yourself. This will be used to help us
                personalize your experience.
              </FieldDescription>
              <FieldError v-if="errors.length" :errors="errors" />
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
        <Button type="submit" form="form-vee-textarea">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
