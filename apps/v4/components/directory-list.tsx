import * as React from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import { DirectoryAddButton } from "@/components/directory-add-button"
import registries from "@/registry/directory.json"
import { Button } from "@/registry/new-york-v4/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/new-york-v4/ui/item"

export function DirectoryList() {
  return (
    <ItemGroup className="my-8">
      {registries.map((registry, index) => (
        <React.Fragment key={index}>
          <Item className="group/item sm:hover:bg-accent/50 relative gap-6 px-0 sm:px-4">
            <ItemMedia
              variant="image"
              dangerouslySetInnerHTML={{ __html: registry.logo }}
              className="*:[svg]:fill-foreground grayscale *:[svg]:size-8"
            />
            <ItemContent>
              <ItemTitle>{registry.name}</ItemTitle>
              {registry.description && (
                <ItemDescription className="text-pretty">
                  {registry.description}
                </ItemDescription>
              )}
            </ItemContent>
            <ItemActions className="hidden self-start sm:flex">
              <Button size="sm" variant="outline">
                View <IconArrowUpRight />
              </Button>
              <DirectoryAddButton registry={registry} />
            </ItemActions>
            <ItemFooter className="justify-start pl-16 sm:hidden">
              <Button size="sm" variant="outline">
                View <IconArrowUpRight />
              </Button>
              <DirectoryAddButton registry={registry} />
            </ItemFooter>
            <a
              href={registry.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${registry.name}`}
              className="absolute inset-0"
            >
              <span className="sr-only">Visit {registry.name}</span>
            </a>
          </Item>
          {index < registries.length - 1 && <ItemSeparator className="my-1" />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}
