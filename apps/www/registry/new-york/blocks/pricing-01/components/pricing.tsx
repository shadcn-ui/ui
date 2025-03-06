import { PricingCard } from "@/registry/new-york/blocks/pricing-01/components/pricing-card"
import { PricingHeader } from "@/registry/new-york/blocks/pricing-01/components/pricing-header"

const defaultTiers = [
  {
    name: "SELF",
    price: 299,
    description: "For small teams and growing businesses",
    features: [
      { name: "Up to 20 team members", included: true },
      { name: "Advanced analytics", included: true },
      { name: "24/7 email support", included: true },
      { name: "API access", included: true, highlight: true },
      { name: "Custom integrations", included: false },
      { name: "Enterprise features", included: false },
    ],
    cta: "Get started",
  },
  {
    name: "TEAM",
    price: 999,
    description: "For large organizations and enterprises",
    highlight: true,
    features: [
      { name: "Unlimited team members", included: true },
      { name: "Advanced analytics", included: true },
      { name: "24/7 priority support", included: true },
      { name: "Unlimited API access", included: true, highlight: true },
      { name: "Custom integrations", included: true },
      { name: "Enterprise features", included: true },
    ],
    cta: "Get started",
  },
]

export function Pricing() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4">
      <PricingHeader />
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
        {defaultTiers.map((tier) => (
          <PricingCard key={tier.name} {...tier} />
        ))}
      </div>
    </div>
  )
}
