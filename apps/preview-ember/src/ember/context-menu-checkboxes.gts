import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuTrigger,
} from '@/ember-ui/context-menu';

export default class ContextMenuCheckboxesDemo extends Component {
  @tracked showBookmarksBar = true;
  @tracked showFullUrls = false;
  @tracked showDeveloperTools = true;

  setShowBookmarksBar = (checked: boolean) => {
    this.showBookmarksBar = checked;
  };

  setShowFullUrls = (checked: boolean) => {
    this.showFullUrls = checked;
  };

  setShowDeveloperTools = (checked: boolean) => {
    this.showDeveloperTools = checked;
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
          <ContextMenuCheckboxItem
            @checked={{this.showBookmarksBar}}
            @onCheckedChange={{this.setShowBookmarksBar}}
          >
            Show Bookmarks Bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            @checked={{this.showFullUrls}}
            @onCheckedChange={{this.setShowFullUrls}}
          >
            Show Full URLs
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem
            @checked={{this.showDeveloperTools}}
            @onCheckedChange={{this.setShowDeveloperTools}}
          >
            Show Developer Tools
          </ContextMenuCheckboxItem>
        </ContextMenuGroup>
      </ContextMenuContent>
    </ContextMenu>
  </template>
}
