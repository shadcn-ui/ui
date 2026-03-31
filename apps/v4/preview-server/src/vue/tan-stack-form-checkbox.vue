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
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/ui/field'

const tasks = [
  {
    id: 'push',
    label: 'Push notifications',
  },
  {
    id: 'email',
    label: 'Email notifications',
  },
] as const

const formSchema = z.object({
  responses: z.boolean(),
  tasks: z
    .array(z.string())
    .min(1, 'Please select at least one notification type.')
    .refine(
      value => value.every(task => tasks.some(t => t.id === task)),
      {
        message: 'Invalid notification type selected.',
      },
    ),
})

const form = useForm({
  defaultValues: {
    responses: true,
    tasks: [] as string[],
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
      <CardTitle>Notifications</CardTitle>
      <CardDescription>Manage your notification preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-tanstack-checkbox" @submit.prevent="form.handleSubmit">
        <FieldGroup>
          <form.Field v-slot="{ field }" name="responses">
            <FieldSet>
              <FieldLegend variant="label">
                Responses
              </FieldLegend>
              <FieldDescription>
                Get notified for requests that take time, like research or
                image generation.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal" :data-invalid="isInvalid(field)">
                  <Checkbox
                    id="form-tanstack-checkbox-responses"
                    :name="field.name"
                    :model-value="field.state.value"
                    disabled
                    @update:model-value="(checked) => field.handleChange(checked === true)"
                  />
                  <FieldLabel
                    for="form-tanstack-checkbox-responses"
                    class="font-normal"
                  >
                    Push notifications
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </FieldSet>
          </form.Field>
          <FieldSeparator />
          <form.Field v-slot="{ field }" name="tasks" mode="array">
            <FieldSet>
              <FieldLegend variant="label">
                Tasks
              </FieldLegend>
              <FieldDescription>
                Get notified when tasks you've created have updates.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field
                  v-for="task in tasks"
                  :key="task.id"
                  orientation="horizontal"
                  :data-invalid="isInvalid(field)"
                >
                  <Checkbox
                    :id="`form-tanstack-checkbox-${task.id}`"
                    :name="field.name"
                    :aria-invalid="isInvalid(field)"
                    :model-value="field.state.value.includes(task.id)"
                    @update:model-value="(checked) => {
                      if (checked) {
                        field.pushValue(task.id)
                      }
                      else {
                        const index = field.state.value.indexOf(task.id)
                        if (index > -1) {
                          field.removeValue(index)
                        }
                      }
                    }"
                  />
                  <FieldLabel
                    :for="`form-tanstack-checkbox-${task.id}`"
                    class="font-normal"
                  >
                    {{ task.label }}
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </FieldSet>
          </form.Field>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="form.reset()">
          Reset
        </Button>
        <Button type="submit" form="form-tanstack-checkbox">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
