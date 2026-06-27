import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Progress } from '@/ember-ui/progress';
import { Slider } from '@/ember-ui/slider';

class ProgressControlled extends Component {
  @tracked value = [50];

  handleValueChange = (newValue: number[]) => {
    this.value = newValue;
  };

  get progressValue() {
    return this.value[0] ?? 0;
  }

  <template>
    <div class="flex w-full max-w-sm flex-col gap-4">
      <Progress @value={{this.progressValue}} />
      <Slider
        @value={{this.value}}
        @onValueChange={{this.handleValueChange}}
        @min={{0}}
        @max={{100}}
        @step={{1}}
      />
    </div>
  </template>
}

export default ProgressControlled;
