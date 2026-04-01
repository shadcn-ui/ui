import { Badge } from '@/ui/badge';

import BadgeCheck from '~icons/lucide/badge-check';

<template>
  <div class="flex flex-col items-center gap-2">
    <div class="flex w-full flex-wrap gap-2">
      <Badge>Badge</Badge>
      <Badge @variant="secondary">Secondary</Badge>
      <Badge @variant="destructive">Destructive</Badge>
      <Badge @variant="outline">Outline</Badge>
    </div>
    <div class="flex w-full flex-wrap gap-2">
      <Badge
        @class="bg-blue-500 text-white dark:bg-blue-600"
        @variant="secondary"
      >
        <BadgeCheck />
        Verified
      </Badge>
      <Badge @class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums">
        8
      </Badge>
      <Badge
        @class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
        @variant="destructive"
      >
        99
      </Badge>
      <Badge
        @class="h-5 min-w-5 rounded-full px-1 font-mono tabular-nums"
        @variant="outline"
      >
        20+
      </Badge>
    </div>
  </div>
</template>
