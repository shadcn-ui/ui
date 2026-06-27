import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import BellIcon from '~icons/ms/notifications';
import MailIcon from '~icons/ms/mail';
import MessageSquareIcon from '~icons/ms/chat';

import { Button } from '@/ember-ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';

export default class DropdownMenuCheckboxesIconsDemo extends Component {
  @tracked emailEnabled = true;
  @tracked smsEnabled = false;
  @tracked pushEnabled = true;

  setEmail = (checked: boolean) => {
    this.emailEnabled = checked;
  };

  setSms = (checked: boolean) => {
    this.smsEnabled = checked;
  };

  setPush = (checked: boolean) => {
    this.pushEnabled = checked;
  };

  <template>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button @variant="outline">Notifications</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @class="w-48">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Notification Preferences</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            @checked={{this.emailEnabled}}
            @onCheckedChange={{this.setEmail}}
          >
            <MailIcon />
            Email notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            @checked={{this.smsEnabled}}
            @onCheckedChange={{this.setSms}}
          >
            <MessageSquareIcon />
            SMS notifications
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            @checked={{this.pushEnabled}}
            @onCheckedChange={{this.setPush}}
          >
            <BellIcon />
            Push notifications
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  </template>
}
