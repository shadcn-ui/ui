import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from '@/ember-ui/input-group';
import { Separator } from '@/ember-ui/separator';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

import ArrowUp from '~icons/lucide/arrow-up';
import Check from '~icons/lucide/check';
import InfoCircle from '~icons/lucide/info';
import Plus from '~icons/lucide/plus';
import Search from '~icons/lucide/search';

<template>
  <div class="grid w-full max-w-sm gap-6">
    <InputGroup>
      <InputGroupInput placeholder="Search..." />
      <InputGroupAddon>
        <Search />
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">12 results</InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput @class="!pl-1" placeholder="example.com" />
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupAddon @align="inline-end">
        <Tooltip>
          <TooltipTrigger>
            <InputGroupButton
              @class="rounded-full"
              @size="icon-xs"
              @variant="ghost"
              aria-label="Info"
            >
              <InfoCircle />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>This is content in a tooltip.</TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupTextarea placeholder="Ask, Search or Chat..." />
      <InputGroupAddon @align="block-end">
        <InputGroupButton
          @class="rounded-full"
          @size="icon-xs"
          @variant="outline"
          aria-label="Add"
        >
          <Plus />
        </InputGroupButton>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <InputGroupButton @variant="ghost">Auto</InputGroupButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            {{! @side="top" }}
            @align="start"
            @class="[--radius:0.95rem]"
          >
            <DropdownMenuItem>Auto</DropdownMenuItem>
            <DropdownMenuItem>Agent</DropdownMenuItem>
            <DropdownMenuItem>Manual</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <InputGroupText @class="ml-auto">52% used</InputGroupText>
        <Separator @class="!h-4" @orientation="vertical" />
        <InputGroupButton
          @class="rounded-full"
          @size="icon-xs"
          @variant="default"
        >
          <ArrowUp />
          <span class="sr-only">Send</span>
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput placeholder="shadcn" />
      <InputGroupAddon @align="inline-end">
        <div
          class="bg-primary text-foreground flex size-4 items-center justify-center rounded-full"
        >
          <Check class="size-3 text-white" />
        </div>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
