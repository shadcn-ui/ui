<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { toast } from 'vue-sonner'

import { z } from 'zod'
import { Button } from '@/ui/button'
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/ui/form'
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select'

const formSchema = toTypedSchema(z.object({
  country: z.string().min(2, {
    message: 'Select a country.',
  }),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log('Form submitted!', values)
  toast('You submitted the following values:', {
    description: h('pre', { class: 'mt-2 rounded-md bg-neutral-900 p-4 w-full' }, h('code', { class: 'text-code-foreground' }, JSON.stringify(values, null, 2))),
  })
})
</script>

<template>
  <form class="w-full max-w-sm space-y-6" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="country">
      <FormItem>
        <FormLabel>Country</FormLabel>
        <FormControl>
          <NativeSelect v-bind="componentField">
            <NativeSelectOption value="">
              Select a country
            </NativeSelectOption>
            <NativeSelectOption value="us">
              United States
            </NativeSelectOption>
            <NativeSelectOption value="uk">
              United Kingdom
            </NativeSelectOption>
            <NativeSelectOption value="ca">
              Canada
            </NativeSelectOption>
          </NativeSelect>
        </FormControl>
        <FormDescription>
          Select a country
        </FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit" class="w-full">
      Submit
    </Button>
  </form>
</template>
