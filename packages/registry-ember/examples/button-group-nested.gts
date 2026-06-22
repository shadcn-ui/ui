import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';

import ArrowLeftIcon from '~icons/ms/arrow_left';
import ArrowRightIcon from '~icons/ms/arrow_right';

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
