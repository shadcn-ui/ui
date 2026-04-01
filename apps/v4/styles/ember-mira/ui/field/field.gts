import Component from '@glimmer/component';

import { Label } from '@/ui/label';
import { Separator } from '@/ui/separator';
import { cn } from '@/lib/utils';

import type { TOC } from '@ember/component/template-only';

interface FieldSetSignature {
  Element: HTMLFieldSetElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldSet extends Component<FieldSetSignature> {
  get classes() {
    return cn(
      'flex flex-col gap-6',
      'has-[>[data-slot=checkbox-group]]:gap-3 has-[>[data-slot=radio-group]]:gap-3',
      this.args.class
    );
  }

  <template>
    <fieldset class={{this.classes}} data-slot="field-set" ...attributes>
      {{yield}}
    </fieldset>
  </template>
}

interface FieldLegendSignature {
  Element: HTMLLegendElement;
  Args: {
    class?: string;
    variant?: 'legend' | 'label';
  };
  Blocks: {
    default: [];
  };
}

class FieldLegend extends Component<FieldLegendSignature> {
  get variant() {
    return this.args.variant ?? 'legend';
  }

  get classes() {
    return cn(
      'mb-3 font-medium',
      'data-[variant=legend]:text-base',
      'data-[variant=label]:text-sm',
      this.args.class
    );
  }

  <template>
    <legend
      class={{this.classes}}
      data-slot="field-legend"
      data-variant={{this.variant}}
      ...attributes
    >
      {{yield}}
    </legend>
  </template>
}

interface FieldGroupSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldGroup extends Component<FieldGroupSignature> {
  get classes() {
    return cn(
      'group/field-group @container/field-group flex w-full flex-col gap-7 data-[slot=checkbox-group]:gap-3 [&>[data-slot=field-group]]:gap-4',
      this.args.class
    );
  }

  <template>
    <div class={{this.classes}} data-slot="field-group" ...attributes>
      {{yield}}
    </div>
  </template>
}

type Orientation = 'vertical' | 'horizontal' | 'responsive';

interface FieldSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    orientation?: Orientation;
    invalid?: boolean;
  };
  Blocks: {
    default: [];
  };
}

function fieldVariants(
  orientation: Orientation = 'vertical',
  className?: string
): string {
  const baseClasses =
    'group/field flex w-full gap-3 data-[invalid=true]:text-destructive';

  const orientationClasses: Record<Orientation, string> = {
    vertical: 'flex-col [&>*]:w-full [&>.sr-only]:w-auto',
    horizontal: [
      'flex-row items-center',
      '[&>[data-slot=field-label]]:flex-auto',
      'has-[>[data-slot=field-content]]:items-start has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    ].join(' '),
    responsive: [
      'flex-col [&>*]:w-full [&>.sr-only]:w-auto @md/field-group:flex-row @md/field-group:items-center @md/field-group:[&>*]:w-auto',
      '@md/field-group:[&>[data-slot=field-label]]:flex-auto',
      '@md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px',
    ].join(' '),
  };

  return cn(baseClasses, orientationClasses[orientation], className);
}

class Field extends Component<FieldSignature> {
  get orientation() {
    return this.args.orientation ?? 'vertical';
  }

  get invalid() {
    return this.args.invalid ? 'true' : undefined;
  }

  get classes() {
    return fieldVariants(this.orientation, this.args.class);
  }

  <template>
    <div
      class={{this.classes}}
      data-invalid={{this.invalid}}
      data-orientation={{this.orientation}}
      data-slot="field"
      role="group"
      ...attributes
    >
      {{yield}}
    </div>
  </template>
}

interface FieldContentSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldContent extends Component<FieldContentSignature> {
  get classes() {
    return cn(
      'group/field-content flex flex-1 flex-col gap-1.5 leading-snug',
      this.args.class
    );
  }

  <template>
    <div class={{this.classes}} data-slot="field-content" ...attributes>
      {{yield}}
    </div>
  </template>
}

interface FieldLabelSignature {
  Element: HTMLLabelElement;
  Args: {
    class?: string;
    for?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldLabel extends Component<FieldLabelSignature> {
  get classes() {
    return cn(
      'group/field-label peer/field-label flex w-fit gap-2 leading-snug group-data-[disabled=true]/field:opacity-50',
      'has-[>[data-slot=field]]:w-full has-[>[data-slot=field]]:flex-col has-[>[data-slot=field]]:rounded-md has-[>[data-slot=field]]:border [&>[data-slot=field]]:p-4',
      'has-data-[state=checked]:bg-primary/5 has-data-[state=checked]:border-primary dark:has-data-[state=checked]:bg-primary/10',
      this.args.class
    );
  }

  <template>
    <Label
      @class={{this.classes}}
      @for={{@for}}
      data-slot="field-label"
      ...attributes
    >
      {{yield}}
    </Label>
  </template>
}

interface FieldTitleSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldTitle extends Component<FieldTitleSignature> {
  get classes() {
    return cn(
      'flex w-fit items-center gap-2 text-sm leading-snug font-medium group-data-[disabled=true]/field:opacity-50',
      this.args.class
    );
  }

  <template>
    <div class={{this.classes}} data-slot="field-label" ...attributes>
      {{yield}}
    </div>
  </template>
}

interface FieldDescriptionSignature {
  Element: HTMLParagraphElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

class FieldDescription extends Component<FieldDescriptionSignature> {
  get classes() {
    return cn(
      'text-muted-foreground text-sm font-normal leading-normal group-has-[[data-orientation=horizontal]]/field:text-balance',
      'nth-last-2:-mt-1 last:mt-0 [[data-variant=legend]+&]:-mt-1.5',
      '[&>a:hover]:text-primary [&>a]:underline [&>a]:underline-offset-4',
      this.args.class
    );
  }

  <template>
    <p class={{this.classes}} data-slot="field-description" ...attributes>
      {{yield}}
    </p>
  </template>
}

interface FieldSeparatorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
  };
  Blocks: {
    default: [];
  };
}

const FieldSeparator: TOC<FieldSeparatorSignature> = <template>
  <div
    class={{cn
      "relative -my-2 h-5 text-sm group-data-[variant=outline]/field-group:-mb-2"
      @class
    }}
    data-content={{has-block}}
    data-slot="field-separator"
    ...attributes
  >
    <Separator @class="absolute inset-0 top-1/2" />
    {{#if (has-block)}}
      <span
        class="bg-background text-muted-foreground relative mx-auto block w-fit px-2"
        data-slot="field-separator-content"
      >
        {{yield}}
      </span>
    {{/if}}
  </div>
</template>;

interface FieldErrorSignature {
  Element: HTMLDivElement;
  Args: {
    class?: string;
    errors?: Array<{ message?: string } | undefined>;
  };
  Blocks: {
    default: [];
  };
}

class FieldError extends Component<FieldErrorSignature> {
  get uniqueErrors() {
    const errors = this.args.errors;
    if (!errors?.length) {
      return null;
    }

    const errorMap = new Map<string | undefined, { message?: string }>();
    for (const error of errors) {
      if (error?.message) {
        errorMap.set(error.message, error);
      }
    }

    return Array.from(errorMap.values());
  }

  get isSingleError() {
    return this.uniqueErrors?.length === 1;
  }

  get singleErrorMessage() {
    return this.uniqueErrors?.[0]?.message ?? null;
  }

  get isMultipleErrors() {
    return this.uniqueErrors && this.uniqueErrors.length > 1;
  }

  get classes() {
    return cn('text-destructive text-sm font-normal', this.args.class);
  }

  <template>
    {{#if (has-block)}}
      <div
        class={{this.classes}}
        data-slot="field-error"
        role="alert"
        ...attributes
      >
        {{yield}}
      </div>
    {{else if this.uniqueErrors}}
      <div
        class={{this.classes}}
        data-slot="field-error"
        role="alert"
        ...attributes
      >
        {{#if this.isSingleError}}
          {{this.singleErrorMessage}}
        {{else if this.isMultipleErrors}}
          <ul class="ml-4 flex list-disc flex-col gap-1">
            {{#each this.uniqueErrors as |error|}}
              {{#if error.message}}
                <li>{{error.message}}</li>
              {{/if}}
            {{/each}}
          </ul>
        {{/if}}
      </div>
    {{/if}}
  </template>
}

export {
  FieldSet,
  FieldLegend,
  Field,
  FieldGroup,
  FieldContent,
  FieldLabel,
  FieldDescription,
  FieldSeparator,
  FieldError,
  FieldTitle,
};
