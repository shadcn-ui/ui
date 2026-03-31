<script setup lang="ts">
import { Button } from "@/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/ui/field"
import { Input } from "@/ui/input"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/ui/sheet"
</script>

<template>
  <Sheet>
    <SheetTrigger :as-child="true">
      <Button variant="outline">
        Open
      </Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Make changes to your profile here. Click save when you're
          done.
        </SheetDescription>
      </SheetHeader>
      <div class="style-vega:px-4 style-maia:px-6 style-mira:px-6 style-lyra:px-4 style-nova:px-4">
        <FieldGroup>
          <Field>
            <FieldLabel html-for="sheet-demo-name">
              Name
            </FieldLabel>
            <Input id="sheet-demo-name" default-value="Pedro Duarte" />
          </Field>
          <Field>
            <FieldLabel html-for="sheet-demo-username">
              Username
            </FieldLabel>
            <Input id="sheet-demo-username" default-value="@peduarte" />
          </Field>
        </FieldGroup>
      </div>
      <SheetFooter>
        <Button type="submit">
          Save changes
        </Button>
        <SheetClose :as-child="true">
          <Button variant="outline">
            Close
          </Button>
        </SheetClose>
      </SheetFooter>
    </SheetContent>
  </Sheet>
</template>
