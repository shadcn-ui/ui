import { array } from '@ember/helper';

import { Slider } from '@/ember-ui/slider';

<template>
  <Slider
    @defaultValue={{array 75}}
    @max={{100}}
    @step={{1}}
    @dir="rtl"
    @class="mx-auto w-full max-w-xs"
  />
</template>
