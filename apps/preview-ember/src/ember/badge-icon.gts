import { Badge } from '@/ember-ui/badge';
import BadgeCheckIcon from '~icons/ms/verified';
import BookmarkIcon from '~icons/ms/bookmark';

<template>
  <div class="flex flex-wrap gap-2">
    <Badge @variant="secondary">
      <BadgeCheckIcon data-icon="inline-start" />
      Verified
    </Badge>
    <Badge @variant="outline">
      Bookmark
      <BookmarkIcon data-icon="inline-end" />
    </Badge>
  </div>
</template>
