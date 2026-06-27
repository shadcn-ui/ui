import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuTrigger,
} from '@/ember-ui/context-menu';

export default class ContextMenuRadioDemo extends Component {
  @tracked user = 'pedro';
  @tracked theme = 'light';

  setUser = (value: string) => {
    this.user = value;
  };

  setTheme = (value: string) => {
    this.theme = value;
  };

  <template>
    <ContextMenu>
      <ContextMenuTrigger>
        <div class="flex aspect-video w-full max-w-xs items-center justify-center rounded-xl border border-dashed text-sm">
          Right click here
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel>People</ContextMenuLabel>
          <ContextMenuRadioGroup
            @onValueChange={{this.setUser}}
            @value={{this.user}}
            as |value setValue|
          >
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
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuLabel>Theme</ContextMenuLabel>
          <ContextMenuRadioGroup
            @onValueChange={{this.setTheme}}
            @value={{this.theme}}
            as |value setValue|
          >
            <ContextMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="light"
            >
              Light
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="dark"
            >
              Dark
            </ContextMenuRadioItem>
            <ContextMenuRadioItem
              @currentValue={{value}}
              @setValue={{setValue}}
              @value="system"
            >
              System
            </ContextMenuRadioItem>
          </ContextMenuRadioGroup>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </template>
}
