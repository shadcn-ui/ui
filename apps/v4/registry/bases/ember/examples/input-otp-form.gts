import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/ui/field';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from '@/ui/input-otp';

export default class InputOtpFormDemo extends Component {
  @tracked pin = '';
  @tracked errorMessage = '';

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (this.pin.length !== 6) {
      this.errorMessage = 'Please enter a 6-digit one-time password';
      return;
    }

    this.errorMessage = '';
    alert(`Submitted PIN: ${this.pin}`);
  };

  handleValueChange = (value: string) => {
    this.pin = value;
    if (this.errorMessage && value.length === 6) {
      this.errorMessage = '';
    }
  };

  <template>
    <form {{on "submit" this.handleSubmit}} class="w-full max-w-sm space-y-4">
      <Field @invalid={{if this.errorMessage true false}}>
        <FieldLabel>One-Time Password</FieldLabel>
        <FieldContent>
          <InputOTP
            @maxLength={{6}}
            @onValueChange={{this.handleValueChange}}
            @value={{this.pin}}
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
          {{#if this.errorMessage}}
            <FieldError>{{this.errorMessage}}</FieldError>
          {{/if}}
        </FieldContent>
      </Field>
      <Button type="submit">Submit</Button>
    </form>
  </template>
}
