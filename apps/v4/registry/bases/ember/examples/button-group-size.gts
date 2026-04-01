import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';

import PlusIcon from '~icons/lucide/plus';

<template>
  <div class="flex flex-col items-start gap-8">
    <ButtonGroup>
      <Button @size="sm" @variant="outline">
        Small
      </Button>
      <Button @size="sm" @variant="outline">
        Button
      </Button>
      <Button @size="sm" @variant="outline">
        Group
      </Button>
      <Button @size="icon-sm" @variant="outline">
        <PlusIcon />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button @variant="outline">Default</Button>
      <Button @variant="outline">Button</Button>
      <Button @variant="outline">Group</Button>
      <Button @size="icon" @variant="outline">
        <PlusIcon />
      </Button>
    </ButtonGroup>
    <ButtonGroup>
      <Button @size="lg" @variant="outline">
        Large
      </Button>
      <Button @size="lg" @variant="outline">
        Button
      </Button>
      <Button @size="lg" @variant="outline">
        Group
      </Button>
      <Button @size="icon-lg" @variant="outline">
        <PlusIcon />
      </Button>
    </ButtonGroup>
  </div>
</template>
