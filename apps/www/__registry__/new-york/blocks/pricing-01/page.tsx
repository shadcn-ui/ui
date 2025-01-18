import { Pricing } from "@/registry/new-york/blocks/pricing-01/components/pricing"

export default function Page() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-4xl">
        <Pricing />
      </div>
    </div>
  )
}
