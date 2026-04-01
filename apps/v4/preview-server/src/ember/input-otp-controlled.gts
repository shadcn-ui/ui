import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ember-ui/input-otp';

export default class InputOtpControlled extends Component {
  @tracked value = '';

  handleValueChange = (value: string) => {
    this.value = value;
  };

  <template>
    <div class="space-y-2">
      <InputOTP
        @maxLength={{6}}
        @onValueChange={{this.handleValueChange}}
        @value={{this.value}}
      >
        <InputOTPGroup>
          <InputOTPSlot @index={{0}} />
          <InputOTPSlot @index={{1}} />
          <InputOTPSlot @index={{2}} />
          <InputOTPSlot @index={{3}} />
          <InputOTPSlot @index={{4}} />
          <InputOTPSlot @index={{5}} />
        </InputOTPGroup>
      </InputOTP>
      <div class="text-center text-sm">
        {{#if this.value}}
          You entered:
          {{this.value}}
        {{else}}
          Enter your one-time password.
        {{/if}}
      </div>
    </div>
  </template>
}
