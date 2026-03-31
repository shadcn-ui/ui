<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { h } from 'vue'
import { toast } from 'vue-sonner'

import * as z from 'zod'
import { Button } from '@/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from '@/ui/field'
import {
  NumberField,
  NumberFieldContent,
  NumberFieldDecrement,
  NumberFieldIncrement,
  NumberFieldInput,
} from '@/ui/number-field'

const formSchema = toTypedSchema(z.object({
  payment: z.number().min(10, 'Min 10 euros to send payment').max(5000, 'Max 5000 euros to send payment'),
}))

const { handleSubmit, setFieldValue } = useForm({
  validationSchema: formSchema,
  initialValues: {
    payment: 10,
  },
})

const onSubmit = handleSubmit((values) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[320px] rounded-md bg-neutral-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <form class="w-2/3 space-y-6" @submit="onSubmit">
    <VeeField v-slot="{ value, errors }" name="payment">
      <Field class="w-[300px]" :data-invalid="!!errors.length">
        <FieldLabel for="payment">
          Payment
        </FieldLabel>
        <NumberField
          class="gap-2"
          :min="0"
          :format-options="{
            style: 'currency',
            currency: 'EUR',
            currencyDisplay: 'code',
            currencySign: 'accounting',
          }"
          :model-value="value"
          @update:model-value="(v) => {
            if (v) {
              setFieldValue('payment', v)
            }
            else {
              setFieldValue('payment', undefined)
            }
          }"
        >
          <NumberFieldContent>
            <NumberFieldDecrement />
            <NumberFieldInput />
            <NumberFieldIncrement />
          </NumberFieldContent>
        </NumberField>
        <FieldDescription>
          Enter value between 10 and 5000.
        </FieldDescription>
        <FieldError v-if="errors.length" :errors="errors" />
      </Field>
    </VeeField>
    <Button type="submit">
      Submit
    </Button>
  </form>
</template>
