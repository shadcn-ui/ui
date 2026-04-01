import { modifier } from 'ember-modifier';

import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';
import { Separator } from '@/ember-ui/separator';
import { Textarea } from '@/ember-ui/textarea';

import BotIcon from '~icons/lucide/bot';
import ChevronDownIcon from '~icons/lucide/chevron-down';

const autofocus = modifier((element: HTMLElement) => {
  element.focus();
});

<template>
  <ButtonGroup>
    <Button @size="sm" @variant="outline">
      <BotIcon />
      Copilot
    </Button>
    <Popover>
      <PopoverTrigger @asChild={{true}} as |trigger|>
        <Button
          @size="icon-sm"
          @variant="outline"
          aria-label="Open Popover"
          {{trigger.modifiers}}
        >
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent @align="end" @class="rounded-xl p-0 text-sm">
        <div class="px-4 py-3">
          <div class="text-sm font-medium">Agent Tasks</div>
        </div>
        <Separator />
        <div class="p-4 text-sm *:[p:not(:last-child)]:mb-2">
          <Textarea
            class="mb-4 resize-none"
            placeholder="Describe your task in natural language."
            {{autofocus}}
          />
          <p class="font-medium">Start a new task with Copilot</p>
          <p class="text-muted-foreground">
            Describe your task in natural language. Copilot will work in the
            background and open a pull request for your review.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  </ButtonGroup>
</template>
