import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import { Input } from '@/ember-ui/input';

import SearchIcon from '~icons/lucide/search';

<template>
  <ButtonGroup>
    <Input placeholder="Search..." />
    <Button @variant="outline" aria-label="Search">
      <SearchIcon />
    </Button>
  </ButtonGroup>
</template>
