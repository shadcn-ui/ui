import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ui/input-group';

import ChevronDown from '~icons/lucide/chevron-down';
import MoreHorizontal from '~icons/lucide/more-horizontal';

<template>
  <div class="grid w-full max-w-sm gap-4">
    <InputGroup>
      <InputGroupInput placeholder="Enter file name" />
      <InputGroupAddon @align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <InputGroupButton
              @size="icon-xs"
              @variant="ghost"
              aria-label="More"
            >
              <MoreHorizontal />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent @align="end">
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Copy path</DropdownMenuItem>
            <DropdownMenuItem>Open location</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup @class="[--radius:1rem]">
      <InputGroupInput placeholder="Enter search query" />
      <InputGroupAddon @align="inline-end">
        <DropdownMenu>
          <DropdownMenuTrigger>
            <InputGroupButton @class="!pr-1.5 text-xs" @variant="ghost">
              Search In...
              <ChevronDown class="size-3" />
            </InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent @align="end" @class="[--radius:0.95rem]">
            <DropdownMenuItem>Documentation</DropdownMenuItem>
            <DropdownMenuItem>Blog Posts</DropdownMenuItem>
            <DropdownMenuItem>Changelog</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
