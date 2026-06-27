import { Button } from '@/ember-ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ember-ui/dialog';

<template>
  <Dialog>
    <DialogTrigger>
      <Button @variant="outline">No Close Button</Button>
    </DialogTrigger>
    <DialogContent @showCloseButton={{false}}>
      <DialogHeader>
        <DialogTitle>No Close Button</DialogTitle>
        <DialogDescription>
          This dialog doesn't have a close button in the top-right corner.
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
</template>
