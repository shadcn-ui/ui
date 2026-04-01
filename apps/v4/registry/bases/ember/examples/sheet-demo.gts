import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/ui/sheet';

<template>
  <Sheet>
    <SheetTrigger @asChild={{true}}>
      <Button @variant="outline">Open</Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're done.
        </SheetDescription>
      </SheetHeader>
      <div class="grid flex-1 auto-rows-min gap-6 px-4">
        <div class="grid gap-3">
          <Label @for="sheet-demo-name">Name</Label>
          <Input id="sheet-demo-name" value="Pedro Duarte" />
        </div>
        <div class="grid gap-3">
          <Label @for="sheet-demo-username">Username</Label>
          {{! template-lint-disable no-potential-path-strings }}
          <Input id="sheet-demo-username" value="@peduarte" />
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose @asChild={{true}}>
          <Button @variant="outline">Close</Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
