import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { on } from '@ember/modifier';

import { Button } from '@/ember-ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/ember-ui/card';
import { Input } from '@/ember-ui/input';
import { Label } from '@/ember-ui/label';
import { ToggleGroup, ToggleGroupItem } from '@/ember-ui/toggle-group';

const spacingOptions = [
  { className: '[--card-spacing:--spacing(4)]', label: '16px', value: '4' },
  { className: '[--card-spacing:--spacing(5)]', label: '20px', value: '5' },
  { className: '[--card-spacing:--spacing(6)]', label: '24px', value: '6' },
  { className: '[--card-spacing:--spacing(8)]', label: '32px', value: '8' },
];

export default class CardSpacing extends Component {
  @tracked spacing = '4';

  get selectedClassName() {
    return spacingOptions.find((o) => o.value === this.spacing)?.className;
  }

  handleValueChange = (value: string) => {
    if (value) this.spacing = value;
  };

  <template>
    <div class="mx-auto grid w-full max-w-sm gap-4">
      <ToggleGroup
        @type="single"
        @value={{this.spacing}}
        @onValueChange={{this.handleValueChange}}
        @variant="outline"
        @size="sm"
        @class="justify-center"
      >
        {{#each spacingOptions as |option|}}
          <ToggleGroupItem @value={{option.value}}>
            {{option.label}}
          </ToggleGroupItem>
        {{/each}}
      </ToggleGroup>
      <Card @class={{this.selectedClassName}}>
        <CardHeader>
          <CardTitle>Login to your account</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
          <CardAction>
            <Button @variant="link">Sign Up</Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <form>
            <div class="flex flex-col gap-6">
              <div class="grid gap-2">
                <Label @for="email-spacing">Email</Label>
                <Input
                  id="email-spacing"
                  placeholder="m@example.com"
                  required
                  type="email"
                />
              </div>
              <div class="grid gap-2">
                <div class="flex items-center">
                  <Label @for="password-spacing">Password</Label>
                  <a
                    class="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    href="#"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input id="password-spacing" required type="password" />
              </div>
            </div>
          </form>
        </CardContent>
        <CardFooter @class="flex-col gap-2">
          <Button @class="w-full" type="submit">
            Login
          </Button>
          <Button @class="w-full" @variant="outline">
            Login with Google
          </Button>
        </CardFooter>
      </Card>
    </div>
  </template>
}
