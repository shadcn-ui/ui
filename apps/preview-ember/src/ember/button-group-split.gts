import { Button } from '@/ember-ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/ember-ui/button-group';

import PlusIcon from '~icons/material-symbols/add-rounded';

<template>
  <ButtonGroup>
    <Button @variant="secondary">Button</Button>
    <ButtonGroupSeparator />
    <Button @size="icon" @variant="secondary">
      <PlusIcon />
    </Button>
  </ButtonGroup>
</template>
