"use server"

import { FormState } from "@/app/(internal)/sink/(pages)/next-form/example-form"
import { exampleFormSchema } from "@/app/(internal)/sink/(pages)/schema"

export async function subscriptionAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Simulate server processing
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const values = {
    name: formData.get("name") as string,
    email: formData.get("email") as string,
    plan: formData.get("plan") as "basic" | "pro",
    billingPeriod: formData.get("billingPeriod") as string,
    addons: formData.getAll("addons") as string[],
    teamSize: parseInt(formData.get("teamSize") as string) || 1,
    emailNotifications: formData.get("emailNotifications") === "on",
    startDate: formData.get("startDate")
      ? new Date(formData.get("startDate") as string)
      : new Date(),
    theme: formData.get("theme") as string,
    password: formData.get("password") as string,
    comments: formData.get("comments") as string,
  }

  const result = exampleFormSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  // Simulate some business logic validation
  if (result.data.email.includes("invalid")) {
    return {
      values,
      success: false,
      errors: {
        email: ["This email domain is not supported"],
      },
    }
  }

  return {
    values,
    errors: null,
    success: true,
  }
}
