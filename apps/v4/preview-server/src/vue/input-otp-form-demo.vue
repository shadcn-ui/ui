<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm, Field as VeeField } from 'vee-validate'
import { toast } from 'vue-sonner'
import { z } from 'zod'

import { Button } from '@/ui/button'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ui/input-otp'

const formSchema = toTypedSchema(
  z.object({
    pin: z.string().min(6, {
      message: 'Your one-time password must be 6 characters.',
    }),
  }),
)

const { handleSubmit, submitCount } = useForm({
  validationSchema: formSchema,
  initialValues: {
    pin: '',
  },
})

const onSubmit = handleSubmit((data) => {
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 w-[320px] rounded-md bg-neutral-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(data, null, 2))),
  })
})
</script>

<template>
  <form id="form-otp-demo" class="space-y-6 w-sm" @submit="onSubmit">
    <FieldGroup>
      <VeeField v-slot="{ componentField, errors }" name="pin" :validate-on-blur="false" :validate-on-input="submitCount > 0" :validate-on-model-update="submitCount > 0">
        <Field :data-invalid="!!errors.length">
          <FieldLabel for="form-otp-demo-pin">
            One-Time Password
          </FieldLabel>
          <InputOTP
            id="form-otp-demo-pin"
            v-bind="componentField"
            :maxlength="6"
            :aria-invalid="!!errors.length"
          >
            <InputOTPGroup>
              <InputOTPSlot :index="0" />
              <InputOTPSlot :index="1" />
              <InputOTPSlot :index="2" />
              <InputOTPSlot :index="3" />
              <InputOTPSlot :index="4" />
              <InputOTPSlot :index="5" />
            </InputOTPGroup>
          </InputOTP>
          <FieldDescription>
            Please enter the one-time password sent to your phone.
          </FieldDescription>
          <FieldError v-if="errors.length" :errors="errors" />
        </Field>
      </VeeField>
    </FieldGroup>
    <Button type="submit" form="form-otp-demo">
      Submit
    </Button>
  </form>
</template>
