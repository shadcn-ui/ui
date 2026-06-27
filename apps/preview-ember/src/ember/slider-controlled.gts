import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Label } from '@/ember-ui/label';
import { Slider } from '@/ember-ui/slider';

export default class SliderControlled extends Component {
  @tracked value = 30;

  handleValueChange = (value: number) => {
    this.value = value;
  };

  <template>
    <div class="mx-auto grid w-full max-w-xs gap-3">
      <div class="flex items-center justify-between gap-2">
        <Label @for="slider-controlled-temperature">Temperature</Label>
        <span class="text-sm text-muted-foreground">{{this.value}}</span>
      </div>
      <Slider
        @id="slider-controlled-temperature"
        @value={{this.value}}
        @min={{0}}
        @max={{100}}
        @step={{1}}
        @onValueChange={{this.handleValueChange}}
      />
    </div>
  </template>
}
