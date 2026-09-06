"use client"

import { Button } from "@/registry/bases/aria/ui/button"
import { Card, CardContent } from "@/registry/bases/aria/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/registry/bases/aria/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/aria/ui/input-group"
import { Kbd } from "@/registry/bases/aria/ui/kbd"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export function NotFound() {
  return (
    <Card>
      <CardContent>
        <Empty className="h-72">
          <EmptyHeader>
            <EmptyTitle>404 - Not Found</EmptyTitle>
            <EmptyDescription>
              The page you&apos;re looking for doesn&apos;t exist. Try searching
              for what you need below.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <InputGroup className="w-3/4">
              <InputGroupInput placeholder="Try searching for pages..." />
              <InputGroupAddon>
                <IconPlaceholder
                  lucide="SearchIcon"
                  tabler="IconSearch"
                  hugeicons="Search01Icon"
                  phosphor="MagnifyingGlassIcon"
                  remixicon="RiSearchLine"
                />
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Kbd>/</Kbd>
              </InputGroupAddon>
            </InputGroup>
            <Button variant="link">Go to homepage</Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
