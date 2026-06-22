import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ember-ui/input-group';

import Copy from '~icons/material-symbols/content-copy-outline-rounded';
import CornerDownLeft from '~icons/material-symbols/subdirectory-arrow-left-rounded';
import FileCode from '~icons/material-symbols/code-rounded';
import Refresh from '~icons/material-symbols/refresh-rounded';

<template>
  <div class="grid w-full max-w-md gap-4">
    <InputGroup>
      <InputGroupTextarea
        @class="min-h-[200px]"
        placeholder="console.log('Hello, world!');"
      />
      <InputGroupAddon @align="block-end" @class="border-t">
        <InputGroupText>Line 1, Column 1</InputGroupText>
        <InputGroupButton @class="ml-auto" @size="sm" @variant="default">
          Run
          <CornerDownLeft />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon @align="block-start" @class="border-b">
        <InputGroupText @class="font-mono font-medium">
          <FileCode />
          script.js
        </InputGroupText>
        <InputGroupButton @class="ml-auto" @size="icon-xs">
          <Refresh />
        </InputGroupButton>
        <InputGroupButton @size="icon-xs" @variant="ghost">
          <Copy />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
