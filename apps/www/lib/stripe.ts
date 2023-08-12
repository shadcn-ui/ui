import Stripe from "stripe"
import env from "./env"

export const stripe = new Stripe(env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
  typescript: true,
})

// Replace this endpoint secret with your endpoint's unique secret
// If you are testing with the CLI, find the secret by running 'stripe listen'
// If you are using an endpoint defined with the API or dashboard, look in your webhook settings
// at https://dashboard.stripe.com/webhooks
export const endpointSecret = env.STRIPE_WEBHOOK_KEY
