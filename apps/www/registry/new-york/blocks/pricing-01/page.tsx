import { PricingSection } from "@/registry/new-york/blocks/pricing-01/components/pricing-section"
import { pricingTiers } from "@/registry/new-york/blocks/pricing-01/constants/data"

const Home = () => {
  return (
    <div className="min-h-svh bg-background text-foreground">
      <PricingSection
        title="Get unlimited access."
        subtitle="Discover the ideal plan, beginning at under $2 per week."
        tiers={pricingTiers}
      />
    </div>
  )
}

export default Home
