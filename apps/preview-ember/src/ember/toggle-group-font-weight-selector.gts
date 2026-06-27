import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  Field,
  FieldDescription,
  FieldLabel,
} from '@/ember-ui/field';
import { ToggleGroup, ToggleGroupItem } from '@/ember-ui/toggle-group';

export default class ToggleGroupFontWeightSelector extends Component {
  @tracked fontWeight = 'normal';

  setFontWeight = (value: string) => {
    this.fontWeight = value;
  };

  <template>
    <Field>
      <FieldLabel>Font Weight</FieldLabel>
      <ToggleGroup
        @type="single"
        @value={{this.fontWeight}}
        @onValueChange={{this.setFontWeight}}
        @variant="outline"
        @spacing={{2}}
        @size="lg"
      >
        <ToggleGroupItem
          @value="light"
          @class="flex size-16 flex-col items-center justify-center rounded-xl"
          aria-label="Light"
        >
          <span class="text-2xl leading-none font-light">Aa</span>
          <span class="text-xs text-muted-foreground">Light</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          @value="normal"
          @class="flex size-16 flex-col items-center justify-center rounded-xl"
          aria-label="Normal"
        >
          <span class="text-2xl leading-none font-normal">Aa</span>
          <span class="text-xs text-muted-foreground">Normal</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          @value="medium"
          @class="flex size-16 flex-col items-center justify-center rounded-xl"
          aria-label="Medium"
        >
          <span class="text-2xl leading-none font-medium">Aa</span>
          <span class="text-xs text-muted-foreground">Medium</span>
        </ToggleGroupItem>
        <ToggleGroupItem
          @value="bold"
          @class="flex size-16 flex-col items-center justify-center rounded-xl"
          aria-label="Bold"
        >
          <span class="text-2xl leading-none font-bold">Aa</span>
          <span class="text-xs text-muted-foreground">Bold</span>
        </ToggleGroupItem>
      </ToggleGroup>
      <FieldDescription>
        Use
        <code class="rounded-md bg-muted px-1 py-0.5 font-mono">font-{{this.fontWeight}}</code>
        to set the font weight.
      </FieldDescription>
    </Field>
  </template>
}
