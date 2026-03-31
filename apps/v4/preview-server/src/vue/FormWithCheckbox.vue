<script setup lang="ts">
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { z } from "zod"
import { Button } from "@/ui/button"
import { Checkbox } from "@/ui/checkbox"
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/ui/form"
import { Input } from "@/ui/input"
import { Example } from "@/components"

const formSchema = toTypedSchema(z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  mobile: z.boolean().default(false).optional(),
  marketing: z.boolean().refine(val => val === true, {
    message: "You must accept marketing emails.",
  }),
}))

const form = useForm({
  validationSchema: formSchema,
})

const onSubmit = form.handleSubmit((values) => {
  console.log("Form submitted:", values)
})
</script>

<template>
  <Example title="Form with Checkbox">
    <form class="w-full max-w-sm space-y-6" @submit="onSubmit">
      <FormField v-slot="{ componentField }" name="username">
        <FormItem>
          <FormLabel>Username</FormLabel>
          <FormControl>
            <Input type="text" placeholder="johndoe" v-bind="componentField" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ value, handleChange }" type="checkbox" name="mobile">
        <FormItem class="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
          <FormControl>
            <Checkbox :checked="value" @update:checked="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>
              Use different settings for my mobile devices
            </FormLabel>
            <FormDescription>
              You can manage your mobile notifications in the mobile settings page.
            </FormDescription>
          </div>
        </FormItem>
      </FormField>

      <FormField v-slot="{ value, handleChange }" type="checkbox" name="marketing">
        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
          <FormControl>
            <Checkbox :checked="value" @update:checked="handleChange" />
          </FormControl>
          <div class="space-y-1 leading-none">
            <FormLabel>
              Marketing emails
            </FormLabel>
            <FormDescription>
              Receive emails about new products, features, and more.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      </FormField>

      <Button type="submit">
        Submit
      </Button>
    </form>
  </Example>
</template>
