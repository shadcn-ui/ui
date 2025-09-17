import { z } from "zod"

export const phoneOrderSchema = z.object({
  model: z.string().min(1, {
    message: "Please select a phone model.",
  }),
  color: z.string().min(1, {
    message: "Please select a color.",
  }),
  storage: z.string().min(1, {
    message: "Please select storage capacity.",
  }),
  accessories: z.array(z.string()).min(1, {
    message: "Please select at least one accessory.",
  }),
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Please enter a valid phone number.",
  }),
  address: z.string().min(5, {
    message: "Please enter a valid address.",
  }),
  city: z.string().min(2, {
    message: "Please enter a valid city.",
  }),
  state: z.string().min(1, {
    message: "Please select a state.",
  }),
  zipCode: z.string().min(5, {
    message: "Please enter a valid ZIP code.",
  }),
  country: z.string().min(1, {
    message: "Please select a country.",
  }),
  cardNumber: z.string().min(16, {
    message: "Please enter a valid card number.",
  }),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, {
    message: "Please enter a valid expiry date (MM/YY).",
  }),
  cvv: z.string().min(3, {
    message: "Please enter a valid CVV.",
  }),
  cardName: z.string().min(2, {
    message: "Please enter the name on card.",
  }),
})

export type FormState = {
  values: z.infer<typeof phoneOrderSchema>
  errors: null | Partial<
    Record<keyof z.infer<typeof phoneOrderSchema>, string[]>
  >
  success: boolean
}