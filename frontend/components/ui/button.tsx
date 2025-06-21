// frontend/components/ui/button.tsx
'use client';

import { ButtonHTMLAttributes, ReactNode } from 'react';
import clsx from 'clsx';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  className?: string;
  variant?: 'accent' | 'outline' | 'ghost' | 'danger' | 'glass';
  loading?: boolean;
  loadingText?: string;
}

export function Button({
  children,
  className,
  variant = 'accent',
  loading = false,
  loadingText = 'Загрузка...',
  disabled,
  ...props
}: ButtonProps) {
  const base =
    'inline-flex items-center gap-2 font-semibold justify-center px-5 py-2.5 rounded-2xl transition-all duration-150 select-none text-base focus-visible:ring-2 focus-visible:ring-cyan-400 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]';

  const styles = {
    accent:
      'bg-cyan-400 hover:bg-cyan-300 text-[#101828] shadow-lg',
    outline:
      'bg-transparent border-2 border-cyan-400 text-cyan-300 hover:bg-cyan-400/10 hover:text-white',
    ghost:
      'bg-transparent text-cyan-100 hover:bg-cyan-400/10',
    danger:
      'bg-pink-500 hover:bg-pink-400 text-white shadow',
    glass:
      'bg-white/10 border border-white/20 backdrop-blur-xl text-white hover:bg-cyan-400/20 hover:text-cyan-100 shadow-lg'
  };

  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={clsx(
        base,
        styles[variant],
        loading && 'pointer-events-none relative',
        className
      )}
    >
      {loading ? (
        <>
          <span className="inline-block animate-spin mr-2 w-5 h-5 border-2 border-cyan-300 border-t-transparent rounded-full" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}
