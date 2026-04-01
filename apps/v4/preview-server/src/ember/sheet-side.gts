import { Button } from '@/ember-ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ember-ui/sheet';

const SHEET_SIDES = ['top', 'right', 'bottom', 'left'] as const;

<template>
  <div class="grid grid-cols-2 gap-2">
    {{#each SHEET_SIDES as |side|}}
      <Sheet>
        <SheetTrigger @asChild={{true}}>
          <Button @variant="outline">{{side}}</Button>
        </SheetTrigger>
        <SheetContent @side={{side}}>
          <SheetHeader>
            <SheetTitle>Edit profile</SheetTitle>
            <SheetDescription>
              Make changes to your profile here. Click save when you're done.
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
    {{/each}}
  </div>
</template>
