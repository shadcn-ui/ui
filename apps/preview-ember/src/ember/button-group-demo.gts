import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

import ArchiveIcon from '~icons/ms/archive';
import ArrowLeftIcon from '~icons/ms/arrow_left';
import CalendarPlusIcon from '~icons/ms/calendar_add_on';
import ClockIcon from '~icons/ms/schedule';
import ListFilterIcon from '~icons/ms/filter_list';
import MailCheckIcon from '~icons/ms/mark_email_read';
import MoreHorizontalIcon from '~icons/ms/more_horiz';
import TagIcon from '~icons/ms/tag';
import Trash2Icon from '~icons/ms/delete';

export default class ButtonGroupDemo extends Component {
  @tracked label = 'personal';

  handleLabelChange = (value: string) => {
    this.label = value;
  };

  <template>
    <ButtonGroup>
      <ButtonGroup class="hidden sm:flex">
        <Button @size="icon-sm" @variant="outline" aria-label="Go Back">
          <ArrowLeftIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button @size="sm" @variant="outline">Archive</Button>
        <Button @size="sm" @variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button @size="sm" @variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger @asChild={{true}} as |trigger|>
            <Button
              @size="icon-sm"
              @variant="outline"
              aria-label="More Options"
              {{trigger.modifiers}}
            >
              <MoreHorizontalIcon />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent @class="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <MailCheckIcon />
                Mark as Read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to Calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ListFilterIcon />
                Add to List
              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <TagIcon />
                  Label As...
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    @onValueChange={{this.handleLabelChange}}
                    @value={{this.label}}
                    as |value setValue|
                  >
                    <DropdownMenuRadioItem
                      @currentValue={{value}}
                      @setValue={{setValue}}
                      @value="personal"
                    >
                      Personal
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      @currentValue={{value}}
                      @setValue={{setValue}}
                      @value="work"
                    >
                      Work
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem
                      @currentValue={{value}}
                      @setValue={{setValue}}
                      @value="other"
                    >
                      Other
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem @variant="destructive">
                <Trash2Icon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  </template>
}
