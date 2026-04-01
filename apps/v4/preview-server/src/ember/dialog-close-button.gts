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

<template>
  <Dialog>
    <DialogTrigger>
      <Button @variant="outline">Share</Button>
    </DialogTrigger>
    <DialogContent @class="sm:max-w-md">
      <DialogHeader>
        <DialogTitle>Share link</DialogTitle>
        <DialogDescription>
          Anyone who has this link will be able to view this.
        </DialogDescription>
      </DialogHeader>
      <div class="flex items-center gap-2">
        <div class="grid flex-1 gap-2">
          <Label @class="sr-only" @for="link">
            Link
          </Label>
          <Input
            id="link"
            readonly
            value="https://ui.shadcn.com/docs/installation"
          />
        </div>
      </div>
      <DialogFooter @class="sm:justify-start">
        <DialogClose>
          <Button @variant="secondary" type="button">
            Close
          </Button>
        </DialogClose>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>
