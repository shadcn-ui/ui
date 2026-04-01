import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
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
} from '@/ui/context-menu';

class ContextMenuDemo extends Component {
  @tracked showBookmarks = true;
  @tracked showFullUrls = false;
  @tracked person = 'pedro';

  toggleBookmarks = () => {
    this.showBookmarks = !this.showBookmarks;
  };

  toggleFullUrls = () => {
    this.showFullUrls = !this.showFullUrls;
  };

  setPerson = (value: string) => {
    this.person = value;
  };

  <template>
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          class="flex h-37.5 w-75 items-center justify-center rounded-md border border-dashed text-sm"
        >
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent @class="w-52">
        <ContextMenuItem @inset={{true}}>
          Back
          <ContextMenuShortcut>⌘[</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem @disabled={{true}} @inset={{true}}>
          Forward
          <ContextMenuShortcut>⌘]</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuItem @inset={{true}}>
          Reload
          <ContextMenuShortcut>⌘R</ContextMenuShortcut>
        </ContextMenuItem>
        <ContextMenuSub>
          <ContextMenuSubTrigger @inset={{true}}>
            More Tools
          </ContextMenuSubTrigger>
          <ContextMenuSubContent @class="w-44">
            <ContextMenuItem>Save Page...</ContextMenuItem>
            <ContextMenuItem>Create Shortcut...</ContextMenuItem>
            <ContextMenuItem>Name Window...</ContextMenuItem>
            <ContextMenuSeparator />
            <ContextMenuItem>Developer Tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
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
        <ContextMenuSeparator />
        <ContextMenuRadioGroup>
          <ContextMenuLabel @inset={{true}}>People</ContextMenuLabel>
          <ContextMenuRadioItem
            @currentValue={{this.person}}
            @setValue={{this.setPerson}}
            @value="pedro"
          >
            Pedro Duarte
          </ContextMenuRadioItem>
          <ContextMenuRadioItem
            @currentValue={{this.person}}
            @setValue={{this.setPerson}}
            @value="colm"
          >
            Colm Tuite
          </ContextMenuRadioItem>
        </ContextMenuRadioGroup>
      </ContextMenuContent>
    </ContextMenu>
  </template>
}

export default ContextMenuDemo;
