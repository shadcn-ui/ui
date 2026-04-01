import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

export default class DropdownMenuRadioGroupDemo extends Component {
  @tracked position = 'bottom';

  setPosition = (value: string) => {
    this.position = value;
  };

  <template>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button @variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="w-56">
        <DropdownMenuLabel>Panel Position</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuRadioGroup
          @onValueChange={{this.setPosition}}
          @value={{this.position}}
          as |value setValue|
        >
          <DropdownMenuRadioItem
            @currentValue={{value}}
            @setValue={{setValue}}
            @value="top"
          >
            Top
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            @currentValue={{value}}
            @setValue={{setValue}}
            @value="bottom"
          >
            Bottom
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem
            @currentValue={{value}}
            @setValue={{setValue}}
            @value="right"
          >
            Right
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
}
