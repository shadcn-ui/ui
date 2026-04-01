import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ember-ui/input-group';
import { Label } from '@/ember-ui/label';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

import Info from '~icons/lucide/info';

<template>
  <div class="grid w-full max-w-sm gap-4">
    <InputGroup>
      <InputGroupInput id="email" placeholder="shadcn" />
      <InputGroupAddon>
        <Label for="email">@</Label>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput id="email-2" placeholder="shadcn@vercel.com" />
      <InputGroupAddon @align="block-start">
        <Label @class="text-foreground" for="email-2">
          Email
        </Label>
        <Tooltip>
          <TooltipTrigger>
            <InputGroupButton
              @class="ml-auto rounded-full"
              @size="icon-xs"
              @variant="ghost"
              aria-label="Help"
            >
              <Info />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>We'll use this to send you notifications</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
