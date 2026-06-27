import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import ArrowLeftIcon from '~icons/ms/arrow_left';
import ArrowRightIcon from '~icons/ms/arrow_right';
import RotateCwIcon from '~icons/ms/rotate_right';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '@/ember-ui/context-menu';

export default class ContextMenuRtlDemo extends Component {
  @tracked people = 'pedro';
  @tracked showBookmarks = true;
  @tracked showFullUrls = false;

  setPeople = (value: string) => {
    this.people = value;
  };

  toggleBookmarks = () => {
    this.showBookmarks = !this.showBookmarks;
  };

  toggleFullUrls = () => {
    this.showFullUrls = !this.showFullUrls;
  };

  <template>
    <ContextMenu>
      <ContextMenuTrigger>
        <div class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent @class="w-48" dir="rtl">
        <ContextMenuGroup>
          <ContextMenuSub>
            <ContextMenuSubTrigger>Navigation</ContextMenuSubTrigger>
            <ContextMenuSubContent @class="w-44">
              <ContextMenuGroup>
                <ContextMenuItem>
                  <ArrowLeftIcon />
                  Back
                  <ContextMenuShortcut>⌘[</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem @disabled={{true}}>
                  <ArrowRightIcon />
                  Forward
                  <ContextMenuShortcut>⌘]</ContextMenuShortcut>
                </ContextMenuItem>
                <ContextMenuItem>
                  <RotateCwIcon />
                  Reload
                  <ContextMenuShortcut>⌘R</ContextMenuShortcut>
                </ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSub>
            <ContextMenuSubTrigger>More Tools</ContextMenuSubTrigger>
            <ContextMenuSubContent @class="w-44">
              <ContextMenuGroup>
                <ContextMenuItem>Save Page...</ContextMenuItem>
                <ContextMenuItem>Create Shortcut...</ContextMenuItem>
                <ContextMenuItem>Name Window...</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem>Developer Tools</ContextMenuItem>
              </ContextMenuGroup>
              <ContextMenuSeparator />
              <ContextMenuGroup>
                <ContextMenuItem @variant="destructive">Delete</ContextMenuItem>
              </ContextMenuGroup>
            </ContextMenuSubContent>
          </ContextMenuSub>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem
            @checked={{this.showBookmarks}}
            @onCheckedChange={{this.toggleBookmarks}}
          >
            Show Bookmarks
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            @checked={{this.showFullUrls}}
            @onCheckedChange={{this.toggleFullUrls}}
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuRadioGroup
            @onValueChange={{this.setPeople}}
            @value={{this.people}}
            as |value setValue|
          >
            <ContextMenuLabel>People</ContextMenuLabel>
            <ContextMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="pedro"
            >
              Pedro Duarte
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="colm"
            >
              Colm Tuite
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </template>
}
