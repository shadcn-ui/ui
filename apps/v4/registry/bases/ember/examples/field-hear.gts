import { fn } from '@ember/helper';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Card, CardContent } from '@/ui/card';
import { Checkbox } from '@/ui/checkbox';
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from '@/ui/field';

const options = [
  {
    label: 'Social Media',
    value: 'social-media',
  },
  {
    label: 'Search Engine',
    value: 'search-engine',
  },
  {
    label: 'Referral',
    value: 'referral',
  },
  {
    label: 'Other',
    value: 'other',
  },
];

class FieldHear extends Component {
  @tracked checkedOptions = new Set(['social-media']);

  isChecked = (value: string) => {
    return this.checkedOptions.has(value);
  };

  handleCheckedChange = (value: string, checked: boolean) => {
    if (checked) {
      this.checkedOptions.add(value);
    } else {
      this.checkedOptions.delete(value);
    }
    this.checkedOptions = new Set(this.checkedOptions);
  };

  <template>
    <Card @class="py-4 shadow-none">
      <CardContent @class="px-4">
        <form>
          <FieldGroup>
            <FieldSet @class="gap-4">
              <FieldLegend>How did you hear about us?</FieldLegend>
              <FieldDescription @class="line-clamp-1">
                Select the option that best describes how you heard about us.
              </FieldDescription>
              <FieldGroup
                @class="flex flex-row flex-wrap gap-2 [--radius:9999rem]"
              >
                {{#each options as |option|}}
                  <FieldLabel @class="!w-fit" @for={{option.value}}>
                    <Field
                      @class="gap-1.5 overflow-hidden !px-3 !py-1.5 transition-all duration-100 ease-linear group-has-data-[state=checked]/field-label:!px-2"
                      @orientation="horizontal"
                    >
                      <Checkbox
                        @checked={{this.isChecked option.value}}
                        @class="-ml-6 -translate-x-1 rounded-full transition-all duration-100 ease-linear data-[state=checked]:ml-0 data-[state=checked]:translate-x-0"
                        @onCheckedChange={{fn
                          this.handleCheckedChange
                          option.value
                        }}
                        id={{option.value}}
                      />
                      <FieldTitle>{{option.label}}</FieldTitle>
                    </Field>
                  </FieldLabel>
                {{/each}}
              </FieldGroup>
            </FieldSet>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  </template>
}

export default FieldHear;
