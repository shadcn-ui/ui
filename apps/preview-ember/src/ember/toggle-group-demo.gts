import { ToggleGroup, ToggleGroupItem } from '@/ember-ui/toggle-group';

import Bold from '~icons/ms/format_bold';
import Italic from '~icons/ms/format_italic';
import Underline from '~icons/ms/format_underlined';

<template>
  <ToggleGroup @variant="outline" @type="multiple">
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
