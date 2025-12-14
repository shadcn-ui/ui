import { FieldSeparator } from "@/registry/new-york-v4/ui/field"

import { AppearanceSettings } from "./appearance-settings"
import { ButtonGroupDemo } from "./button-group-demo"
import { ButtonGroupInputGroup } from "./button-group-input-group"
import { ButtonGroupNested } from "./button-group-nested"
import { ButtonGroupPopover } from "./button-group-popover"
import { EmptyAvatarGroup } from "./empty-avatar-group"
import { FieldCheckbox } from "./field-checkbox"
import { FieldDemo } from "./field-demo"
import { FieldHear } from "./field-hear"
import { FieldSlider } from "./field-slider"
import { InputGroupButtonExample } from "./input-group-button"
import { InputGroupDemo } from "./input-group-demo"
import { ItemDemo } from "./item-demo"
import { NotionPromptForm } from "./notion-prompt-form"
import { SpinnerBadge } from "./spinner-badge"
import { SpinnerEmpty } from "./spinner-empty"

export function RootComponents() {
  return (
    <div className="theme-container mx-auto grid gap-8 py-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6 2xl:gap-8">
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <FieldDemo />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <EmptyAvatarGroup />
        <SpinnerBadge />
        <ButtonGroupInputGroup />
        <FieldSlider />
        <InputGroupDemo />
      </div>
      <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
        <InputGroupButtonExample />
        <ItemDemo />
        <FieldSeparator className="my-4">Appearance Settings</FieldSeparator>
        <AppearanceSettings />
      </div>
      <div className="order-first flex flex-col gap-6 lg:hidden xl:order-last xl:flex *:[div]:w-full *:[div]:max-w-full">
        <NotionPromptForm />
        <ButtonGroupDemo />
        <FieldCheckbox />
        <div className="flex justify-between gap-4">
          <ButtonGroupNested />
          <ButtonGroupPopover />
        </div>
        <FieldHear />
        <SpinnerEmpty />
      </div>
    </div>
  )
}
