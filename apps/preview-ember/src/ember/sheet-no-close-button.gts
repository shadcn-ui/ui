import { Button } from '@/ember-ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ember-ui/sheet';

<template>
  <Sheet>
    <SheetTrigger>
      <Button @variant="outline">Open Sheet</Button>
    </SheetTrigger>
    <SheetContent @showCloseButton={{false}}>
      <SheetHeader>
        <SheetTitle>No Close Button</SheetTitle>
        <SheetDescription>
          This sheet doesn't have a close button in the top-right corner.
          Click outside to close.
        </SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>
