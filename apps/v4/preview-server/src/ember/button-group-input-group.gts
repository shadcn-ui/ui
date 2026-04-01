import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from '@/ember-ui/input-group';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/ember-ui/tooltip';

import AudioLinesIcon from '~icons/lucide/audio-lines';
import PlusIcon from '~icons/lucide/plus';

export default class ButtonGroupInputGroup extends Component {
  @tracked voiceEnabled = false;

  toggleVoice = () => {
    this.voiceEnabled = !this.voiceEnabled;
  };

  <template>
    <ButtonGroup class="[--radius:9999rem]">
      <ButtonGroup>
        <Button @size="icon" @variant="outline" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup class="flex-1">
        <InputGroup>
          <InputGroupInput
            disabled={{this.voiceEnabled}}
            placeholder={{if
              this.voiceEnabled
              "Record and send audio..."
              "Send a message..."
            }}
          />
          <InputGroupAddon @align="inline-end">
            <Tooltip>
              <TooltipTrigger>
                <InputGroupButton
                  @size="icon-xs"
                  @variant="ghost"
                  aria-label="Voice Mode"
                  aria-pressed={{this.voiceEnabled}}
                  class="data-[active=true]:bg-primary data-[active=true]:text-primary-foreground"
                  data-active={{this.voiceEnabled}}
                  {{on "click" this.toggleVoice}}
                >
                  <AudioLinesIcon />
                </InputGroupButton>
              </TooltipTrigger>
              <TooltipContent>Voice Mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  </template>
}
