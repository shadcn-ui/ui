import { endpointSecret, stripe } from "@/lib/stripe"

import Stripe from "stripe"
import db from "@/lib/prisma"
import { headers } from "next/headers"

export async function POST(req: Request) {
  const body = await req.text()
  const signature = headers().get("stripe-signature") as string
  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, endpointSecret!)
  } catch (error: any) {
    return new Response(`Webhook Error: ${error.message}`, { status: 400 })
  }

  const session = event.data.object as Stripe.Checkout.Session

  if (event.type === "checkout.session.completed") {
    const user = await db.user.findUnique({
      where: {
        id: session.metadata?.userId,
      },
      select: {
        id: true,
        memberships: true,
      },
    })

    if (!user) {
      return new Response(null, { status: 404 })
    }

    const membership = user?.memberships[0]
    const paymentIntent = session.payment_intent

    // Update the user stripe into in our database.
    await db.organization.update({
      where: {
        id: membership?.id,
      },
      data: {
        stripeSubscriptionId: String(paymentIntent),
        stripeCustomerId: session.customer_email,
        stripePriceId: String(paymentIntent),
      },
    })
  }

  return new Response(null, { status: 200 })
}
