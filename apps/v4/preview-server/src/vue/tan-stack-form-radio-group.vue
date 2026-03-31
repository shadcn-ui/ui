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
    description: 'For individuals and small teams',
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

const formSchema = z.object({
  plan: z.string().min(1, 'You must select a subscription plan to continue.'),
})

const form = useForm({
  defaultValues: {
    plan: '',
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
      <CardTitle>Subscription Plan</CardTitle>
      <CardDescription>
        See pricing and features for each plan.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-tanstack-radiogroup" @submit.prevent="form.handleSubmit">
        <FieldGroup>
          <form.Field v-slot="{ field }" name="plan">
            <FieldSet>
              <FieldLegend>Plan</FieldLegend>
              <FieldDescription>
                You can upgrade or downgrade your plan at any time.
              </FieldDescription>
              <RadioGroup
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              >
                <FieldLabel
                  v-for="plan in plans"
                  :key="plan.id"
                  :for="`form-tanstack-radiogroup-${plan.id}`"
                >
                  <Field
                    orientation="horizontal"
                    :data-invalid="isInvalid(field)"
                  >
                    <FieldContent>
                      <FieldTitle>{{ plan.title }}</FieldTitle>
                      <FieldDescription>{{ plan.description }}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      :id="`form-tanstack-radiogroup-${plan.id}`"
                      :value="plan.id"
                      :aria-invalid="isInvalid(field)"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
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
        <Button type="submit" form="form-tanstack-radiogroup">
          Save
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
