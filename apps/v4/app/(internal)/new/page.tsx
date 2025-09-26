import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldLabel,
  FieldSeparator,
} from "@/registry/new-york-v4/ui/field"

import { AppearanceSettings } from "./components/appearance-settings"
import { ButtonGroupDemo } from "./components/button-group-demo"
import { ButtonGroupInputGroup } from "./components/button-group-input-group"
import { ButtonGroupNested } from "./components/button-group-nested"
import { ButtonGroupPopover } from "./components/button-group-popover"
import { EmptyAvatarGroup } from "./components/empty-avatar-group"
import { FieldDemo } from "./components/field-demo"
import { FieldSlider } from "./components/field-slider"
import { InputGroupButtonExample } from "./components/input-group-button"
import { InputGroupDemo } from "./components/input-group-demo"
import { ItemDemo } from "./components/item-demo"
import { ModeSwitcher } from "./components/mode-switcher"
import { NotionPromptForm } from "./components/notion-prompt-form"
import { SpinnerBadge } from "./components/spinner-badge"
import { SpinnerEmpty } from "./components/spinner-empty"
import { ThemeSelector } from "./components/theme-selector"

export default function NewSinkPage() {
  return (
    <div className="flex min-h-screen flex-col justify-center">
      <div className="theme-container mx-auto grid max-w-[2200px] gap-8 p-6 md:grid-cols-2 md:p-8 lg:grid-cols-3 xl:grid-cols-4">
        <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
          <FieldDemo />
        </div>
        <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
          <div className="*:[div]:border">
            <EmptyAvatarGroup />
          </div>
          <ButtonGroupInputGroup />
          <FieldSlider />
          <InputGroupDemo />
        </div>
        <div className="flex flex-col gap-6 *:[div]:w-full *:[div]:max-w-full">
          <ItemDemo />
          <FieldSeparator>Appearance Settings</FieldSeparator>
          <AppearanceSettings />
        </div>
        <div className="order-first flex flex-col gap-6 min-[1400px]:order-last *:[div]:w-full *:[div]:max-w-full">
          <div className="flex gap-2">
            <SpinnerBadge />
            <ThemeSelector />
            <ModeSwitcher />
          </div>
          <InputGroupButtonExample />
          <NotionPromptForm />
          <ButtonGroupDemo />
          <div className="flex gap-6">
            <FieldLabel htmlFor="checkbox-demo">
              <Field orientation="horizontal">
                <Checkbox id="checkbox-demo" defaultChecked />
                <FieldLabel htmlFor="checkbox-demo" className="line-clamp-1">
                  I agree to the terms and conditions
                </FieldLabel>
              </Field>
            </FieldLabel>
          </div>
          <div className="flex gap-6">
            <ButtonGroupNested />
            <ButtonGroupPopover />
          </div>
          <div className="*:[div]:border">
            <SpinnerEmpty />
          </div>
        </div>
      </div>
    </div>
  )
}
