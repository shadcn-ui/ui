'use client';

import * as React from 'react';
import * as SwitchPrimitives from '@radix-ui/react-switch';
import { cn } from '@/lib/utils';

type SwitchProps = {
  className?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
};

const Switch = React.forwardRef<HTMLButtonElement, SwitchProps>(({ className, ...props }, ref) => {
  const RootAsJSX = SwitchPrimitives.Root as React.ElementType;
  const ThumbAsJSX = SwitchPrimitives.Thumb as React.ElementType;

  return (
    <RootAsJSX
      className={cn(
        'peer inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input',
        className
      )}
      {...props}
      ref={ref}
    >
      <ThumbAsJSX
        className={cn(
          'pointer-events-none block h-4 w-4 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-4 data-[state=unchecked]:translate-x-0'
        )}
      />
    </RootAsJSX>
  );
});

Switch.displayName = 'Switch';

export { Switch };
