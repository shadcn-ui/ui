import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupText,
  InputGroupTextarea,
} from '@/ui/input-group';

import Copy from '~icons/ms/content_copy';
import CornerDownLeft from '~icons/ms/subdirectory_arrow_left';
import FileCode from '~icons/ms/code';
import Refresh from '~icons/ms/refresh';

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
