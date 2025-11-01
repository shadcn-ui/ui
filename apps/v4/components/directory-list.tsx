"use client"

import * as React from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import { DirectoryAddButton } from "@/components/directory-add-button"
import globalRegistries from "@/registry/directory.json"
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

import { SearchDirectory } from "./search-directory"

export function DirectoryList() {
  const [registries, setRegistries] =
    React.useState<typeof globalRegistries>(globalRegistries)

  return (
    <div className="mt-6">
      <SearchDirectory setRegistries={setRegistries} />
      <ItemGroup className="my-8">
        {registries.map((registry, index) => (
          <React.Fragment key={index}>
            <Item className="group/item relative gap-6 px-0 sm:px-4">
              <ItemMedia
                variant="image"
                dangerouslySetInnerHTML={{ __html: registry.logo }}
                className="*:[svg]:fill-foreground grayscale *:[svg]:size-8"
              />
              <ItemContent>
                <ItemTitle>
                  <a
                    href={registry.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {registry.name}
                  </a>
                </ItemTitle>
                {registry.description && (
                  <ItemDescription className="text-pretty">
                    {registry.description}
                  </ItemDescription>
                )}
              </ItemContent>
              <ItemActions className="relative z-10 hidden self-start sm:flex">
                <Button size="sm" variant="outline" asChild>
                  <a
                    href={registry.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    View <IconArrowUpRight />
                  </a>
                </Button>
                <DirectoryAddButton registry={registry} />
              </ItemActions>
              <ItemFooter className="justify-start pl-16 sm:hidden">
                <Button size="sm" variant="outline">
                  View <IconArrowUpRight />
                </Button>
                <DirectoryAddButton registry={registry} />
              </ItemFooter>
            </Item>
            {index < registries.length - 1 && (
              <ItemSeparator className="my-1" />
            )}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  )
}
