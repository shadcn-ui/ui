import { fn } from '@ember/helper';
import { on } from '@ember/modifier';
import { htmlSafe } from '@ember/template';
import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';

import { cn } from '@/lib/utils';

interface SliderSignature {
  Element: HTMLDivElement;
  Args: {
    value?: number[];
    defaultValue?: number[];
    onValueChange?: (value: number[]) => void;
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    orientation?: 'horizontal' | 'vertical';
    class?: string;
  };
}

class Slider extends Component<SliderSignature> {
  @tracked internalValue?: number[];

  get value() {
    return (
      this.args.value ?? this.internalValue ?? this.args.defaultValue ?? [0]
    );
  }

  get min() {
    return this.args.min ?? 0;
  }

  get max() {
    return this.args.max ?? 100;
  }

  get step() {
    return this.args.step ?? 1;
  }

  get orientation() {
    return this.args.orientation ?? 'horizontal';
  }

  get values() {
    const val = this.value;
    const def = this.args.defaultValue;
    return Array.isArray(val) ? val : Array.isArray(def) ? def : [this.min];
  }

  get rangePercentage() {
    if (this.values.length === 0) return { start: 0, width: 0 };
    if (this.values.length === 1) {
      const value = this.values[0];
      if (value === undefined) return { start: 0, width: 0 };
      const start = 0;
      const end = ((value - this.min) / (this.max - this.min)) * 100;
      return { start, width: end };
    }
    const minVal = Math.min(...this.values);
    const maxVal = Math.max(...this.values);
    const start = ((minVal - this.min) / (this.max - this.min)) * 100;
    const end = ((maxVal - this.min) / (this.max - this.min)) * 100;
    return { start, width: end - start };
  }

  get rangeStyle() {
    const { start, width } = this.rangePercentage;
    if (this.orientation === 'vertical') {
      return htmlSafe(`bottom: ${start}%; height: ${width}%`);
    }
    return htmlSafe(`left: ${start}%; width: ${width}%`);
  }

  thumbStyle = (index: number) => {
    const val = this.values[index] ?? 0;
    const percentage = ((val - this.min) / (this.max - this.min)) * 100;
    if (this.orientation === 'vertical') {
      return htmlSafe(`bottom: ${percentage}%; transform: translateY(50%)`);
    }
    return htmlSafe(`left: ${percentage}%; transform: translateX(-50%)`);
  };

  handleInput = (index: number, event: Event) => {
    const target = event.target as HTMLInputElement;
    const newValue = [...this.values];
    newValue[index] = parseFloat(target.value);
    this.internalValue = newValue;
    this.args.onValueChange?.(newValue);
  };

  handleThumbPointerDown = (index: number, event: PointerEvent) => {
    if (this.args.disabled) return;

    event.preventDefault();
    const slider = (event.currentTarget as HTMLElement).parentElement;
    if (!slider) return;

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    const updateValue = (clientPos: number) => {
      const rect = slider.getBoundingClientRect();
      let percentage: number;

      if (this.orientation === 'vertical') {
        percentage = 1 - (clientPos - rect.top) / rect.height;
      } else {
        percentage = (clientPos - rect.left) / rect.width;
      }

      percentage = Math.max(0, Math.min(1, percentage));
      const rawValue = this.min + percentage * (this.max - this.min);
      const steppedValue = Math.round(rawValue / this.step) * this.step;
      const clampedValue = Math.max(this.min, Math.min(this.max, steppedValue));

      const newValue = [...this.values];
      newValue[index] = clampedValue;
      this.internalValue = newValue;
      this.args.onValueChange?.(newValue);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateValue(this.orientation === 'vertical' ? e.clientY : e.clientX);
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  handleTrackClick = (event: PointerEvent) => {
    if (this.args.disabled) return;

    event.preventDefault();
    const target = event.currentTarget as HTMLElement;

    const rect = target.getBoundingClientRect();
    let percentage: number;

    if (this.orientation === 'vertical') {
      percentage = 1 - (event.clientY - rect.top) / rect.height;
    } else {
      percentage = (event.clientX - rect.left) / rect.width;
    }

    percentage = Math.max(0, Math.min(1, percentage));
    const rawValue = this.min + percentage * (this.max - this.min);
    const steppedValue = Math.round(rawValue / this.step) * this.step;
    const clampedValue = Math.max(this.min, Math.min(this.max, steppedValue));

    let closestIndex = 0;
    let closestDistance = Math.abs((this.values[0] ?? 0) - clampedValue);

    for (let i = 1; i < this.values.length; i++) {
      const distance = Math.abs((this.values[i] ?? 0) - clampedValue);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = i;
      }
    }

    const newValue = [...this.values];
    newValue[closestIndex] = clampedValue;
    this.internalValue = newValue;
    this.args.onValueChange?.(newValue);

    (event.currentTarget as HTMLElement).setPointerCapture(event.pointerId);

    const updateValue = (clientPos: number) => {
      const rect = target.getBoundingClientRect();
      let percentage: number;

      if (this.orientation === 'vertical') {
        percentage = 1 - (clientPos - rect.top) / rect.height;
      } else {
        percentage = (clientPos - rect.left) / rect.width;
      }

      percentage = Math.max(0, Math.min(1, percentage));
      const rawValue = this.min + percentage * (this.max - this.min);
      const steppedValue = Math.round(rawValue / this.step) * this.step;
      const clampedValue = Math.max(this.min, Math.min(this.max, steppedValue));

      const newValue = [...this.values];
      newValue[closestIndex] = clampedValue;
      this.internalValue = newValue;
      this.args.onValueChange?.(newValue);
    };

    const handlePointerMove = (e: PointerEvent) => {
      updateValue(this.orientation === 'vertical' ? e.clientY : e.clientX);
    };

    const handlePointerUp = () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };

    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);
  };

  <template>
    <div
      class={{cn
        "relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-[orientation=vertical]:h-full data-[orientation=vertical]:min-h-44 data-[orientation=vertical]:w-auto data-[orientation=vertical]:flex-col"
        @class
      }}
      data-disabled={{if @disabled "true"}}
      data-orientation={{this.orientation}}
      data-slot="slider"
      ...attributes
    >
      {{! template-lint-disable no-invalid-interactive no-pointer-down-event-binding }}
      <div
        class="bg-muted relative grow overflow-hidden rounded-full data-[orientation=horizontal]:h-1.5 data-[orientation=horizontal]:w-full data-[orientation=vertical]:h-full data-[orientation=vertical]:w-1.5"
        data-orientation={{this.orientation}}
        data-slot="slider-track"
        {{on "pointerdown" this.handleTrackClick}}
      >
        <div
          class="bg-primary absolute data-[orientation=horizontal]:h-full data-[orientation=vertical]:w-full"
          data-orientation={{this.orientation}}
          data-slot="slider-range"
          style={{this.rangeStyle}}
        ></div>
      </div>
      {{#each this.values as |val index|}}
        {{! template-lint-disable no-pointer-down-event-binding }}
        <div
          class="border-primary ring-ring/50 absolute block size-4 shrink-0 rounded-full border bg-white shadow-sm transition-[color,box-shadow] hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden disabled:pointer-events-none disabled:opacity-50 cursor-pointer"
          data-slot="slider-thumb"
          style={{this.thumbStyle index}}
          tabindex={{if @disabled "-1" "0"}}
          {{on "pointerdown" (fn this.handleThumbPointerDown index)}}
        ></div>
      {{/each}}
    </div>
  </template>
}

export { Slider };
