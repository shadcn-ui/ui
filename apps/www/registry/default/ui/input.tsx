import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, icon, iconPosition = 'left', ...props }, ref) => {
    const paddingLeft = iconPosition === 'left' && icon ? 'pl-10' : '';
    const paddingRight = iconPosition === 'right' && icon ? 'pr-10' : '';

    const inputClasses = cn(
      'flex h-10 w-full rounded-md border-0 bg-background px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50',
      paddingLeft,
      paddingRight,
      className
    );

    return (
      <div
        className={`w-full relative ${
          iconPosition === 'right' ? 'flex-row-reverse' : ''
        }`}
      >
        {icon && (
          <div
            className={`absolute inset-y-0 ${
              iconPosition === 'right' ? 'right-0' : 'left-0'
            } flex items-center ${iconPosition === 'right' ? 'pr-3' : 'pl-3'}`}
          >
            {icon}
          </div>
        )}
        <input type={type} className={inputClasses} ref={ref} {...props} />
      </div>
    );
  }
);

Input.displayName = 'Input';

export { Input };
