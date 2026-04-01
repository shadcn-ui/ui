import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ui/input-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ui/tooltip';

import HelpCircle from '~icons/lucide/help-circle';
import Info from '~icons/lucide/info';

<template>
  <div class="grid w-full max-w-sm gap-4">
    <InputGroup>
      <InputGroupInput placeholder="Enter password" type="password" />
      <InputGroupAddon @align="inline-end">
        <Tooltip>
          <TooltipTrigger>
            <InputGroupButton
              @size="icon-xs"
              @variant="ghost"
              aria-label="Info"
            >
              <Info />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>Password must be at least 8 characters</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <InputGroupInput placeholder="Your email address" />
      <InputGroupAddon @align="inline-end">
        <Tooltip>
          <TooltipTrigger>
            <InputGroupButton
              @size="icon-xs"
              @variant="ghost"
              aria-label="Help"
            >
              <HelpCircle />
            </InputGroupButton>
          </TooltipTrigger>
          <TooltipContent>
            <p>We'll use this to send you notifications</p>
          </TooltipContent>
        </Tooltip>
      </InputGroupAddon>
    </InputGroup>

    <InputGroup>
      <Tooltip>
        <TooltipTrigger>
          <InputGroupAddon>
            <InputGroupButton
              @size="icon-xs"
              @variant="ghost"
              aria-label="Help"
            >
              <HelpCircle />
            </InputGroupButton>
          </InputGroupAddon>
        </TooltipTrigger>
        <TooltipContent @side="left">
          <p>Click for help with API keys</p>
        </TooltipContent>
      </Tooltip>
      <InputGroupInput placeholder="Enter API key" />
    </InputGroup>
  </div>
</template>
