<script setup lang="ts">
import BracesIcon from "@material-symbols/svg-400/rounded/code.svg?component"
import CopyIcon from "@material-symbols/svg-400/rounded/content_copy.svg?component"
import CornerDownLeftIcon from "@material-symbols/svg-400/rounded/subdirectory_arrow_left.svg?component"
import RefreshCwIcon from "@material-symbols/svg-400/rounded/refresh.svg?component"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupText, InputGroupTextarea } from '@/ui/input-group'
</script>

<template>
  <div class="grid w-full max-w-md gap-4">
    <InputGroup>
      <InputGroupTextarea
        id="textarea-code-32"
        placeholder="console.log('Hello, world!');"
        class="min-h-[200px]"
      />
      <InputGroupAddon align="block-end" class="border-t">
        <InputGroupText>Line 1, Column 1</InputGroupText>
        <InputGroupButton size="sm" class="ml-auto" variant="default">
          Run <CornerDownLeftIcon />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupAddon align="block-start" class="border-b">
        <InputGroupText class="font-mono font-medium">
          <BracesIcon />
          script.js
        </InputGroupText>
        <InputGroupButton class="ml-auto" size="icon-xs">
          <RefreshCwIcon />
        </InputGroupButton>
        <InputGroupButton variant="ghost" size="icon-xs">
          <CopyIcon />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  </div>
</template>
