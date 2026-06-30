import { on } from '@ember/modifier';
import Component from '@glimmer/component';

import { Button } from '@/ember-ui/button';
import {
  Card,
  CardContent,
} from '@/ember-ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ember-ui/collapsible';

import ChevronDownIcon from '~icons/ms/keyboard_arrow_down';

export default class CollapsibleBasic extends Component {
  <template>
    <Card class="mx-auto w-full max-w-sm">
      <CardContent>
        <Collapsible class="rounded-md data-[state=open]:bg-muted">
          <CollapsibleTrigger @asChild={{true}} as |trigger|>
            <Button
              @variant="ghost"
              aria-controls={{trigger.aria-controls}}
              aria-expanded={{trigger.aria-expanded}}
              class="group w-full"
              data-disabled={{trigger.data-disabled}}
              data-state={{trigger.data-state}}
              disabled={{trigger.disabled}}
              {{on "click" trigger.onClick}}
            >
              Product details
              <ChevronDownIcon class="ml-auto group-data-[state=open]:rotate-180" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent class="flex flex-col items-start gap-2 p-2.5 pt-0 text-sm">
            <div>
              This panel can be expanded or collapsed to reveal additional
              content.
            </div>
            <Button @size="xs">Learn More</Button>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  </template>
}
