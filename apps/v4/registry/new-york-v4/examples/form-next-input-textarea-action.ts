"use server"

import { formSchema, type FormState } from "./form-next-input-textarea-schema"

export async function formAction(_prevState: FormState, formData: FormData) {
  const values = {
    title: formData.get("title") as string,
    description: formData.get("description") as string,
  }

  const result = formSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Do something with the values.
  // Call your database or API here.

  return {
    values,
    errors: null,
    success: true,
  }
}
