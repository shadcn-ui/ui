import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ui/button';
import { ButtonGroup } from '@/ui/button-group';
import { Input } from '@/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from '@/ui/select';

import ArrowRightIcon from '~icons/lucide/arrow-right';

const CURRENCIES = [
  {
    value: '$',
    label: 'US Dollar',
  },
  {
    value: '€',
    label: 'Euro',
  },
  {
    value: '£',
    label: 'British Pound',
  },
];

export default class ButtonGroupSelect extends Component {
  @tracked currency = '$';

  handleCurrencyChange = (value: string) => {
    this.currency = value;
  };

  <template>
    <ButtonGroup>
      <ButtonGroup>
        <Select
          @onValueChange={{this.handleCurrencyChange}}
          @value={{this.currency}}
        >
          <SelectTrigger class="font-mono">{{this.currency}}</SelectTrigger>
          <SelectContent @class="min-w-24">
            {{#each CURRENCIES as |currency|}}
              <SelectItem @value={{currency.value}}>
                {{currency.value}}
                <span class="text-muted-foreground">{{currency.label}}</span>
              </SelectItem>
            {{/each}}
          </SelectContent>
        </Select>
        <Input pattern="[0-9]*" placeholder="10.00" />
      </ButtonGroup>
      <ButtonGroup>
        <Button @size="icon" @variant="outline" aria-label="Send">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  </template>
}
