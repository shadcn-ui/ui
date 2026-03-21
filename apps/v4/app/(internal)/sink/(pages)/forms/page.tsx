import { AppearanceSettings } from "@/app/(internal)/sink/(pages)/forms/appearance-settings"
import { ChatSettings } from "@/app/(internal)/sink/(pages)/forms/chat-settings"
import { DisplaySettings } from "@/app/(internal)/sink/(pages)/forms/display-settings"
import { NotionPromptForm } from "@/app/(internal)/sink/(pages)/forms/notion-prompt-form"
import { ShipRegistrationForm } from "@/app/(internal)/sink/(pages)/forms/ship-registration-form"
import { ShippingForm } from "@/app/(internal)/sink/(pages)/forms/shipping-form"

export default function FormsPage() {
  return (
    <div className="@container flex flex-1 flex-col gap-12 p-4">
      <div className="grid flex-1 gap-12 @3xl:grid-cols-2 @5xl:grid-cols-3 @[120rem]:grid-cols-4 [&>div]:max-w-lg">
        <div className="flex flex-col gap-12">
          <NotionPromptForm />
          <ChatSettings />
        </div>
        <div className="flex flex-col gap-12">
          <AppearanceSettings />
        </div>
        <div className="flex flex-col gap-12">
          <DisplaySettings />
        </div>
        <div className="flex flex-col gap-12">
          <ShippingForm />
        </div>
        <div className="col-span-2 flex flex-col gap-12">
          <ShipRegistrationForm />
        </div>
      </div>
    </div>
  )
}
