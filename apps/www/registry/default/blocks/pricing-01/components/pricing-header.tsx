import { cn } from "@/lib/utils"

export function PricingHeader() {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-10">
      <h1
        className={cn(
          "text-4xl font-medium uppercase tracking-tighter",
          "text-neutral-900 dark:text-white"
        )}
      >
        Pricing
      </h1>
      <p className="text-lg text-neutral-500 dark:text-neutral-400">
        Choose the plan that suits your needs
      </p>
    </div>
  )
}
