import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/ember-ui/input-otp';

export default class InputOtpInvalid extends Component {
  @tracked value = '000000';

  handleValueChange = (value: string) => {
    this.value = value;
  };

  <template>
    <InputOTP
      @maxLength={{6}}
      @value={{this.value}}
      @onValueChange={{this.handleValueChange}}
    >
      <InputOTPGroup>
        <InputOTPSlot @index={{0}} aria-invalid="true" />
        <InputOTPSlot @index={{1}} aria-invalid="true" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot @index={{2}} aria-invalid="true" />
        <InputOTPSlot @index={{3}} aria-invalid="true" />
      </InputOTPGroup>
      <InputOTPSeparator />
      <InputOTPGroup>
        <InputOTPSlot @index={{4}} aria-invalid="true" />
        <InputOTPSlot @index={{5}} aria-invalid="true" />
      </InputOTPGroup>
    </InputOTP>
  </template>
}
