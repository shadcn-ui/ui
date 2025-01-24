export interface PricingFeature {
  text: string
  included: boolean
}

export interface PricingTier {
  name: string
  description: string
  price: {
    yearly: number | null
    quarterly: number | null
    suffix?: string
  }
  features: PricingFeature[]
  buttonText: string
  buttonVariant?: "default" | "outline"
  buttonHref: string
  highlighted?: boolean
  savings?: number
}

export interface PricingProps {
  title: string
  subtitle: string
  tiers: PricingTier[]
}
