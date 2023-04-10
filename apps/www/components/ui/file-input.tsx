import * as React from 'react';

import { cn } from '@/lib/utils';
import { buttonVariants } from './button';

export type FileInputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'>;

/** A way to reuse button variants applying `file:` modifier, If it can be done in a easier way, please tell me! */
const fileButtonClasses = buttonVariants({ variant: 'subtle', size: 'sm' })
    .split(' ')
    .map((c) => {
        if (c.includes(':')) {
            const modifiersAndClass = c.split(':');
            const lastIndex = modifiersAndClass.length - 1;
            const actualClass = modifiersAndClass[lastIndex];
            modifiersAndClass[lastIndex] = `file:${actualClass}`;
            return modifiersAndClass.join(':');
        }

        return `file:${c}`;
    })
    .join(' ');

const FileInput = React.forwardRef<HTMLInputElement, FileInputProps>(
    ({ className, ...props }, ref) => {
        return (
            <input
                type="file"
                className={cn(
                    'flex w-full rounded-md border border-slate-300 bg-transparent py-2 px-3 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-50 dark:focus:ring-slate-400 dark:focus:ring-offset-slate-900',
                    `${fileButtonClasses} file:mr-2 file:h-8 file:border-0`,
                    className,
                )}
                ref={ref}
                {...props}
            />
        );
    },
);
FileInput.displayName = 'FileInput';

export { FileInput };