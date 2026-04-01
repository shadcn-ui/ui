import { on } from '@ember/modifier';
import { service } from '@ember/service';
import Component from '@glimmer/component';

import { Button } from '@/ember-ui/button';

import type ToastService from '@/ember-services/toast';

export default class SonnerTypes extends Component {
  @service declare toast: ToastService;

  showDefault = () => {
    this.toast.add({
      message: 'Event has been created',
    });
  };

  showSuccess = () => {
    this.toast.success('Event has been created');
  };

  showInfo = () => {
    this.toast.info('Be at the area 10 minutes before the event time');
  };

  showWarning = () => {
    this.toast.warning('Event start time cannot be earlier than 8am');
  };

  showError = () => {
    this.toast.error('Event has not been created');
  };

  showPromise = () => {
    void this.toast.promise<{ name: string }>(
      () =>
        new Promise((resolve) =>
          setTimeout(() => resolve({ name: 'Event' }), 2000)
        ),
      {
        loading: 'Loading...',
        success: (data) => `${data.name} has been created`,
        error: 'Error',
      }
    );
  };

  <template>
    <div class="flex flex-wrap gap-2">
      <Button @variant="outline" {{on "click" this.showDefault}}>
        Default
      </Button>
      <Button @variant="outline" {{on "click" this.showSuccess}}>
        Success
      </Button>
      <Button @variant="outline" {{on "click" this.showInfo}}>
        Info
      </Button>
      <Button @variant="outline" {{on "click" this.showWarning}}>
        Warning
      </Button>
      <Button @variant="outline" {{on "click" this.showError}}>
        Error
      </Button>
      <Button @variant="outline" {{on "click" this.showPromise}}>
        Promise
      </Button>
    </div>
  </template>
}
