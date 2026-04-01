import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ui/button';
import {
  Field,
  FieldContent,
  FieldError,
  FieldLabel,
} from '@/ui/field';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/ui/native-select';

export default class NativeSelectFormDemo extends Component {
  @tracked selectedRole = '';
  @tracked errorMessage = '';

  handleSubmit = (event: Event) => {
    event.preventDefault();

    if (!this.selectedRole) {
      this.errorMessage = 'Please select a role';
      return;
    }

    this.errorMessage = '';
    alert(`Selected role: ${this.selectedRole}`);
  };

  handleChange = (event: Event) => {
    const target = event.target as HTMLSelectElement;
    this.selectedRole = target.value;
    if (this.errorMessage) {
      this.errorMessage = '';
    }
  };

  <template>
    <form {{on "submit" this.handleSubmit}} class="w-full max-w-sm space-y-4">
      <Field @invalid={{if this.errorMessage true false}}>
        <FieldLabel>Role</FieldLabel>
        <FieldContent>
          <NativeSelect
            aria-invalid={{if this.errorMessage "true" "false"}}
            value={{this.selectedRole}}
            {{on "change" this.handleChange}}
          >
            <NativeSelectOption value="">Select a role</NativeSelectOption>
            <NativeSelectOption value="admin">Admin</NativeSelectOption>
            <NativeSelectOption value="editor">Editor</NativeSelectOption>
            <NativeSelectOption value="viewer">Viewer</NativeSelectOption>
            <NativeSelectOption value="guest">Guest</NativeSelectOption>
          </NativeSelect>
          {{#if this.errorMessage}}
            <FieldError>{{this.errorMessage}}</FieldError>
          {{/if}}
        </FieldContent>
      </Field>
      <Button type="submit">Submit</Button>
    </form>
  </template>
}
