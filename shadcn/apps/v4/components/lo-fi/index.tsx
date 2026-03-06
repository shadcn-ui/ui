import { AccordionLoFi } from "@/components/lo-fi/accordion"
import { AlertLoFi } from "@/components/lo-fi/alert"
import {
  Component,
  ComponentContent,
  ComponentName,
} from "@/components/lo-fi/component"

export function LoFi() {
  return (
    <div className="mx-auto grid max-w-[350px] gap-6 sm:max-w-none sm:grid-cols-2">
      <Component href="/docs/components/accordion">
        <ComponentContent>
          <AccordionLoFi />
        </ComponentContent>
        <ComponentName>Accordion</ComponentName>
      </Component>
      <Component href="/docs/components/alert">
        <ComponentContent>
          <AlertLoFi />
        </ComponentContent>
        <ComponentName>Alert</ComponentName>
      </Component>
    </div>
  )
}
