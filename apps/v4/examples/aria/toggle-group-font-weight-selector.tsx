"use client"

import * as React from "react"

import {
  Field,
  FieldDescription,
  FieldLabel,
} from "@/styles/aria-nova/ui/field"
import {
  ToggleGroup,
  ToggleGroupItem,
} from "@/styles/aria-nova/ui/toggle-group"

export function ToggleGroupFontWeightSelector() {
  const [fontWeight, setFontWeight] = React.useState("normal")
  return (
    <Field>
      <FieldLabel>Font Weight</FieldLabel>
      <ToggleGroup
        selectedKeys={[fontWeight]}
        onSelectionChange={(value) => setFontWeight([...value][0] as string)}
        variant="outline"
        spacing={2}
        size="lg"
      >
        <ToggleGroupItem
          id="light"
          aria-label="Light"
          className="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-2xl leading-none font-light">Aa</span>
          <span className="text-xs text-muted-foreground">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          id="normal"
          aria-label="Normal"
          className="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-2xl leading-none font-normal">Aa</span>
          <span className="text-xs text-muted-foreground">Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          id="medium"
          aria-label="Medium"
          className="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-2xl leading-none font-medium">Aa</span>
          <span className="text-xs text-muted-foreground">Medium</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          id="bold"
          aria-label="Bold"
          className="flex size-16 flex-col items-center justify-center rounded-xl"
        >
          <span className="text-2xl leading-none font-bold">Aa</span>
          <span className="text-xs text-muted-foreground">Bold</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription>
        Use{" "}
        <code className="rounded-md bg-muted px-1 py-0.5 font-mono">
          font-{fontWeight}
        </code>{" "}
        to set the font weight.
      </FieldDescription>
    </Field>
  )
}
