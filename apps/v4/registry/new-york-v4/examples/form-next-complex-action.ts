"use server"

import { formSchema, type FormState } from "./form-next-complex-schema"

export async function complexFormAction(
  _prevState: FormState,
  formData: FormData
) {
  // Sleep for 1 second
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const values = {
    plan: formData.get("plan") as FormState["values"]["plan"],
    billingPeriod: formData.get("billingPeriod") as string,
    addons: formData.getAll("addons") as string[],
    emailNotifications: formData.get("emailNotifications") === "on",
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
