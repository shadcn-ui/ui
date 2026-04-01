import { array } from '@ember/helper';

import { Slider } from '@/ember-ui/slider';

<template>
  <Slider
    @class="w-[60%]"
    @defaultValue={{array 50}}
    @max={{100}}
    @step={{1}}
  />
</template>
