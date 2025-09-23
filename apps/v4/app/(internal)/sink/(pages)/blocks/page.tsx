import { AppearanceSettings } from "@/app/(internal)/sink/(pages)/blocks/appearance-settings"
import { DisplaySettings } from "@/app/(internal)/sink/(pages)/blocks/display-settings"
import { ShippingForm } from "@/app/(internal)/sink/(pages)/blocks/shipping-form"

import { NotionPromptForm } from "./notion-prompt-form"

export default function BlocksPage() {
  return (
    <div className="flex flex-1 flex-col gap-12 p-4 md:p-6">
      <div className="bg-muted/50 rounded-3xl p-2 [--radius:1.2rem] md:max-w-md">
        <NotionPromptForm />
      </div>
      <div className="flex min-w-0 flex-1 flex-col lg:flex-row 2xl:gap-24">
        <div className="flex max-w-lg flex-col gap-24">
          <AppearanceSettings />
          <DisplaySettings />
        </div>
        <div className="flex w-full max-w-lg flex-col gap-24">
          <ShippingForm />
        </div>
      </div>
    </div>
  )
}
