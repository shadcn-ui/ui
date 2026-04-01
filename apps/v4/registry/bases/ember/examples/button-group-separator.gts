import { Button } from '@/ui/button';
import {
  ButtonGroup,
  ButtonGroupSeparator,
} from '@/ui/button-group';

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
