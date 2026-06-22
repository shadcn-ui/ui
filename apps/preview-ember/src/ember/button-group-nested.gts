import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';

import ArrowLeftIcon from '~icons/material-symbols/arrow-left-rounded';
import ArrowRightIcon from '~icons/material-symbols/arrow-right-rounded';

<template>
  <ButtonGroup>
    <ButtonGroup>
      <Button @size="sm" @variant="outline">
        1
      </Button>
      <Button @size="sm" @variant="outline">
        2
      </Button>
      <Button @size="sm" @variant="outline">
        3
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button @size="icon-sm" @variant="outline" aria-label="Previous">
        <ArrowLeftIcon />
      </Button>
      <Button @size="icon-sm" @variant="outline" aria-label="Next">
        <ArrowRightIcon />
      </Button>
    </ButtonGroup>
  </ButtonGroup>
</template>
