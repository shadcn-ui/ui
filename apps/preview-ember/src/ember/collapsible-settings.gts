import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/ember-ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ember-ui/collapsible';
import {
  Field,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';

import CloseFullscreenIcon from '~icons/ms/close_fullscreen';
import OpenInFullIcon from '~icons/ms/open_in_full';

export default class CollapsibleSettings extends Component {
  @tracked isOpen = false;

  setIsOpen = (open: boolean) => {
    this.isOpen = open;
  };

  <template>
    <Card @size="sm" class="mx-auto w-full max-w-xs">
      <CardHeader>
        <CardTitle>Radius</CardTitle>
        <CardDescription>Set the corner radius of the element.</CardDescription>
      </CardHeader>
      <CardContent>
        <Collapsible
          @open={{this.isOpen}}
          @onOpenChange={{this.setIsOpen}}
          class="flex items-start gap-2"
        >
          <FieldGroup class="grid w-full grid-cols-2 gap-2">
            <Field>
              <FieldLabel @for="radius-x" class="sr-only">Radius X</FieldLabel>
              <Input id="radius-x" placeholder="0" value="0" />
            </Field>
            <Field>
              <FieldLabel @for="radius-y" class="sr-only">Radius Y</FieldLabel>
              <Input id="radius-y" placeholder="0" value="0" />
            </Field>
            <CollapsibleContent class="col-span-full grid grid-cols-subgrid gap-2">
              <Field>
                <FieldLabel @for="radius-x2" class="sr-only">Radius X</FieldLabel>
                <Input id="radius-x2" placeholder="0" value="0" />
              </Field>
              <Field>
                <FieldLabel @for="radius-y2" class="sr-only">Radius Y</FieldLabel>
                <Input id="radius-y2" placeholder="0" value="0" />
              </Field>
            </CollapsibleContent>
          </FieldGroup>
          <CollapsibleTrigger @asChild={{true}} as |trigger|>
            <Button
              @variant="outline"
              @size="icon"
              aria-controls={{trigger.aria-controls}}
              aria-expanded={{trigger.aria-expanded}}
              data-disabled={{trigger.data-disabled}}
              data-state={{trigger.data-state}}
              disabled={{trigger.disabled}}
              {{on "click" trigger.onClick}}
            >
              {{#if this.isOpen}}
                <CloseFullscreenIcon />
              {{else}}
                <OpenInFullIcon />
              {{/if}}
            </Button>
          </CollapsibleTrigger>
        </Collapsible>
      </CardContent>
    </Card>
  </template>
}
