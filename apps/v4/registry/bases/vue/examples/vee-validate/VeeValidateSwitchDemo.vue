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
import { Switch } from '@/ui/switch'

const formSchema = toTypedSchema(
  z.object({
    twoFactor: z.boolean().refine(val => val === true, {
      message: 'It is highly recommended to enable two-factor authentication.',
    }),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    twoFactor: false,
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
      <CardTitle>Security Settings</CardTitle>
      <CardDescription>
        Manage your account security preferences.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-switch" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="twoFactor" type="checkbox">
            <Field
              orientation="horizontal"
              :data-invalid="!!errors.length"
            >
              <FieldContent>
                <FieldLabel for="form-vee-switch-twoFactor">
                  Multi-factor authentication
                </FieldLabel>
                <FieldDescription>
                  Enable multi-factor authentication to secure your account.
                </FieldDescription>
                <FieldError v-if="errors.length" :errors="errors" />
              </FieldContent>
              <Switch
                id="form-vee-switch-twoFactor"
                :name="field.name"
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              />
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
        <Button type="submit" form="form-vee-switch">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
