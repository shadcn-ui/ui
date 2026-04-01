import { ToggleGroup, ToggleGroupItem } from '@/ui/toggle-group';

import Bold from '~icons/lucide/bold';
import Italic from '~icons/lucide/italic';
import Underline from '~icons/lucide/underline';

<template>
  <ToggleGroup @disabled={{true}} @type="multiple">
    <ToggleGroupItem @value="bold" aria-label="Toggle bold">
      <Bold class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem @value="italic" aria-label="Toggle italic">
      <Italic class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem @value="strikethrough" aria-label="Toggle strikethrough">
      <Underline class="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
