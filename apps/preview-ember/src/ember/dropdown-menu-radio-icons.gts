import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import Building2Icon from '~icons/ms/apartment';
import CreditCardIcon from '~icons/ms/credit_card';
import WalletIcon from '~icons/ms/wallet';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

export default class DropdownMenuRadioIconsDemo extends Component {
  @tracked paymentMethod = 'card';

  setPaymentMethod = (value: string) => {
    this.paymentMethod = value;
  };

  <template>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button @variant="outline">Payment Method</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="min-w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Select Payment Method</DropdownMenuLabel>
          <DropdownMenuRadioGroup
            @onValueChange={{this.setPaymentMethod}}
            @value={{this.paymentMethod}}
            as |value setValue|
          >
            <DropdownMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="card"
            >
              <CreditCardIcon />
              Credit Card
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="paypal"
            >
              <WalletIcon />
              PayPal
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="bank"
            >
              <Building2Icon />
              Bank Transfer
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
}
