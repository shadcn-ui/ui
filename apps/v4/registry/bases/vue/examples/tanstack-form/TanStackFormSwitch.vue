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
import { Switch } from '@/ui/switch'

const formSchema = z.object({
  twoFactor: z.boolean().refine(val => val === true, {
    message: 'It is highly recommended to enable two-factor authentication.',
  }),
})

const form = useForm({
  defaultValues: {
    twoFactor: false,
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
  <Card class="w-full sm:max-w-md">
    <CardHeader>
      <CardTitle>Security Settings</CardTitle>
      <CardDescription>
        Manage your account security preferences.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-tanstack-switch" @submit.prevent="form.handleSubmit">
        <FieldGroup>
          <form.Field v-slot="{ field }" name="twoFactor">
            <Field orientation="horizontal" :data-invalid="isInvalid(field)">
              <FieldContent>
                <FieldLabel :for="field.name">
                  Multi-factor authentication
                </FieldLabel>
                <FieldDescription>
                  Enable multi-factor authentication to secure your account.
                </FieldDescription>
                <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
              </FieldContent>
              <Switch
                :id="field.name"
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                @update:model-value="field.handleChange"
              />
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
        <Button type="submit" form="form-tanstack-switch">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
