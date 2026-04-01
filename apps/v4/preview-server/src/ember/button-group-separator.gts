import { Button } from '@/ember-ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/ember-ui/button-group';

<template>
  <ButtonGroup>
    <Button @size="sm" @variant="secondary">
      Copy
    </Button>
    <ButtonGroupSeparator />
    <Button @size="sm" @variant="secondary">
      Paste
    </Button>
  </ButtonGroup>
</template>
