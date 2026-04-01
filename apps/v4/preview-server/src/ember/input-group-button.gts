import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ember-ui/input-group';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ember-ui/popover';

import Check from '~icons/lucide/check';
import Copy from '~icons/lucide/copy';
import Info from '~icons/lucide/info';
import Star from '~icons/lucide/star';

export default class InputGroupButtonExample extends Component {
  @tracked hasCopied = false;
  @tracked isFavorite = false;

  copyToClipboard = () => {
    void navigator.clipboard.writeText('https://x.com/shadcn');
    this.hasCopied = true;
    setTimeout(() => {
      this.hasCopied = false;
    }, 2000);
  };

  toggleFavorite = () => {
    this.isFavorite = !this.isFavorite;
  };

  <template>
    <div class="grid w-full max-w-sm gap-6">
      <InputGroup>
        <InputGroupInput placeholder="https://x.com/shadcn" readonly />
        <InputGroupAddon @align="inline-end">
          <InputGroupButton
            @size="icon-xs"
            aria-label="Copy"
            title="Copy"
            {{on "click" this.copyToClipboard}}
          >
            {{#if this.hasCopied}}
              <Check />
            {{else}}
              <Copy />
            {{/if}}
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup @class="[--radius:9999px]">
        <Popover>
          <PopoverTrigger @asChild={{true}} as |trigger|>
            <InputGroupAddon>
              <InputGroupButton
                @size="icon-xs"
                @variant="secondary"
                {{trigger.modifiers}}
              >
                <Info />
              </InputGroupButton>
            </InputGroupAddon>
          </PopoverTrigger>
          <PopoverContent
            @align="start"
            @class="flex flex-col gap-1 rounded-xl text-sm"
          >
            <p class="font-medium">Your connection is not secure.</p>
            <p>You should not enter any sensitive information on this site.</p>
          </PopoverContent>
        </Popover>
        <InputGroupAddon @class="text-muted-foreground pl-1.5">
          https://
        </InputGroupAddon>
        <InputGroupInput id="input-secure-19" />
        <InputGroupAddon @align="inline-end">
          <InputGroupButton @size="icon-xs" {{on "click" this.toggleFavorite}}>
            <Star
              class="data-[favorite=true]:fill-blue-600 data-[favorite=true]:stroke-blue-600"
              data-favorite={{if this.isFavorite "true" "false"}}
            />
          </InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
      <InputGroup>
        <InputGroupInput placeholder="Type to search..." />
        <InputGroupAddon @align="inline-end">
          <InputGroupButton @variant="secondary">Search</InputGroupButton>
        </InputGroupAddon>
      </InputGroup>
    </div>
  </template>
}
