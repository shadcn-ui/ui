import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';

import MinusIcon from '~icons/ms/remove';
import PlusIcon from '~icons/ms/add';

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
