"use client"

import * as React from "react"
import { IconArrowUpRight } from "@tabler/icons-react"

import { useSearchRegistry } from "@/hooks/use-search-registry"
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

function getHomepageUrl(homepage: string) {
  const url = new URL(homepage)
  url.searchParams.set("utm_source", "ui.shadcn.com")
  url.searchParams.set("utm_medium", "referral")
  url.searchParams.set("utm_campaign", "directory")
  return url.toString()
}

export function DirectoryList() {
  const { registries } = useSearchRegistry()

  return (
    <div className="mt-6">
      <SearchDirectory />
      <ItemGroup className="my-8">
        {registries.map((registry, index) => (
          <React.Fragment key={index}>
            <Item className="group/item relative gap-6 px-0">
              <ItemMedia
                variant="image"
                dangerouslySetInnerHTML={{ __html: registry.logo }}
                className="*:[svg]:fill-foreground grayscale *:[svg]:size-8"
              />
              <ItemContent>
                <ItemTitle>
                  <a
                    href={getHomepageUrl(registry.homepage)}
                    target="_blank"
                    rel="noopener noreferrer external"
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
                    href={getHomepageUrl(registry.homepage)}
                    target="_blank"
                    rel="noopener noreferrer external"
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
            {index < globalRegistries.length - 1 && (
              <ItemSeparator className="my-1" />
            )}
          </React.Fragment>
        ))}
      </ItemGroup>
    </div>
  )
}
