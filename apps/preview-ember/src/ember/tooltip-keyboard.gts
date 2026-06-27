import { Button } from '@/ember-ui/button';
import { Kbd } from '@/ember-ui/kbd';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';
import SaveIcon from '~icons/ms/save';

<template>
  <Tooltip>
    <TooltipTrigger>
      <Button @variant="outline" @size="icon-sm">
        <SaveIcon />
      </Button>
    </TooltipTrigger>
    <TooltipContent>
      Save Changes <Kbd>S</Kbd>
    </TooltipContent>
  </Tooltip>
</template>
