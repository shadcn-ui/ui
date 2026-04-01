import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Button } from '@/ui/button';

import type ToastService from '@/services/toast';

export default class SonnerDemo extends Component {
  @service declare toast: ToastService;

  showToast = () => {
    this.toast.add({
      message: 'Event has been created',
      description: 'Sunday, December 03, 2023 at 9:00 AM',
      action: {
        label: 'Undo',
        onClick: () => console.log('Undo'),
      },
    });
  };

  <template>
    <Button @variant="outline" {{on "click" this.showToast}}>
      Show Toast
    </Button>
  </template>
}
