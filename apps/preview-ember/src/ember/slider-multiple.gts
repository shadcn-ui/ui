import { array } from '@ember/helper';

import { Slider } from '@/ember-ui/slider';

<template>
  <Slider
    @defaultValue={{array 10 20 70}}
    @max={{100}}
    @step={{10}}
    @class="mx-auto w-full max-w-xs"
  />
</template>
