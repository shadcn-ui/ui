import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ember-ui/dialog';
import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';

export default class DialogDemo extends Component {
  @tracked name = 'Pedro Duarte';
  @tracked username = '@peduarte';
  @tracked isOpen = false;

  setIsOpen = (open: boolean) => {
    this.isOpen = open;
  };

  handleSubmit = (event: SubmitEvent) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    this.name = formData.get('name') as string;
    this.username = formData.get('username') as string;
    this.isOpen = false;
  };

  <template>
    <Dialog @onOpenChange={{this.setIsOpen}} @open={{this.isOpen}}>
      <form {{on "submit" this.handleSubmit}}>
        <DialogTrigger>
          <Button @variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent @class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div class="grid gap-4">
            <div class="grid gap-3">
              <Label @for="name-1">Name</Label>
              <Input id="name-1" name="name" value={{this.name}} />
            </div>
            <div class="grid gap-3">
              <Label @for="username-1">Username</Label>
              <Input id="username-1" name="username" value={{this.username}} />
            </div>
          </div>
          <DialogFooter>
            <DialogClose @asChild={{true}}>
              <Button @variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  </template>
}
