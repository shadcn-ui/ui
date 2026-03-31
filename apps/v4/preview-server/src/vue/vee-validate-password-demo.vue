<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { Check } from 'lucide-vue-next'
import { useForm, Field as VeeField } from 'vee-validate'
import { computed } from 'vue'
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
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/ui/field'
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from '@/ui/input-group'
import { Progress } from '@/ui/progress'

const passwordRequirements = [
  {
    id: 'length',
    label: 'At least 8 characters',
    test: (val: string) => val.length >= 8,
  },
  {
    id: 'lowercase',
    label: 'One lowercase letter',
    test: (val: string) => /[a-z]/.test(val),
  },
  {
    id: 'uppercase',
    label: 'One uppercase letter',
    test: (val: string) => /[A-Z]/.test(val),
  },
  { id: 'number', label: 'One number', test: (val: string) => /\d/.test(val) },
  {
    id: 'special',
    label: 'One special character',
    test: (val: string) => /[!@#$%^&*(),.?":{}|<>]/.test(val),
  },
]

const formSchema = toTypedSchema(
  z.object({
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .refine(
        val => /[a-z]/.test(val),
        'Password must contain at least one lowercase letter',
      )
      .refine(
        val => /[A-Z]/.test(val),
        'Password must contain at least one uppercase letter',
      )
      .refine(
        val => /\d/.test(val),
        'Password must contain at least one number',
      )
      .refine(
        val => /[!@#$%^&*(),.?":{}|<>]/.test(val),
        'Password must contain at least one special character',
      ),
  }),
)

const { handleSubmit, resetForm, values } = useForm({
  validationSchema: formSchema,
  initialValues: {
    password: '',
  },
})

// Calculate password strength
const metRequirements = computed(() =>
  passwordRequirements.filter(req => req.test(values.password || '')),
)

const strengthPercentage = computed(() =>
  (metRequirements.value.length / passwordRequirements.length) * 100,
)

// Determine strength level and color
const getStrengthColor = computed(() => {
  if (strengthPercentage.value === 0)
    return 'bg-neutral-200'
  if (strengthPercentage.value <= 40)
    return 'bg-red-500'
  if (strengthPercentage.value <= 80)
    return 'bg-yellow-500'
  return 'bg-green-500'
})

const allRequirementsMet = computed(() =>
  metRequirements.value.length === passwordRequirements.length,
)

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
    <CardHeader class="border-b">
      <CardTitle>Create Password</CardTitle>
      <CardDescription>
        Choose a strong password to secure your account.
      </CardDescription>
    </CardHeader>
    <CardContent>
      <form id="form-vee-password" @submit="onSubmit">
        <FieldGroup>
          <VeeField v-slot="{ field, errors }" name="password">
            <Field :data-invalid="!!errors.length">
              <FieldLabel for="form-vee-password-input">
                Password
              </FieldLabel>
              <InputGroup>
                <InputGroupInput
                  id="form-vee-password-input"
                  v-bind="field"
                  type="password"
                  placeholder="Enter your password"
                  :aria-invalid="!!errors.length"
                  autocomplete="new-password"
                />
                <InputGroupAddon align="inline-end">
                  <Check
                    :class="[
                      allRequirementsMet
                        ? 'text-green-500'
                        : 'text-muted-foreground',
                    ]"
                  />
                </InputGroupAddon>
              </InputGroup>

              <!-- Password strength meter -->
              <div class="space-y-2">
                <Progress
                  :model-value="strengthPercentage"
                  :class="getStrengthColor"
                />

                <!-- Requirements list -->
                <div class="space-y-1.5">
                  <div
                    v-for="requirement in passwordRequirements"
                    :key="requirement.id"
                    class="flex items-center gap-2 text-sm"
                  >
                    <Check
                      class="size-4" :class="[
                        requirement.test(values.password || '')
                          ? 'text-green-500'
                          : 'text-muted-foreground',
                      ]"
                    />
                    <span
                      :class="[
                        requirement.test(values.password || '')
                          ? 'text-foreground'
                          : 'text-muted-foreground',
                      ]"
                    >
                      {{ requirement.label }}
                    </span>
                  </div>
                </div>
              </div>

              <FieldError v-if="errors.length" :errors="errors" />
            </Field>
          </VeeField>
        </FieldGroup>
      </form>
    </CardContent>
    <CardFooter class="border-t">
      <Field>
        <Button type="submit" form="form-vee-password">
          Create Password
        </Button>
        <Button type="button" variant="outline" @click="resetForm">
          Reset
        </Button>
      </Field>
    </CardFooter>
  </Card>
</template>
