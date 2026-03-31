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

const formSchema = toTypedSchema(
  z.object({
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
  }),
)

const { handleSubmit, resetForm } = useForm({
  validationSchema: formSchema,
  initialValues: {
    plan: 'basic',
    billingPeriod: '',
    addons: [],
    emailNotifications: false,
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
  <Card class="w-full max-w-sm">
    <CardHeader class="border-b">
      <CardTitle>You're almost there!</CardTitle>
      <CardDescription>
        Choose your subscription plan and billing period.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-complex" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="plan">
            <FieldSet :data-invalid="!!errors.length">
              <FieldLegend variant="label">
                Subscription Plan
              </FieldLegend>
              <FieldDescription>
                Choose your subscription plan.
              </FieldDescription>
              <RadioGroup
                :name="field.name"
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              >
                <FieldLabel for="form-vee-complex-basic">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Basic</FieldTitle>
                      <FieldDescription>
                        For individuals and small teams
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id="form-vee-complex-basic"
                      value="basic"
                    />
                  </Field>
                </FieldLabel>
                <FieldLabel for="form-vee-complex-pro">
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>Pro</FieldTitle>
                      <FieldDescription>
                        For businesses with higher demands
                      </FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id="form-vee-complex-pro"
                      value="pro"
                    />
                  </Field>
                </FieldLabel>
              </RadioGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </FieldSet>
          </VeeField>
          <FieldSeparator />
          <VeeField v-slot="{ field, errors }" name="billingPeriod">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-complex-billingPeriod">
                Billing Period
              </FieldLabel>
              <Select
                :name="field.name"
                :model-value="field.value"
                @update:model-value="field.onChange"
              >
                <SelectTrigger
                  id="form-vee-complex-billingPeriod"
                  :aria-invalid="!!errors.length"
                >
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
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
          <FieldSeparator />
          <VeeField v-slot="{ field, errors }" name="addons">
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
                  :data-invalid="!!errors.length"
                >
                  <Checkbox
                    :id="`form-vee-complex-${addon.id}`"
                    :name="field.name"
                    :aria-invalid="!!errors.length"
                    :model-value="field.value?.includes(addon.id)"
                    @update:model-value="(checked: boolean | 'indeterminate') => {
                      const newValue = checked
                        ? [...(field.value || []), addon.id]
                        : (field.value || []).filter((value: string) => value !== addon.id)
                      field.onChange(newValue)
                    }"
                  />
                  <FieldContent>
                    <FieldLabel :for="`form-vee-complex-${addon.id}`">
                      {{ addon.title }}
                    </FieldLabel>
                    <FieldDescription>
                      {{ addon.description }}
                    </FieldDescription>
                  </FieldContent>
                </Field>
              </FieldGroup>
              <FieldError v-if="errors.length" :errors="errors" />
            </FieldSet>
          </VeeField>
          <FieldSeparator />
          <VeeField
            v-slot="{ field, errors }"
            name="emailNotifications"
            type="checkbox"
          >
            <Field
              orientation="horizontal"
              :data-invalid="!!errors.length"
            >
              <FieldContent>
                <FieldLabel for="form-vee-complex-emailNotifications">
                  Email Notifications
                </FieldLabel>
                <FieldDescription>
                  Receive email updates about your subscription
                </FieldDescription>
              </FieldContent>
              <Switch
                id="form-vee-complex-emailNotifications"
                :name="field.name"
                :model-value="field.value"
                :aria-invalid="!!errors.length"
                @update:model-value="field.onChange"
              />
              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter class="border-t">
      <Field>
        <Button type="submit" form="form-vee-complex">
          Save Preferences
        </Button>
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
