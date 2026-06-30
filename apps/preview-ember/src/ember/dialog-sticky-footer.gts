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

const items = Array.from({ length: 10 });

<template>
  <Dialog>
    <DialogTrigger>
      <Button @variant="outline">Sticky Footer</Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Sticky Footer</DialogTitle>
        <DialogDescription>
          This dialog has a sticky footer that stays visible while the content scrolls.
        </DialogDescription>
      </DialogHeader>
      <div class="-mx-4 no-scrollbar max-h-[50vh] overflow-y-auto px-4">
        {{#each items as |_ index|}}
          <p class="mb-4 leading-normal">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut
            enim ad minim veniam, quis nostrud exercitation ullamco laboris
            nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in
            reprehenderit in voluptate velit esse cillum dolore eu fugiat
            nulla pariatur. Excepteur sint occaecat cupidatat non proident,
            sunt in culpa qui officia deserunt mollit anim id est laborum.
          </p>
        {{/each}}
      </div>
      <DialogFooter>
        <DialogClose>
          <Button @variant="outline">Close</Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
