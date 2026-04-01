import { fn } from '@ember/helper';
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
} from '@/ember-ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/ember-ui/dropdown-menu';
import { Field, FieldGroup, FieldLabel } from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';
import { Textarea } from '@/ember-ui/textarea';

import MoreHorizontal from '~icons/lucide/more-horizontal';

export default class DropdownMenuDialogDemo extends Component {
  @tracked showNewDialog = false;
  @tracked showShareDialog = false;

  setShowNewDialog = (open: boolean) => {
    this.showNewDialog = open;
  };

  setShowShareDialog = (open: boolean) => {
    this.showShareDialog = open;
  };

  <template>
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button @size="icon-sm" @variant="outline" aria-label="Open menu">
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent @align="end" @class="w-40">
        <DropdownMenuLabel>File Actions</DropdownMenuLabel>
        <DropdownMenuGroup>
          <DropdownMenuItem @onSelect={{fn this.setShowNewDialog true}}>
            New File...
          </DropdownMenuItem>
          <DropdownMenuItem @onSelect={{fn this.setShowShareDialog true}}>
            Share...
          </DropdownMenuItem>
          <DropdownMenuItem @disabled={{true}}>Download</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>

    <Dialog
      @onOpenChange={{this.setShowNewDialog}}
      @open={{this.showNewDialog}}
    >
      <DialogContent @class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New File</DialogTitle>
          <DialogDescription>
            Provide a name for your new file. Click create when you're done.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup class="pb-3">
          <Field>
            <FieldLabel for="filename">File Name</FieldLabel>
            <Input id="filename" name="filename" placeholder="document.txt" />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose>
            <Button @variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Create</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>

    <Dialog
      @onOpenChange={{this.setShowShareDialog}}
      @open={{this.showShareDialog}}
    >
      <DialogContent @class="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Share File</DialogTitle>
          <DialogDescription>
            Anyone with the link will be able to view this file.
          </DialogDescription>
        </DialogHeader>
        <FieldGroup class="py-3">
          <Field>
            <Label for="email">Email Address</Label>
            <Input
              autocomplete="off"
              id="email"
              name="email"
              placeholder="shadcn@vercel.com"
              type="email"
            />
          </Field>
          <Field>
            <FieldLabel for="message">Message (Optional)</FieldLabel>
            <Textarea
              id="message"
              name="message"
              placeholder="Check out this file"
            />
          </Field>
        </FieldGroup>
        <DialogFooter>
          <DialogClose>
            <Button @variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Send Invite</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </template>
}
