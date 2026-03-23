import * as React from "react"

import { Card, CardContent } from "@/registry/bases/radix/ui/card"
import {
  Item,
  ItemActions,
  ItemGroup,
  ItemHeader,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { Kbd } from "@/registry/bases/radix/ui/kbd"

const shortcuts = [
  { label: "Search", keys: ["⌘", "K"] },
  { label: "Quick Actions", keys: ["⌘", "J"] },
  { label: "New File", keys: ["⌘", "N"] },
  { label: "Save", keys: ["⌘", "S"] },
  { label: "Toggle Sidebar", keys: ["⌘", "B"] },
] as const

export function Shortcuts() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-col gap-3">
          <div className="text-sm font-medium">Shortcuts</div>
          <ItemGroup className="gap-2 text-muted-foreground" data-size="xs">
            {shortcuts.map(({ label, keys }, i) => (
              <React.Fragment key={label}>
                {i > 0 && <ItemSeparator />}
                <Item
                  variant="default"
                  size="xs"
                  className="border-0 px-0 py-0"
                >
                  <ItemHeader>
                    <ItemTitle className="font-normal">{label}</ItemTitle>
                    <ItemActions>
                      <div className="flex gap-1">
                        {keys.map((key) => (
                          <Kbd key={key}>{key}</Kbd>
                        ))}
                      </div>
                    </ItemActions>
                  </ItemHeader>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </div>
      </CardContent>
    </Card>
  )
}
