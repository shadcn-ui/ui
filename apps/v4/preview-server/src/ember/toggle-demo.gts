import { Toggle } from '@/ember-ui/toggle';

import Bookmark from '~icons/lucide/bookmark';

<template>
  <Toggle
    @class="data-[state=on]:bg-transparent [&[data-state=on]_svg_*]:fill-blue-500 [&[data-state=on]_svg_*]:stroke-blue-500"
    @size="sm"
    @variant="outline"
    aria-label="Toggle bookmark"
  >
    <Bookmark />
    Bookmark
  </Toggle>
</template>
