import { Metadata, NextApiRequest, NextApiResponse } from "next"

import { NextResponse } from "next/server"
import env from "@/lib/env"
import { headers } from "next/headers"
import { stripe } from "@/lib/stripe"

export async function POST(req: Request, res: NextApiResponse) {
  const data = await req.text()
  let params = new URLSearchParams(data)
  const headersList = headers()
  const origin = headersList.get("origin")

  console.log({ email: params.get("email"), userId: params.get("userId") })

  const stripeSession = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price: env.STRIPE_PRICE_ID,
        quantity: 1,
      },
    ],
    mode: "payment",
    customer_email: params.get("email")!,
    metadata: {
      userId: params.get("userId"),
    },
    success_url: `${origin}/docs?success=true&session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/docs?canceled=true`,
  })
  return NextResponse.redirect(String(stripeSession.url), 303)
}
