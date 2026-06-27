import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from '@/ember-ui/command';

import Bell from '~icons/ms/notifications';
import Calculator from '~icons/ms/calculate';
import Calendar from '~icons/ms/calendar_month';
import ClipboardPaste from '~icons/ms/content_paste';
import Code from '~icons/ms/code';
import Copy from '~icons/ms/content_copy';
import CreditCard from '~icons/ms/credit_card';
import FileText from '~icons/ms/description';
import Folder from '~icons/ms/folder';
import FolderPlus from '~icons/ms/create_new_folder';
import HelpCircle from '~icons/ms/help';
import Home from '~icons/ms/home';
import Image from '~icons/ms/image';
import Inbox from '~icons/ms/inbox';
import LayoutGrid from '~icons/ms/grid_view';
import List from '~icons/ms/list';
import Plus from '~icons/ms/add';
import Scissors from '~icons/ms/content_cut';
import Settings from '~icons/ms/settings';
import Trash from '~icons/ms/delete';
import User from '~icons/ms/person';
import ZoomIn from '~icons/ms/zoom_in';
import ZoomOut from '~icons/ms/zoom_out';

export default class CommandScrollableDemo extends Component {
  @tracked open = false;

  setOpen = (open: boolean) => {
    this.open = open;
  };

  <template>
    <div class="flex flex-col gap-4">
      <Button @variant="outline" @class="w-fit" {{on "click" (fn this.setOpen true)}}>
        Open Menu
      </Button>
      <CommandDialog @open={{this.open}} @onOpenChange={{this.setOpen}}>
        <Command>
          <CommandInput @placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup @heading="Navigation">
              <CommandItem @value="home">
                <Home />
                <span>Home</span>
                <CommandShortcut>⌘H</CommandShortcut>
              </CommandItem>
              <CommandItem @value="inbox">
                <Inbox />
                <span>Inbox</span>
                <CommandShortcut>⌘I</CommandShortcut>
              </CommandItem>
              <CommandItem @value="documents">
                <FileText />
                <span>Documents</span>
                <CommandShortcut>⌘D</CommandShortcut>
              </CommandItem>
              <CommandItem @value="folders">
                <Folder />
                <span>Folders</span>
                <CommandShortcut>⌘F</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup @heading="Actions">
              <CommandItem @value="new-file">
                <Plus />
                <span>New File</span>
                <CommandShortcut>⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem @value="new-folder">
                <FolderPlus />
                <span>New Folder</span>
                <CommandShortcut>⇧⌘N</CommandShortcut>
              </CommandItem>
              <CommandItem @value="copy">
                <Copy />
                <span>Copy</span>
                <CommandShortcut>⌘C</CommandShortcut>
              </CommandItem>
              <CommandItem @value="cut">
                <Scissors />
                <span>Cut</span>
                <CommandShortcut>⌘X</CommandShortcut>
              </CommandItem>
              <CommandItem @value="paste">
                <ClipboardPaste />
                <span>Paste</span>
                <CommandShortcut>⌘V</CommandShortcut>
              </CommandItem>
              <CommandItem @value="delete">
                <Trash />
                <span>Delete</span>
                <CommandShortcut>⌫</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup @heading="View">
              <CommandItem @value="grid-view">
                <LayoutGrid />
                <span>Grid View</span>
              </CommandItem>
              <CommandItem @value="list-view">
                <List />
                <span>List View</span>
              </CommandItem>
              <CommandItem @value="zoom-in">
                <ZoomIn />
                <span>Zoom In</span>
                <CommandShortcut>⌘+</CommandShortcut>
              </CommandItem>
              <CommandItem @value="zoom-out">
                <ZoomOut />
                <span>Zoom Out</span>
                <CommandShortcut>⌘-</CommandShortcut>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup @heading="Account">
              <CommandItem @value="profile">
                <User />
                <span>Profile</span>
                <CommandShortcut>⌘P</CommandShortcut>
              </CommandItem>
              <CommandItem @value="billing">
                <CreditCard />
                <span>Billing</span>
                <CommandShortcut>⌘B</CommandShortcut>
              </CommandItem>
              <CommandItem @value="settings">
                <Settings />
                <span>Settings</span>
                <CommandShortcut>⌘S</CommandShortcut>
              </CommandItem>
              <CommandItem @value="notifications">
                <Bell />
                <span>Notifications</span>
              </CommandItem>
              <CommandItem @value="help">
                <HelpCircle />
                <span>Help &amp; Support</span>
              </CommandItem>
            </CommandGroup>
            <CommandSeparator />
            <CommandGroup @heading="Tools">
              <CommandItem @value="calculator">
                <Calculator />
                <span>Calculator</span>
              </CommandItem>
              <CommandItem @value="calendar">
                <Calendar />
                <span>Calendar</span>
              </CommandItem>
              <CommandItem @value="image-editor">
                <Image />
                <span>Image Editor</span>
              </CommandItem>
              <CommandItem @value="code-editor">
                <Code />
                <span>Code Editor</span>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  </template>
}
