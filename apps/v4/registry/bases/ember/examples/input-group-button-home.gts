import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ui/input-group';
import { Label } from '@/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ui/popover';

import InfoIcon from '~icons/lucide/info';
import StarIcon from '~icons/lucide/star';

export default class InputGroupButtonHome extends Component {
  @tracked isFavorite = false;

  toggleFavorite = () => {
    this.isFavorite = !this.isFavorite;
  };

  <template>
    <div class="grid w-full max-w-sm gap-6">
      <Label @class="sr-only" @for="input-secure-19">
        Input Secure
      </Label>
      <InputGroup @class="[--radius:9999px]">
        <Popover>
          <PopoverTrigger @asChild={{true}} as |trigger|>
            <InputGroupAddon @align="inline-start">
              <InputGroupButton
                @size="icon-xs"
                @variant="secondary"
                aria-label="Info"
                {{trigger.modifiers}}
              >
                <InfoIcon />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            @align="start"
            @class="flex flex-col gap-1 rounded-xl text-sm"
            @sideOffset={{10}}
          >
            <div class="font-medium">Your connection is not secure.</div>
            <div>You should not enter any sensitive information on this site.</div>
          </PopoverContent>
        </Popover>
        <InputGroupAddon @class="text-muted-foreground !pl-1">
          https://
        </InputGroupAddon>
        <InputGroupInput @class="!pl-0.5" id="input-secure-19" />
        <InputGroupAddon @align="inline-end">
          <InputGroupButton
            {{on "click" this.toggleFavorite}}
            @size="icon-xs"
            @variant="ghost"
            aria-label="Favorite"
          >
            <StarIcon
              class="data-[favorite=true]:[&_path]:fill-primary data-[favorite=true]:[&_path]:stroke-primary"
              data-favorite={{if this.isFavorite "true" "false"}}
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </template>
}
