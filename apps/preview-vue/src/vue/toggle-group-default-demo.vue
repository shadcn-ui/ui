<script setup lang="ts">
import Bold from "@material-symbols/svg-400/rounded/format_bold.svg?component"
import Italic from "@material-symbols/svg-400/rounded/format_italic.svg?component"
import Underline from "@material-symbols/svg-400/rounded/format_underlined.svg?component"

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/ui/toggle-group'
</script>

<template>
  <ToggleGroup type="multiple">
    <ToggleGroupItem value="bold" aria-label="Toggle bold">
      <Bold class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="italic" aria-label="Toggle italic">
      <Italic class="h-4 w-4" />
    </ToggleGroupItem>
    <ToggleGroupItem value="strikethrough" aria-label="Toggle strikethrough">
      <Underline class="h-4 w-4" />
    </ToggleGroupItem>
  </ToggleGroup>
</template>
