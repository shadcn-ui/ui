<script setup lang="ts">
import { useForm } from '@tanstack/vue-form'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/ui/button'
import { Card, CardContent, CardFooter } from '@/ui/card'
import { Checkbox } from '@/ui/checkbox'
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/ui/field'
import {
  RadioGroup,
  RadioGroupItem,
} from '@/ui/radio-group'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select'
import { Switch } from '@/ui/switch'

const addons = [
  {
    id: 'analytics',
    title: 'Analytics',
    description: 'Advanced analytics and reporting',
  },
  {
    id: 'backup',
    title: 'Backup',
    description: 'Automated daily backups',
  },
  {
    id: 'support',
    title: 'Priority Support',
    description: '24/7 premium customer support',
  },
] as const

const formSchema = z.object({
  plan: z
    .string({
      required_error: 'Please select a subscription plan',
    })
    .min(1, 'Please select a subscription plan')
    .refine(value => value === 'basic' || value === 'pro', {
      message: 'Invalid plan selection. Please choose Basic or Pro',
    }),
  billingPeriod: z
    .string({
      required_error: 'Please select a billing period',
    })
    .min(1, 'Please select a billing period'),
  addons: z
    .array(z.string())
    .min(1, 'Please select at least one add-on')
    .max(3, 'You can select up to 3 add-ons')
    .refine(
      value => value.every(addon => addons.some(a => a.id === addon)),
      {
        message: 'You selected an invalid add-on',
      },
    ),
  emailNotifications: z.boolean(),
})

const form = useForm({
  defaultValues: {
    plan: 'basic',
    billingPeriod: 'monthly',
    addons: [] as string[],
    emailNotifications: false,
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
  <Card class="w-full max-w-sm">
    <CardContent>
      <form id="subscription-form" @submit.prevent="form.handleSubmit">
        <FieldGroup>
          <form.Field v-slot="{ field }" name="plan">
            <FieldSet>
              <FieldLegend>Subscription Plan</FieldLegend>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup
                :name="field.name"
                :model-value="field.state.value"
                @update:model-value="field.handleChange"
              >
                <FieldLabel for="basic">
                  <Field
                    orientation="horizontal"
                    :data-invalid="isInvalid(field)"
                  >
                    <FieldContent>
                      <FieldTitle>Basic</FieldTitle>
                      <FieldDescription>
                        For individuals and small teams
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id="basic"
                      value="basic"
                      :aria-invalid="isInvalid(field)"
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel for="pro">
                  <Field
                    orientation="horizontal"
                    :data-invalid="isInvalid(field)"
                  >
                    <FieldContent>
                      <FieldTitle>Pro</FieldTitle>
                      <FieldDescription>
                        For businesses with higher demands
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id="pro"
                      value="pro"
                      :aria-invalid="isInvalid(field)"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </FieldSet>
          </form.Field>
          <FieldSeparator />
          <form.Field v-slot="{ field }" name="billingPeriod">
            <Field :data-invalid="isInvalid(field)">
              <FieldLabel :for="field.name">
                Billing Period
              </FieldLabel>
              <Select
                :name="field.name"
                :model-value="field.state.value"
                :aria-invalid="isInvalid(field)"
                @update:model-value="field.handleChange"
              >
                <SelectTrigger :id="field.name">
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">
                    Monthly
                  </SelectItem>
                  <SelectItem value="yearly">
                    Yearly
                  </SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                Choose how often you want to be billed.
              </FieldDescription>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </Field>
          </form.Field>
          <FieldSeparator />
          <form.Field v-slot="{ field }" name="addons" mode="array">
            <FieldSet>
              <FieldLegend>Add-ons</FieldLegend>
              <FieldDescription>
                Select additional features you'd like to include.
              </FieldDescription>
              <FieldGroup data-slot="checkbox-group">
                <Field
                  v-for="addon in addons"
                  :key="addon.id"
                  orientation="horizontal"
                  :data-invalid="isInvalid(field)"
                >
                  <Checkbox
                    :id="addon.id"
                    :name="field.name"
                    :aria-invalid="isInvalid(field)"
                    :checked="field.state.value.includes(addon.id)"
                    @update:checked="(checked) => {
                      if (checked) {
                        field.pushValue(addon.id)
                      }
                      else {
                        const index = field.state.value.indexOf(addon.id)
                        if (index > -1) {
                          field.removeValue(index)
                        }
                      }
                    }"
                  />
                  <FieldContent>
                    <FieldLabel :for="addon.id">
                      {{ addon.title }}
                    </FieldLabel>
                    <FieldDescription>
                      {{ addon.description }}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </FieldSet>
          </form.Field>
          <FieldSeparator />
          <form.Field v-slot="{ field }" name="emailNotifications">
            <Field orientation="horizontal" :data-invalid="isInvalid(field)">
              <FieldContent>
                <FieldLabel :for="field.name">
                  Email Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive email updates about your subscription
                </FieldDescription>
              </FieldContent>
              <Switch
                :id="field.name"
                :name="field.name"
                :checked="field.state.value"
                :aria-invalid="isInvalid(field)"
                @update:checked="field.handleChange"
              />
              <FieldError v-if="isInvalid(field)" :errors="field.state.meta.errors" />
            </Field>
          </form.Field>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter>
      <Field orientation="horizontal" class="justify-end">
        <Button type="submit" form="subscription-form">
          Save Preferences
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
