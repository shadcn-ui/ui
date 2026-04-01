import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Button } from '@/ui/button';

import type ToastService from '@/services/toast';

export default class SonnerDescription extends Component {
  @service declare toast: ToastService;

  showToast = () => {
    this.toast.add({
      message: 'Event has been created',
      description: 'Monday, January 3rd at 6:00pm',
    });
  };

  <template>
    <Button @variant="outline" class="w-fit" {{on "click" this.showToast}}>
      Show Toast
    </Button>
  </template>
}
