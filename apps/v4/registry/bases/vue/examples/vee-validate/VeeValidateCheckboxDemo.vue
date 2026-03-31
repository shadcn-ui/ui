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

const formSchema = toTypedSchema(
  z.object({
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
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    responses: true,
    tasks: [],
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
      <CardTitle>Notifications</CardTitle>
      <CardDescription>Manage your notification preferences.</CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-checkbox" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="responses" type="checkbox">
            <FieldSet :data-invalid="!!errors.length">
              <FieldLegend variant="label">
                Responses
              </FieldLegend>
              <FieldDescription>
                Get notified for requests that take time, like research or image
                generation.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field orientation="horizontal">
                  <Checkbox
                    id="form-vee-checkbox-responses"
                    :name="field.name"
                    :model-value="field.value"
                    disabled
                    @update:model-value="field.onChange"
                  />
                  <FieldLabel
                    for="form-vee-checkbox-responses"
                    class="font-normal"
                  >
                    Push notifications
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </FieldSet>
          </VeeField>
          <FieldSeparator />
          <VeeField v-slot="{ field, errors }" name="tasks">
            <FieldSet :data-invalid="!!errors.length">
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
                  :data-invalid="!!errors.length"
                >
                  <Checkbox
                    :id="`form-vee-checkbox-${task.id}`"
                    :name="field.name"
                    :aria-invalid="!!errors.length"
                    :model-value="field.value?.includes(task.id)"
                    @update:model-value="
                      (checked: boolean | 'indeterminate') => {
                        const newValue = checked
                          ? [...(field.value || []), task.id]
                          : (field.value || []).filter(
                            (value: string) => value !== task.id,
                          );
                        field.onChange(newValue);
                      }
                    "
                  />
                  <FieldLabel
                    :for="`form-vee-checkbox-${task.id}`"
                    class="font-normal"
                  >
                    {{ task.label }}
                  </FieldLabel>
                </Field>
              </FieldGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </FieldSet>
          </VeeField>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal">
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
        <Button type="submit" form="form-vee-checkbox">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
