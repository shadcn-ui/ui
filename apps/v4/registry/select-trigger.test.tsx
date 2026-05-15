import * as React from "react"
import { describe, expect, it, vi } from "vitest"

import { SelectTrigger as RadixSelectTrigger } from "./bases/radix/ui/select"
import { SelectTrigger as NewYorkSelectTrigger } from "./new-york-v4/ui/select"

vi.mock("@/app/(app)/create/lib/search-params", () => ({
  useDesignSystemSearchParams: () => [{ iconLibrary: "lucide" }],
}))

type SelectTriggerProps = React.ComponentProps<typeof RadixSelectTrigger>
type SelectTriggerComponent = (props: SelectTriggerProps) => React.ReactElement

const selectTriggers = [
  ["radix base", RadixSelectTrigger],
  ["new-york v4", NewYorkSelectTrigger],
] as const satisfies ReadonlyArray<readonly [string, SelectTriggerComponent]>

function createTrigger(
  Component: SelectTriggerComponent,
  props: Partial<SelectTriggerProps> = {}
) {
  return Component({
    children: <button type="button" />,
    ...props,
  } as SelectTriggerProps)
}

function getTriggerProps(element: React.ReactElement) {
  return element.props as {
    asChild?: boolean
    children: React.ReactNode
  }
}

function getFragmentChildren(children: React.ReactNode) {
  const [fragment] = React.Children.toArray(children) as React.ReactElement<{
    children: React.ReactNode
  }>[]

  return fragment.props.children
}

describe("SelectTrigger", () => {
  it.each(selectTriggers)(
    "passes one child to Radix Trigger when %s uses asChild",
    (_, SelectTrigger) => {
      const element = createTrigger(SelectTrigger, { asChild: true })
      const props = getTriggerProps(element)

      expect(props.asChild).toBe(true)
      expect(React.Children.count(props.children)).toBe(1)
    }
  )

  it.each(selectTriggers)(
    "keeps the trigger icon when %s does not use asChild",
    (_, SelectTrigger) => {
      const element = createTrigger(SelectTrigger)
      const props = getTriggerProps(element)
      const fragmentChildren = getFragmentChildren(props.children)

      expect(props.asChild).toBeUndefined()
      expect(React.Children.count(props.children)).toBe(1)
      expect(React.Children.count(fragmentChildren)).toBe(2)
    }
  )
})
