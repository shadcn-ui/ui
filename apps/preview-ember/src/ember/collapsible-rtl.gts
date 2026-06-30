import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ember-ui/collapsible';

import ChevronsUpDown from '~icons/ms/unfold_more';

export default class CollapsibleRtl extends Component {
  @tracked isOpen = false;

  setIsOpen = (open: boolean) => {
    this.isOpen = open;
  };

  <template>
    <Collapsible
      @open={{this.isOpen}}
      @onOpenChange={{this.setIsOpen}}
      class="flex w-[350px] flex-col gap-2"
      dir="rtl"
    >
      <div class="flex items-center justify-between gap-4 px-4">
        <h4 class="text-sm font-semibold">الطلب #4189</h4>
        <CollapsibleTrigger @asChild={{true}} as |trigger|>
          <Button
            @size="icon"
            @variant="ghost"
            aria-controls={{trigger.aria-controls}}
            aria-expanded={{trigger.aria-expanded}}
            class="size-8"
            data-disabled={{trigger.data-disabled}}
            data-state={{trigger.data-state}}
            disabled={{trigger.disabled}}
            {{on "click" trigger.onClick}}
          >
            <ChevronsUpDown />
            <span class="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div class="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
        <span class="text-muted-foreground">الحالة</span>
        <span class="font-medium">تم الشحن</span>
      </div>
      <CollapsibleContent class="flex flex-col gap-2">
        <div class="rounded-md border px-4 py-2 text-sm">
          <p class="font-medium">عنوان الشحن</p>
          <p class="text-muted-foreground">100 Market St, San Francisco</p>
        </div>
        <div class="rounded-md border px-4 py-2 text-sm">
          <p class="font-medium">العناصر</p>
          <p class="text-muted-foreground">2x سماعات الاستوديو</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  </template>
}
