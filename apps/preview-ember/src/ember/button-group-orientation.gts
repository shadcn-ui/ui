import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';

import MinusIcon from '~icons/material-symbols/remove-rounded';
import PlusIcon from '~icons/material-symbols/add-rounded';

<template>
  <ButtonGroup
    @orientation="vertical"
    aria-label="Media controls"
    class="h-fit"
  >
    <Button @size="icon" @variant="outline">
      <PlusIcon />
    </Button>
    <Button @size="icon" @variant="outline">
      <MinusIcon />
    </Button>
  </ButtonGroup>
</template>
