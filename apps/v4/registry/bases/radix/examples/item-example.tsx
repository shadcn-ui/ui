import Image from "next/image"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/radix/components/example"
import { Button } from "@/registry/bases/radix/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemFooter,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/registry/bases/radix/ui/item"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function ItemExample() {
  return (
    <ExampleWrapper>
      <DefaultVariantItems />
      <OutlineVariantItems />
      <MutedVariantItems />
      <DefaultVariantItemsSmall />
      <OutlineVariantItemsSmall />
      <MutedVariantItemsSmall />
      <DefaultVariantItemsExtraSmall />
      <OutlineVariantItemsExtraSmall />
      <MutedVariantItemsExtraSmall />
      <DefaultLinkItems />
      <OutlineLinkItems />
      <MutedLinkItems />
      <DefaultItemGroup />
      <OutlineItemGroup />
      <MutedItemGroup />
      <ItemSeparatorExample />
      <ItemHeaderExamples />
      <ItemFooterExamples />
      <ItemHeaderAndFooterExamples />
      <DefaultVariantItemsWithImage />
      <OutlineVariantItemsWithImage />
      <OutlineVariantItemsWithImageSmall />
      <OutlineVariantItemsWithImageExtraSmall />
      <MutedVariantItemsWithImage />
    </ExampleWrapper>
  )
}

function DefaultVariantItems() {
  return (
    <Example title="Default">
      <Item>
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItems() {
  return (
    <Example title="Outline">
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItems() {
  return (
    <Example title="Muted">
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsSmall() {
  return (
    <Example title="Small">
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsSmall() {
  return (
    <Example title="Outline - Small">
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsSmall() {
  return (
    <Example title="Muted - Small">
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
          <ItemDescription>
            This is a description that provides additional context.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
          <ItemDescription>
            This item includes a title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
          <ItemDescription>
            This item includes media, title, and description.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted" size="sm">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
          <ItemDescription>
            Complete item with all components: media, title, description, and
            button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="sm">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
          <ItemDescription>
            Item with multiple action buttons in the actions area.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsExtraSmall() {
  return (
    <Example title="Extra Small">
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsExtraSmall() {
  return (
    <Example title="Outline - Extra Small">
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsExtraSmall() {
  return (
    <Example title="Muted - Extra Small">
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title Only</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Action
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="muted" size="xs">
        <ItemMedia variant="icon">
          <IconPlaceholder
            lucide="InboxIcon"
            tabler="IconArchive"
            hugeicons="Archive02Icon"
            phosphor="ArchiveIcon"
            remixicon="RiArchiveLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Media + Title + Description + Button</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Action</Button>
        </ItemActions>
      </Item>
      <Item variant="muted" size="xs">
        <ItemContent>
          <ItemTitle>Multiple Actions</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            Cancel
          </Button>
          <Button size="sm">Confirm</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function DefaultLinkItems() {
  return (
    <Example title="asChild">
      <ItemGroup>
        <Item asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title Only (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Clickable item with title and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Complete link item with media, title, and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>With Actions (Link)</ItemTitle>
              <ItemDescription>
                Link item that also has action buttons.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Share
              </Button>
            </ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function OutlineLinkItems() {
  return (
    <Example title="Outline - asChild">
      <ItemGroup>
        <Item variant="outline" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title Only (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item variant="outline" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Clickable item with title and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item variant="outline" asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item variant="outline" asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Complete link item with media, title, and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item variant="outline" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>With Actions (Link)</ItemTitle>
              <ItemDescription>
                Link item that also has action buttons.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Share
              </Button>
            </ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function MutedLinkItems() {
  return (
    <Example title="Muted - asChild">
      <ItemGroup>
        <Item variant="muted" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title Only (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item variant="muted" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Clickable item with title and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item variant="muted" asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title (Link)</ItemTitle>
            </ItemContent>
          </a>
        </Item>
        <Item variant="muted" asChild>
          <a href="#">
            <ItemMedia variant="icon">
              <IconPlaceholder
                lucide="InboxIcon"
                tabler="IconArchive"
                hugeicons="Archive02Icon"
                phosphor="TrayIcon"
                remixicon="RiInboxLine"
              />
            </ItemMedia>
            <ItemContent>
              <ItemTitle>Media + Title + Description (Link)</ItemTitle>
              <ItemDescription>
                Complete link item with media, title, and description.
              </ItemDescription>
            </ItemContent>
          </a>
        </Item>
        <Item variant="muted" asChild>
          <a href="#">
            <ItemContent>
              <ItemTitle>With Actions (Link)</ItemTitle>
              <ItemDescription>
                Link item that also has action buttons.
              </ItemDescription>
            </ItemContent>
            <ItemActions>
              <Button variant="outline" size="sm">
                Share
              </Button>
            </ItemActions>
          </a>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function DefaultItemGroup() {
  return (
    <Example title="ItemGroup">
      <ItemGroup>
        <Item>
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item in the group.</ItemDescription>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item in the group.</ItemDescription>
          </ItemContent>
        </Item>
        <Item>
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item in the group.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function OutlineItemGroup() {
  return (
    <Example title="Outline - ItemGroup">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item with icon.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item with icon.</ItemDescription>
          </ItemContent>
        </Item>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item with icon.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function MutedItemGroup() {
  return (
    <Example title="Muted - ItemGroup">
      <ItemGroup>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 1</ItemTitle>
            <ItemDescription>First item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 2</ItemTitle>
            <ItemDescription>Second item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
        <Item variant="muted">
          <ItemContent>
            <ItemTitle>Item 3</ItemTitle>
            <ItemDescription>Third item in muted group.</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button variant="outline" size="sm">
              Action
            </Button>
          </ItemActions>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function ItemSeparatorExample() {
  return (
    <Example title="ItemSeparator">
      <ItemGroup>
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Inbox</ItemTitle>
            <ItemDescription>View all incoming messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Sent</ItemTitle>
            <ItemDescription>View all sent messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Drafts</ItemTitle>
            <ItemDescription>View all draft messages.</ItemDescription>
          </ItemContent>
        </Item>
        <ItemSeparator />
        <Item variant="outline">
          <ItemMedia variant="icon">
            <IconPlaceholder
              lucide="InboxIcon"
              tabler="IconArchive"
              hugeicons="Archive02Icon"
              phosphor="TrayIcon"
              remixicon="RiInboxLine"
            />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Archive</ItemTitle>
            <ItemDescription>View archived messages.</ItemDescription>
          </ItemContent>
        </Item>
      </ItemGroup>
    </Example>
  )
}

function ItemHeaderExamples() {
  return (
    <Example title="ItemHeader">
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Design System</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Component Library</ItemTitle>
          <ItemDescription>
            A comprehensive collection of reusable UI components for building
            consistent interfaces.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Marketing</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Campaign Analytics</ItemTitle>
          <ItemDescription>
            Track performance metrics and engagement rates across all marketing
            channels.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Engineering</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Documentation</ItemTitle>
          <ItemDescription>
            Complete reference guide for all available endpoints and
            authentication methods.
          </ItemDescription>
        </ItemContent>
      </Item>
    </Example>
  )
}

function ItemFooterExamples() {
  return (
    <Example title="ItemFooter">
      <Item>
        <ItemContent>
          <ItemTitle>Quarterly Report Q4 2024</ItemTitle>
          <ItemDescription>
            Financial overview including revenue, expenses, and growth metrics
            for the fourth quarter.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Last updated 2 hours ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemContent>
          <ItemTitle>User Research Findings</ItemTitle>
          <ItemDescription>
            Insights from interviews and surveys conducted with 50+ users across
            different demographics.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Created by Sarah Chen
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemContent>
          <ItemTitle>Product Roadmap</ItemTitle>
          <ItemDescription>
            Planned features and improvements scheduled for the next three
            months.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">12 comments</span>
        </ItemFooter>
      </Item>
    </Example>
  )
}

function ItemHeaderAndFooterExamples() {
  return (
    <Example title="ItemHeader + ItemFooter">
      <Item>
        <ItemHeader>
          <span className="text-sm font-medium">Team Project</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Website Redesign</ItemTitle>
          <ItemDescription>
            Complete overhaul of the company website with modern design
            principles and improved user experience.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Updated 5 minutes ago
          </span>
        </ItemFooter>
      </Item>
      <Item variant="outline">
        <ItemHeader>
          <span className="text-sm font-medium">Client Work</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>Mobile App Development</ItemTitle>
          <ItemDescription>
            Building a cross-platform mobile application for iOS and Android
            with React Native.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Status: In Progress
          </span>
        </ItemFooter>
      </Item>
      <Item variant="muted">
        <ItemHeader>
          <span className="text-sm font-medium">Documentation</span>
        </ItemHeader>
        <ItemContent>
          <ItemTitle>API Integration Guide</ItemTitle>
          <ItemDescription>
            Step-by-step instructions for integrating third-party APIs with
            authentication and error handling.
          </ItemDescription>
        </ItemContent>
        <ItemFooter>
          <span className="text-muted-foreground text-sm">
            Category: Technical • 3 attachments
          </span>
        </ItemFooter>
      </Item>
    </Example>
  )
}

function DefaultVariantItemsWithImage() {
  return (
    <Example title="Default - ItemMedia image">
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item>
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImage() {
  return (
    <Example title="Outline - ItemMedia image">
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImageSmall() {
  return (
    <Example title="Outline - ItemMedia image - Small">
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="sm">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function OutlineVariantItemsWithImageExtraSmall() {
  return (
    <Example title="Outline - ItemMedia image - Extra Small">
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
        </ItemContent>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="outline" size="xs">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}

function MutedVariantItemsWithImage() {
  return (
    <Example title="Muted - ItemMedia image">
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Project"
            alt="Project"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Project Dashboard</ItemTitle>
          <ItemDescription>
            Overview of project settings and configuration.
          </ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/Document"
            alt="Document"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document</ItemTitle>
          <ItemDescription>A document with metadata displayed.</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="outline" size="sm">
            View
          </Button>
        </ItemActions>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="image">
          <Image
            src="https://avatar.vercel.sh/File"
            alt="File"
            width={40}
            height={40}
            className="object-cover grayscale"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>File Attachment</ItemTitle>
          <ItemDescription>
            Complete file with image, title, description, and action button.
          </ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button size="sm">Download</Button>
        </ItemActions>
      </Item>
    </Example>
  )
}
