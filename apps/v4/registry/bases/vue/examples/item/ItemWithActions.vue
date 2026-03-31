<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/ui/item"
import { Example } from "@/components/example"
</script>

<template>
  <Example title="Item with Actions">
    <ItemGroup class="w-full max-w-md">
      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="FileIcon"
            tabler="IconFile"
            hugeicons="File02Icon"
            phosphor="FileIcon"
            remixicon="RiFileLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Document.pdf</ItemTitle>
          <ItemDescription>Updated 2 hours ago</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="DownloadIcon"
              tabler="IconDownload"
              hugeicons="Download01Icon"
              phosphor="DownloadSimpleIcon"
              remixicon="RiDownloadLine"
            />
          </Button>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
          </Button>
        </ItemActions>
      </Item>

      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="ImageIcon"
            tabler="IconPhoto"
            hugeicons="Image01Icon"
            phosphor="ImageIcon"
            remixicon="RiImageLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Screenshot.png</ItemTitle>
          <ItemDescription>Updated yesterday</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="EyeIcon"
              tabler="IconEye"
              hugeicons="View01Icon"
              phosphor="EyeIcon"
              remixicon="RiEyeLine"
            />
          </Button>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="Share2Icon"
              tabler="IconShare"
              hugeicons="Share01Icon"
              phosphor="ShareIcon"
              remixicon="RiShareLine"
            />
          </Button>
        </ItemActions>
      </Item>

      <Item>
        <ItemMedia>
          <IconPlaceholder
            lucide="VideoIcon"
            tabler="IconVideo"
            hugeicons="Video01Icon"
            phosphor="VideoIcon"
            remixicon="RiVideoLine"
          />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Presentation.mp4</ItemTitle>
          <ItemDescription>Updated last week</ItemDescription>
        </ItemContent>
        <ItemActions>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="PlayIcon"
              tabler="IconPlayerPlay"
              hugeicons="Play01Icon"
              phosphor="PlayIcon"
              remixicon="RiPlayLine"
            />
          </Button>
          <Button variant="ghost" size="sm">
            <IconPlaceholder
              lucide="MoreHorizontalIcon"
              tabler="IconDots"
              hugeicons="MoreHorizontalIcon"
              phosphor="DotsThreeIcon"
              remixicon="RiMoreLine"
            />
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  </Example>
</template>
