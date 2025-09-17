"use server"

import {
  FormState,
  phoneOrderSchema,
} from "@/app/(internal)/sink/complex-form/schema"

export async function submitPhoneOrder(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  await new Promise((resolve) => setTimeout(resolve, 2000))

  const values = {
    model: (formData.get("model") as string | null) || "",
    color: (formData.get("color") as string | null) || "",
    storage: (formData.get("storage") as string | null) || "",
    accessories: formData.getAll("accessories") as string[],
    firstName: (formData.get("firstName") as string | null) || "",
    lastName: (formData.get("lastName") as string | null) || "",
    email: (formData.get("email") as string | null) || "",
    phone: (formData.get("phone") as string | null) || "",
    address: (formData.get("address") as string | null) || "",
    city: (formData.get("city") as string | null) || "",
    state: (formData.get("state") as string | null) || "",
    zipCode: (formData.get("zipCode") as string | null) || "",
    country: (formData.get("country") as string | null) || "",
    cardNumber: (formData.get("cardNumber") as string | null) || "",
    expiryDate: (formData.get("expiryDate") as string | null) || "",
    cvv: (formData.get("cvv") as string | null) || "",
    cardName: (formData.get("cardName") as string | null) || "",
  }

  const result = phoneOrderSchema.safeParse(values)

  if (!result.success) {
    return {
      values,
      success: false,
      errors: result.error.flatten().fieldErrors,
    }
  }

  if (result.data.email === "blocked@example.com") {
    return {
      values,
      success: false,
      errors: {
        email: ["This email address is not allowed."],
      },
    }
  }

  return {
    values,
    errors: null,
    success: true,
  }
}
