import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Field, FieldDescription, FieldTitle } from '@/ember-ui/field';
import { Slider } from '@/ember-ui/slider';

class FieldSlider extends Component {
  @tracked value = [200, 800];

  handleValueChange = (newValue: number[]) => {
    this.value = newValue;
  };

  get minValue() {
    return this.value[0];
  }

  get maxValue() {
    return this.value[1] ?? this.value[0];
  }

  <template>
    <div class="w-full max-w-md">
      <Field>
        <FieldTitle>Price Range</FieldTitle>
        <FieldDescription>
          Set your budget range ($<span
            class="font-medium tabular-nums"
          >{{this.minValue}}</span>
          -
          <span class="font-medium tabular-nums">{{this.maxValue}}</span>).
        </FieldDescription>
        <Slider
          @class="mt-2 w-full"
          @max={{1000}}
          @min={{0}}
          @onValueChange={{this.handleValueChange}}
          @step={{10}}
          @value={{this.value}}
          aria-label="Price Range"
        />
      </Field>
    </div>
  </template>
}

export default FieldSlider;
