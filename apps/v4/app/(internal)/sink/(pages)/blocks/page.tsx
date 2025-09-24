import { AppearanceSettings } from "@/app/(internal)/sink/(pages)/blocks/appearance-settings"
import { ChatSettings } from "@/app/(internal)/sink/(pages)/blocks/chat-settings"
import { DisplaySettings } from "@/app/(internal)/sink/(pages)/blocks/display-settings"
import { ShippingForm } from "@/app/(internal)/sink/(pages)/blocks/shipping-form"

import { NotionPromptForm } from "./notion-prompt-form"

export default function BlocksPage() {
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
      </div>
    </div>
  )
}
