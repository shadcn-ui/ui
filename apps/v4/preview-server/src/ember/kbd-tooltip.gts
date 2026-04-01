import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import { Kbd, KbdGroup } from '@/ember-ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

<template>
  <div class="flex flex-wrap gap-4">
    <ButtonGroup>
      <Tooltip>
        <TooltipTrigger>
          <Button @size="sm" @variant="outline">
            Save
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div class="flex items-center gap-2">
            Save Changes
            <Kbd>S</Kbd>
          </div>
        </TooltipContent>
      </Tooltip>
      <Tooltip>
        <TooltipTrigger>
          <Button @size="sm" @variant="outline">
            Print
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <div class="flex items-center gap-2">
            Print Document
            <KbdGroup>
              <Kbd>Ctrl</Kbd>
              <Kbd>P</Kbd>
            </KbdGroup>
          </div>
        </TooltipContent>
      </Tooltip>
    </ButtonGroup>
  </div>
</template>
