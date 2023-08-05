import z from "zod"

const envSchema = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  NEXTAUTH_SECRET: z.string().min(8),
  EMAIL_FROM: z.string().min(1),
  RESEND_API_KEY: z.string().min(1),
  SUPER_ADMIN_EMAIL: z.string().min(1),
  STRIPE_SECRET_KEY: z.string().min(1),
  STRIPE_WEBHOOK_KEY: z.string().min(1),
  STRIPE_PRICE_ID: z.string().min(1),
})

const env = envSchema.parse(process.env)

export default env
