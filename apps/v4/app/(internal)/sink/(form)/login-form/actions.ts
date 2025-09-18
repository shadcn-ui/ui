"use server"

import {
  FormState,
  loginSchema,
} from "@/app/(internal)/sink/(form)/login-form/login-form"

export async function loginAction(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  // Wait for 2 seconds.
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const values = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const result = loginSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  if (result.data.email !== "admin@example.com") {
    return {
      values,
      success: false,
      errors: {
        email: ["Invalid email or password"],
      },
    }
  }

  return {
    values,
    errors: null,
    success: true,
  }
}
