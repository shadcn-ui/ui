import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from '@/ember-ui/field';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/ember-ui/select';
import { Switch } from '@/ember-ui/switch';

export default class SelectAlignItem extends Component {
  @tracked alignItemWithTrigger = true;

  handleCheckedChange = (checked: boolean) => {
    this.alignItemWithTrigger = checked;
  };

  <template>
    <FieldGroup @class="w-full max-w-xs">
      <Field @orientation="horizontal">
        <FieldContent>
          <FieldLabel @for="align-item">Align Item</FieldLabel>
          <FieldDescription>Toggle to align the item with the trigger.</FieldDescription>
        </FieldContent>
        <Switch
          id="align-item"
          @checked={{this.alignItemWithTrigger}}
          @onCheckedChange={{this.handleCheckedChange}}
        />
      </Field>
      <Field>
        <Select @defaultValue="banana">
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent @position={{if this.alignItemWithTrigger "item-aligned" "popper"}}>
            <SelectGroup>
              <SelectItem @value="apple">Apple</SelectItem>
              <SelectItem @value="banana">Banana</SelectItem>
              <SelectItem @value="blueberry">Blueberry</SelectItem>
              <SelectItem @value="grapes">Grapes</SelectItem>
              <SelectItem @value="pineapple">Pineapple</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldGroup>
  </template>
}
