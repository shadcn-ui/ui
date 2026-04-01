import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Progress } from '@/ui/progress';

import type Owner from '@ember/owner';

export default class ProgressDemo extends Component {
  @tracked progress = 13;

  constructor(owner: Owner, args: object) {
    super(owner, args);

    setTimeout(() => {
      this.progress = 66;
    }, 500);
  }

  <template><Progress @class="w-[60%]" @value={{this.progress}} /></template>
}
