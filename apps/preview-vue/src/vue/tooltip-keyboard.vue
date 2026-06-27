<script setup lang="ts">
import SaveIcon from "@material-symbols/svg-400/rounded/save.svg?component"
import { Button } from '@/ui/button'
import { Kbd } from '@/ui/kbd'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/ui/tooltip'
</script>

<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger as-child>
        <Button variant="outline" size="icon-sm">
          <SaveIcon />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Save Changes <Kbd>S</Kbd>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>
