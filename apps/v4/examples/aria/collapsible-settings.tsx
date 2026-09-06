"use client"

import * as React from "react"
import { MaximizeIcon, MinimizeIcon } from "lucide-react"

import { Button } from "@/styles/aria-nova/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/styles/aria-nova/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/styles/aria-nova/ui/collapsible"
import { Field, FieldGroup, FieldLabel } from "@/styles/aria-nova/ui/field"
import { Input } from "@/styles/aria-nova/ui/input"

export function CollapsibleSettings() {
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Card className="mx-auto w-full max-w-xs" size="sm">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>Set the corner radius of the element.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          isExpanded={isOpen}
          onExpandedChange={setIsOpen}
          className="flex items-start gap-2"
        >
          <FieldGroup className="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="radius-x" className="sr-only">
                Radius X
              </FieldLabel>
              <Input id="radius" placeholder="0" defaultValue={0} />
            </Field>
            <Field>
              <FieldLabel htmlFor="radius-y" className="sr-only">
                Radius Y
              </FieldLabel>
              <Input id="radius" placeholder="0" defaultValue={0} />
            </Field>
            <CollapsibleContent>
              <div className="col-span-full grid grid-cols-subgrid gap-2">
                <Field>
                  <FieldLabel htmlFor="radius-x" className="sr-only">
                    Radius X
                  </FieldLabel>
                  <Input id="radius" placeholder="0" defaultValue={0} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="radius-y" className="sr-only">
                    Radius Y
                  </FieldLabel>
                  <Input id="radius" placeholder="0" defaultValue={0} />
                </Field>
              </div>
            </CollapsibleContent>
          </FieldGroup>
          <Button slot="trigger" variant="outline" size="icon">
            {isOpen ? <MinimizeIcon /> : <MaximizeIcon />}
          </Button>
        </Collapsible>
      </CardContent>
    </Card>
  )
}
