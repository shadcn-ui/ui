import { Button } from '@/ember-ui/button';

import GitBranch from '~icons/lucide/git-branch';

<template>
  <Button @size="sm" @variant="outline">
    <GitBranch />
    New Branch
  </Button>
</template>
