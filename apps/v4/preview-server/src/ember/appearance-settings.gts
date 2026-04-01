import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { Button } from '@/ember-ui/button';
import { ButtonGroup } from '@/ember-ui/button-group';
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
  FieldTitle,
} from '@/ember-ui/field';
import { Input } from '@/ember-ui/input';
import { RadioGroup, RadioGroupItem } from '@/ember-ui/radio-group';
import { Switch } from '@/ember-ui/switch';

import Minus from '~icons/lucide/minus';
import Plus from '~icons/lucide/plus';

export default class AppearanceSettings extends Component {
  @tracked gpuCount = 8;
  @tracked wallpaperTinting = true;

  handleGpuAdjustment = (adjustment: number) => {
    this.gpuCount = Math.max(1, Math.min(99, this.gpuCount + adjustment));
  };

  handleGpuInputChange = (event: Event) => {
    const value = parseInt((event.target as HTMLInputElement).value, 10);
    if (!isNaN(value) && value >= 1 && value <= 99) {
      this.gpuCount = value;
    }
  };

  get isMinGpu() {
    return this.gpuCount <= 1;
  }

  get isMaxGpu() {
    return this.gpuCount >= 99;
  }

  handleWallpaperTintingChange = (checked: boolean) => {
    this.wallpaperTinting = checked;
  };

  <template>
    <FieldSet>
      <FieldGroup>
        <FieldSet>
          <FieldLegend>Compute Environment</FieldLegend>
          <FieldDescription>
            Select the compute environment for your cluster.
          </FieldDescription>
          <RadioGroup @defaultValue="kubernetes">
            <FieldLabel @for="kubernetes-r2h">
              <Field @orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Kubernetes</FieldTitle>
                  <FieldDescription>
                    Run GPU workloads on a K8s configured cluster. This is the
                    default.
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  @value="kubernetes"
                  aria-label="Kubernetes"
                  id="kubernetes-r2h"
                />
              </Field>
            </FieldLabel>
            <FieldLabel @for="vm-z4k">
              <Field @orientation="horizontal">
                <FieldContent>
                  <FieldTitle>Virtual Machine</FieldTitle>
                  <FieldDescription>
                    Access a VM configured cluster to run workloads. (Coming
                    soon)
                  </FieldDescription>
                </FieldContent>
                <RadioGroupItem
                  @value="vm"
                  aria-label="Virtual Machine"
                  id="vm-z4k"
                />
              </Field>
            </FieldLabel>
          </RadioGroup>
        </FieldSet>
        <FieldSeparator />
        <Field @orientation="horizontal">
          <FieldContent>
            <FieldLabel @for="number-of-gpus-f6l">Number of GPUs</FieldLabel>
            <FieldDescription>You can add more later.</FieldDescription>
          </FieldContent>
          <ButtonGroup>
            <Input
              @class="h-8 !w-14 font-mono"
              id="number-of-gpus-f6l"
              maxlength="3"
              size="3"
              value={{this.gpuCount}}
              {{on "input" this.handleGpuInputChange}}
            />
            <Button
              @disabled={{this.isMinGpu}}
              @size="icon-sm"
              @variant="outline"
              aria-label="Decrement"
              type="button"
              {{on "click" (fn this.handleGpuAdjustment -1)}}
            >
              <Minus />
            </Button>
            <Button
              @disabled={{this.isMaxGpu}}
              @size="icon-sm"
              @variant="outline"
              aria-label="Increment"
              type="button"
              {{on "click" (fn this.handleGpuAdjustment 1)}}
            >
              <Plus />
            </Button>
          </ButtonGroup>
        </Field>
        <FieldSeparator />
        <Field @orientation="horizontal">
          <FieldContent>
            <FieldLabel @for="tinting">Wallpaper Tinting</FieldLabel>
            <FieldDescription>
              Allow the wallpaper to be tinted.
            </FieldDescription>
          </FieldContent>
          <Switch
            @checked={{this.wallpaperTinting}}
            @onCheckedChange={{this.handleWallpaperTintingChange}}
            id="tinting"
          />
        </Field>
      </FieldGroup>
    </FieldSet>
  </template>
}
