import { AppearanceSettings } from "@/registry/new-york-v4/blocks/new-components-01/components/appearance-settings"
import { ButtonGroupDemo } from "@/registry/new-york-v4/blocks/new-components-01/components/button-group-demo"
import { ButtonGroupInputGroup } from "@/registry/new-york-v4/blocks/new-components-01/components/button-group-input-group"
import { ButtonGroupNested } from "@/registry/new-york-v4/blocks/new-components-01/components/button-group-nested"
import { ButtonGroupPopover } from "@/registry/new-york-v4/blocks/new-components-01/components/button-group-popover"
import { EmptyAvatarGroup } from "@/registry/new-york-v4/blocks/new-components-01/components/empty-avatar-group"
import { FieldDemo } from "@/registry/new-york-v4/blocks/new-components-01/components/field-demo"
import { FieldSlider } from "@/registry/new-york-v4/blocks/new-components-01/components/field-slider"
import { InputGroupButtonExample } from "@/registry/new-york-v4/blocks/new-components-01/components/input-group-button"
import { InputGroupDemo } from "@/registry/new-york-v4/blocks/new-components-01/components/input-group-demo"
import { ItemDemo } from "@/registry/new-york-v4/blocks/new-components-01/components/item-demo"
import { NotionPromptForm } from "@/registry/new-york-v4/blocks/new-components-01/components/notion-prompt-form"
import { SpinnerBadge } from "@/registry/new-york-v4/blocks/new-components-01/components/spinner-badge"
import { SpinnerEmpty } from "@/registry/new-york-v4/blocks/new-components-01/components/spinner-empty"
import { Checkbox } from "@/registry/new-york-v4/ui/checkbox"
import {
  Field,
  FieldLabel,
  FieldSeparator,
} from "@/registry/new-york-v4/ui/field"

export default function Page() {
  return (
    <div className="flex flex-col justify-center">
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
          <div className="flex gap-4">
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
