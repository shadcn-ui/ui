import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/ui/popover';

<template>
  <Popover>
    <PopoverTrigger>
      <Button @variant="outline">Open popover</Button>
    </PopoverTrigger>
    <PopoverContent @class="w-80">
      <div class="grid gap-4">
        <div class="space-y-2">
          <h4 class="font-medium leading-none">Dimensions</h4>
          <p class="text-sm text-muted-foreground">
            Set the dimensions for the layer.
          </p>
        </div>
        <div class="grid gap-2">
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="width">Width</Label>
            <Input @class="col-span-2 h-8" id="width" value="100%" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="maxWidth">Max. width</Label>
            <Input @class="col-span-2 h-8" id="maxWidth" value="300px" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="height">Height</Label>
            <Input @class="col-span-2 h-8" id="height" value="25px" />
          </div>
          <div class="grid grid-cols-3 items-center gap-4">
            <Label for="maxHeight">Max. height</Label>
            <Input @class="col-span-2 h-8" id="maxHeight" value="none" />
          </div>
        </div>
      </div>
    </PopoverContent>
  </Popover>
</template>
