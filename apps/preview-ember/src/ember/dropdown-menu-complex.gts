import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import BellIcon from '~icons/ms/notifications';
import CreditCardIcon from '~icons/ms/credit_card';
import DownloadIcon from '~icons/ms/download';
import EyeIcon from '~icons/ms/visibility';
import FileCodeIcon from '~icons/ms/code';
import FileIcon from '~icons/ms/description';
import FileTextIcon from '~icons/ms/description';
import FolderIcon from '~icons/ms/folder';
import FolderOpenIcon from '~icons/ms/folder_open';
import FolderSearchIcon from '~icons/ms/folder';
import HelpCircleIcon from '~icons/ms/help';
import KeyboardIcon from '~icons/ms/keyboard';
import LanguagesIcon from '~icons/ms/translate';
import LayoutIcon from '~icons/ms/dashboard';
import LogOutIcon from '~icons/ms/logout';
import MailIcon from '~icons/ms/mail';
import MonitorIcon from '~icons/ms/monitor';
import MoonIcon from '~icons/ms/dark_mode';
import MoreHorizontalIcon from '~icons/ms/more_horiz';
import PaletteIcon from '~icons/ms/palette';
import SaveIcon from '~icons/ms/save';
import SettingsIcon from '~icons/ms/settings';
import ShieldIcon from '~icons/ms/shield';
import SunIcon from '~icons/ms/light_mode';
import UserIcon from '~icons/ms/person';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

export default class DropdownMenuComplexDemo extends Component {
  @tracked showSidebar = true;
  @tracked showStatusBar = false;
  @tracked pushEnabled = true;
  @tracked emailEnabled = true;
  @tracked theme = 'light';

  setShowSidebar = (checked: boolean) => { this.showSidebar = checked; };
  setShowStatusBar = (checked: boolean) => { this.showStatusBar = checked; };
  setPushEnabled = (checked: boolean) => { this.pushEnabled = checked; };
  setEmailEnabled = (checked: boolean) => { this.emailEnabled = checked; };
  setTheme = (value: string) => { this.theme = value; };

  <template>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button @variant="outline">Complex Menu</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="w-44">
        <DropdownMenuGroup>
          <DropdownMenuLabel>File</DropdownMenuLabel>
          <DropdownMenuItem>
            <FileIcon />
            New File
            <DropdownMenuShortcut>⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FolderIcon />
            New Folder
            <DropdownMenuShortcut>⇧⌘N</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <FolderOpenIcon />
              Open Recent
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Recent Projects</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <FileCodeIcon />
                    Project Alpha
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <FileCodeIcon />
                    Project Beta
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <MoreHorizontalIcon />
                      More Projects
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>
                          <FileCodeIcon />
                          Project Gamma
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileCodeIcon />
                          Project Delta
                        </DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <FolderSearchIcon />
                    Browse...
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <SaveIcon />
            Save
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <DownloadIcon />
            Export
            <DropdownMenuShortcut>⇧⌘E</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>View</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            @checked={{this.showSidebar}}
            @onCheckedChange={{this.setShowSidebar}}
          >
            <EyeIcon />
            Show Sidebar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            @checked={{this.showStatusBar}}
            @onCheckedChange={{this.setShowStatusBar}}
          >
            <LayoutIcon />
            Show Status Bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <PaletteIcon />
              Theme
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Appearance</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    @onValueChange={{this.setTheme}}
                    @value={{this.theme}}
                    as |value setValue|
                  >
                    <DropdownMenuRadioItem @currentValue={{value}} @setValue={{setValue}} @value="light">
                      <SunIcon />
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem @currentValue={{value}} @setValue={{setValue}} @value="dark">
                      <MoonIcon />
                      Dark
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem @currentValue={{value}} @setValue={{setValue}} @value="system">
                      <MonitorIcon />
                      System
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuLabel>Account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <SettingsIcon />
              Settings
            </DropdownMenuSubTrigger>
            <DropdownMenuPortal>
              <DropdownMenuSubContent>
                <DropdownMenuGroup>
                  <DropdownMenuLabel>Preferences</DropdownMenuLabel>
                  <DropdownMenuItem>
                    <KeyboardIcon />
                    Keyboard Shortcuts
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <LanguagesIcon />
                    Language
                  </DropdownMenuItem>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <BellIcon />
                      Notifications
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuGroup>
                          <DropdownMenuLabel>Notification Types</DropdownMenuLabel>
                          <DropdownMenuCheckboxItem
                            @checked={{this.pushEnabled}}
                            @onCheckedChange={{this.setPushEnabled}}
                          >
                            <BellIcon />
                            Push Notifications
                          </DropdownMenuCheckboxItem>
                          <DropdownMenuCheckboxItem
                            @checked={{this.emailEnabled}}
                            @onCheckedChange={{this.setEmailEnabled}}
                          >
                            <MailIcon />
                            Email Notifications
                          </DropdownMenuCheckboxItem>
                        </DropdownMenuGroup>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <ShieldIcon />
                    Privacy &amp; Security
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            <HelpCircleIcon />
            Help &amp; Support
          </DropdownMenuItem>
          <DropdownMenuItem>
            <FileTextIcon />
            Documentation
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem @variant="destructive">
            <LogOutIcon />
            Sign Out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
}
