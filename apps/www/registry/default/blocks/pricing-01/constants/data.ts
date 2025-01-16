import type { PricingTier } from "@/registry/default/blocks/pricing-01/types/pricing"

export const pricingTiers: PricingTier[] = [
  {
    name: "Free",
    description: "For starters and hobbyists that want to try out.",
    price: {
      yearly: null,
      quarterly: null,
      suffix: "",
    },
    features: [
      { text: "10 users included", included: true },
      { text: "2 GB of storage", included: true },
      { text: "Help center access", included: true },
      { text: "Email support", included: true },
    ],
    buttonText: "Continue with Free",
    buttonVariant: "outline",
    buttonHref: "#free",
  },
  {
    name: "Pro",
    description: "For small teams that have less that 10 members.",
    price: {
      yearly: 72,
      quarterly: 24,
      suffix: "/user",
    },
    features: [
      { text: "20 users included", included: true },
      { text: "10 GB of storage", included: true },
      { text: "Help center access", included: true },
      { text: "Priority email support", included: true },
    ],
    buttonText: "Get started",
    buttonHref: "#pro",
    highlighted: true,
    savings: 24,
  },
  {
    name: "Team",
    description: "For large teams that have more than 10 members.",
    price: {
      yearly: 90,
      quarterly: 30,
      suffix: "/user",
    },
    features: [
      { text: "50 users included", included: true },
      { text: "30 GB of storage", included: true },
      { text: "Help center access", included: true },
      { text: "Phone & email support", included: true },
    ],
    buttonText: "Contact us",
    buttonVariant: "outline",
    buttonHref: "#team",
    savings: 30,
  },
]
