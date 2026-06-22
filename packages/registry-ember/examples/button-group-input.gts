import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';
import { Input } from '@/ui/input';

import SearchIcon from '~icons/ms/search';

<template>
  <ButtonGroup>
    <Input placeholder="Search..." />
    <Button @variant="outline" aria-label="Search">
      <SearchIcon />
    </Button>
  </ButtonGroup>
</template>
