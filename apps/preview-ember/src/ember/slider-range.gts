import { array } from '@ember/helper';

import { Slider } from '@/ember-ui/slider';

<template>
  <Slider
    @defaultValue={{array 25 50}}
    @max={{100}}
    @step={{5}}
    @class="mx-auto w-full max-w-xs"
  />
</template>
