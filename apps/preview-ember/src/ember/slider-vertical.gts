import { array } from '@ember/helper';

import { Slider } from '@/ember-ui/slider';

<template>
  <div class="mx-auto flex w-full max-w-xs items-center justify-center gap-6">
    <Slider
      @defaultValue={{array 50}}
      @max={{100}}
      @step={{1}}
      @orientation="vertical"
      @class="h-40"
    />
    <Slider
      @defaultValue={{array 25}}
      @max={{100}}
      @step={{1}}
      @orientation="vertical"
      @class="h-40"
    />
  </div>
</template>
