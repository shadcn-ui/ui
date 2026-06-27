<script setup lang="ts">
import { ref } from 'vue'

import ArrowLeftIcon from "@material-symbols/svg-400/rounded/arrow_left.svg?component"
import ArrowRightIcon from "@material-symbols/svg-400/rounded/arrow_right.svg?component"
import RotateCwIcon from "@material-symbols/svg-400/rounded/rotate_right.svg?component"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/ui/context-menu'

const people = ref('pedro')
const showBookmarks = ref(true)
const showFullUrls = ref(false)
</script>

<template>
  <ContextMenu>
    <ContextMenuTrigger class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
      Right click here
    </ContextMenuTrigger>
    <ContextMenuContent class="w-48" dir="rtl">
      <ContextMenuGroup>
        <ContextMenuSub>
          <ContextMenuSubTrigger>Navigation</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44">
            <ContextMenuGroup>
              <ContextMenuItem>
                <ArrowLeftIcon />
                Back
                <ContextMenuShortcut>⌘[</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem :disabled="true">
                <ArrowRightIcon />
                Forward
                <ContextMenuShortcut>⌘]</ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem>
                <RotateCwIcon />
                Reload
                <ContextMenuShortcut>⌘R</ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSub>
          <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
          <ContextMenuSubContent class="w-44">
            <ContextMenuGroup>
              <ContextMenuItem>Save Page...</ContextMenuItem>
              <ContextMenuItem>Create Shortcut...</ContextMenuItem>
              <ContextMenuItem>Name Window...</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem>Developer Tools</ContextMenuItem>
            </ContextMenuGroup>
            <ContextMenuSeparator />
            <ContextMenuGroup>
              <ContextMenuItem variant="destructive">Delete</ContextMenuItem>
            </ContextMenuGroup>
          </ContextMenuSubContent>
        </ContextMenuSub>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuCheckboxItem v-model="showBookmarks">
          Show Bookmarks
        </ContextMenuCheckboxItem>
        <ContextMenuCheckboxItem v-model="showFullUrls">
          Show Full URLs
        </ContextMenuCheckboxItem>
      </ContextMenuGroup>
      <ContextMenuSeparator />
      <ContextMenuGroup>
        <ContextMenuRadioGroup v-model="people">
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioItem value="pedro">Pedro Duarte</ContextMenuRadioItem>
          <ContextMenuRadioItem value="colm">Colm Tuite</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuGroup>
    </ContextMenuContent>
  </ContextMenu>
</template>
