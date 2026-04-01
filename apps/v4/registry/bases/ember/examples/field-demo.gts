import { on } from '@ember/modifier';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ui/button';
import { Checkbox } from '@/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from '@/ui/field';
import { Input } from '@/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ui/select';
import { Textarea } from '@/ui/textarea';

class FieldDemoState {
  @tracked cardName = '';
  @tracked cardNumber = '';
  @tracked cvv = '';
  @tracked expMonth = '';
  @tracked expYear = '';
  @tracked sameAsShipping = true;
  @tracked comments = '';

  updateCardName = (event: Event) => {
    this.cardName = (event.target as HTMLInputElement).value;
  };

  updateCardNumber = (event: Event) => {
    this.cardNumber = (event.target as HTMLInputElement).value;
  };

  updateCvv = (event: Event) => {
    this.cvv = (event.target as HTMLInputElement).value;
  };

  updateComments = (event: Event) => {
    this.comments = (event.target as HTMLTextAreaElement).value;
  };

  selectMonth = (value: string) => {
    this.expMonth = value;
  };

  selectYear = (value: string) => {
    this.expYear = value;
  };

  toggleSameAsShipping = (checked: boolean) => {
    this.sameAsShipping = checked;
  };

  handleSubmit = (event: Event) => {
    event.preventDefault();
    console.log('Form submitted');
  };
}

const state = new FieldDemoState();

<template>
  <div class="w-full rounded-lg border p-6">
    <form {{on "submit" state.handleSubmit}}>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Payment Method</FieldLegend>
          <FieldDescription>
            All transactions are secure and encrypted
          </FieldDescription>
          <FieldGroup>
            <Field>
              <FieldLabel @for="checkout-card-name">
                Name on Card
              </FieldLabel>
              <Input
                id="checkout-card-name"
                placeholder="John Doe"
                required
                value={{state.cardName}}
                {{on "input" state.updateCardName}}
              />
            </Field>
            <div class="grid grid-cols-3 gap-4">
              <Field @class="col-span-2">
                <FieldLabel @for="checkout-card-number">
                  Card Number
                </FieldLabel>
                <Input
                  id="checkout-card-number"
                  placeholder="1234 5678 9012 3456"
                  required
                  value={{state.cardNumber}}
                  {{on "input" state.updateCardNumber}}
                />
                <FieldDescription>
                  Enter your 16-digit number.
                </FieldDescription>
              </Field>
              <Field @class="col-span-1">
                <FieldLabel @for="checkout-cvv">CVV</FieldLabel>
                <Input
                  id="checkout-cvv"
                  placeholder="123"
                  required
                  value={{state.cvv}}
                  {{on "input" state.updateCvv}}
                />
              </Field>
            </div>
            <div class="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel @for="checkout-exp-month">
                  Month
                </FieldLabel>
                <Select @onValueChange={{state.selectMonth}}>
                  <SelectTrigger id="checkout-exp-month">
                    <SelectValue @placeholder="MM" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem @value="01">01</SelectItem>
                    <SelectItem @value="02">02</SelectItem>
                    <SelectItem @value="03">03</SelectItem>
                    <SelectItem @value="04">04</SelectItem>
                    <SelectItem @value="05">05</SelectItem>
                    <SelectItem @value="06">06</SelectItem>
                    <SelectItem @value="07">07</SelectItem>
                    <SelectItem @value="08">08</SelectItem>
                    <SelectItem @value="09">09</SelectItem>
                    <SelectItem @value="10">10</SelectItem>
                    <SelectItem @value="11">11</SelectItem>
                    <SelectItem @value="12">12</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel @for="checkout-exp-year">
                  Year
                </FieldLabel>
                <Select @onValueChange={{state.selectYear}}>
                  <SelectTrigger id="checkout-exp-year">
                    <SelectValue @placeholder="YYYY" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem @value="2024">2024</SelectItem>
                    <SelectItem @value="2025">2025</SelectItem>
                    <SelectItem @value="2026">2026</SelectItem>
                    <SelectItem @value="2027">2027</SelectItem>
                    <SelectItem @value="2028">2028</SelectItem>
                    <SelectItem @value="2029">2029</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldLegend>Billing Address</FieldLegend>
          <FieldDescription>
            The billing address associated with your payment method
          </FieldDescription>
          <FieldGroup>
            <Field @orientation="horizontal">
              <Checkbox
                @checked={{state.sameAsShipping}}
                @onCheckedChange={{state.toggleSameAsShipping}}
                id="checkout-same-as-shipping"
              />
              <FieldLabel @class="font-normal" @for="checkout-same-as-shipping">
                Same as shipping address
              </FieldLabel>
            </Field>
          </FieldGroup>
        </FieldSet>
        <FieldSeparator />
        <FieldSet>
          <FieldGroup>
            <Field>
              <FieldLabel @for="checkout-optional-comments">
                Comments
              </FieldLabel>
              <Textarea
                id="checkout-optional-comments"
                placeholder="Add any additional comments"
                value={{state.comments}}
                {{on "input" state.updateComments}}
              />
            </Field>
          </FieldGroup>
        </FieldSet>
        <Field @orientation="horizontal">
          <Button type="submit">Submit</Button>
          <Button @variant="outline" type="button">
            Cancel
          </Button>
        </Field>
      </FieldGroup>
    </form>
  </div>
</template>
