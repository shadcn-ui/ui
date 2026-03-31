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
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/ui/field'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/radio-group'

const plans = [
  {
    id: 'starter',
    title: 'Starter (100K tokens/month)',
    description: 'For everyday use with basic features.',
  },
  {
    id: 'pro',
    title: 'Pro (1M tokens/month)',
    description: 'For advanced AI usage with more features.',
  },
  {
    id: 'enterprise',
    title: 'Enterprise (Unlimited tokens)',
    description: 'For large teams and heavy usage.',
  },
] as const

const formSchema = toTypedSchema(
  z.object({
    plan: z.string().min(1, 'You must select a subscription plan to continue.'),
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    plan: '',
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
      <CardTitle>Subscription Plan</CardTitle>
      <CardDescription>
        See pricing and features for each plan.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-radiogroup" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="plan">
            <FieldSet :data-invalid="!!errors.length">
              <FieldLegend>Plan</FieldLegend>
              <FieldDescription>
                You can upgrade or downgrade your plan at any time.
              </FieldDescription>
              <RadioGroup
                :name="field.name"
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              >
                <FieldLabel
                  v-for="plan in plans"
                  :key="plan.id"
                  :for="`form-vee-radiogroup-${plan.id}`"
                >
                  <Field
                    orientation="horizontal"
                    :data-invalid="!!errors.length"
                  >
                    <FieldContent>
                      <FieldTitle>{{ plan.title }}</FieldTitle>
                      <FieldDescription>
                        {{ plan.description }}
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      :id="`form-vee-radiogroup-${plan.id}`"
                      :value="plan.id"
                      :aria-invalid="!!errors.length"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
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
        <Button type="submit" form="form-vee-radiogroup">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
