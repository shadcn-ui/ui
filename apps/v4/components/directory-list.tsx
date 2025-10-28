import * as React from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import registries from "@/registry/directory.json"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
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
          <Item className="gap-6" asChild>
            <a
              href={registry.homepage}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Visit ${registry.name}`}
            >
              <ItemMedia
                variant="image"
                dangerouslySetInnerHTML={{ __html: registry.logo }}
                className="*:[svg]:fill-foreground grayscale *:[svg]:size-8"
              />
              <ItemContent>
                <ItemTitle>{registry.name}</ItemTitle>
                {registry.description && (
                  <ItemDescription>{registry.description}</ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="self-start">
                <IconArrowUpRight className="size-4" />
              </ItemActions>
            </a>
          </Item>
          {index < registries.length - 1 && <ItemSeparator className="my-1" />}
        </React.Fragment>
      ))}
    </ItemGroup>
  )
}
