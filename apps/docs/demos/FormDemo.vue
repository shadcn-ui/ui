<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import { z } from 'zod'
import {
  Button,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  Input,
  toast,
} from '@saaze/ui'

const form = useForm({
  validationSchema: toTypedSchema(
    z.object({
      name: z.string().min(2, 'نام باید حداقل ۲ نویسه باشد.'),
      email: z.string().email('ایمیل معتبر وارد کنید.'),
    }),
  ),
  initialValues: {
    name: '',
    email: '',
  },
})

const onSubmit = form.handleSubmit((values) => {
  toast({
    title: 'فرم معتبر است',
    description: `خوش آمدید ${values.name}!`,
  })
})
</script>

<template>
  <form class="grid w-full max-w-sm gap-4" @submit="onSubmit">
    <FormField v-slot="{ componentField }" name="name">
      <FormItem>
        <FormLabel>نام و نام خانوادگی</FormLabel>
        <FormControl>
          <Input v-bind="componentField" placeholder="مثلاً سارا احمدی" />
        </FormControl>
        <FormDescription>نامی که در پروفایل نمایش داده می‌شود.</FormDescription>
        <FormMessage />
      </FormItem>
    </FormField>

    <FormField v-slot="{ componentField }" name="email">
      <FormItem>
        <FormLabel>ایمیل</FormLabel>
        <FormControl>
          <Input v-bind="componentField" type="email" dir="ltr" placeholder="name@example.com" />
        </FormControl>
        <FormMessage />
      </FormItem>
    </FormField>

    <Button type="submit">ارسال فرم</Button>
  </form>
</template>
