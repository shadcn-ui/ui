import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Geist', 'var(--font-geist-sans)', '-apple-system', 'sans-serif'],
        mono: ['Geist Mono', 'var(--font-geist-mono)', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['11px', { lineHeight: '1.4',  letterSpacing:  '0.01em'  }],
        xs:    ['12px', { lineHeight: '1.5',  letterSpacing: '-0.005em' }],
        sm:    ['13px', { lineHeight: '1.55', letterSpacing: '-0.008em' }],
        base:  ['14px', { lineHeight: '1.6',  letterSpacing: '-0.011em' }],
        md:    ['15px', { lineHeight: '1.55', letterSpacing: '-0.014em' }],
        lg:    ['16px', { lineHeight: '1.5',  letterSpacing: '-0.016em' }],
        xl:    ['20px', { lineHeight: '1.35', letterSpacing: '-0.022em' }],
        '2xl': ['24px', { lineHeight: '1.2',  letterSpacing: '-0.026em' }],
        '3xl': ['30px', { lineHeight: '1.15', letterSpacing: '-0.032em' }],
      },
      borderRadius: {
        xs:      '3px',
        sm:      '5px',
        DEFAULT: '8px',
        md:      '8px',
        lg:      '10px',
        xl:      '14px',
        '2xl':   '20px',
        full:    '9999px',
      },
      colors: {
        border:     'rgb(var(--border) / <alpha-value>)',
        input:      'rgb(var(--input) / <alpha-value>)',
        ring:       'rgb(var(--ring) / <alpha-value>)',
        background: 'rgb(var(--background) / <alpha-value>)',
        foreground: 'rgb(var(--foreground) / <alpha-value>)',
        primary: {
          DEFAULT:    'rgb(var(--primary) / <alpha-value>)',
          foreground: 'rgb(var(--primary-foreground) / <alpha-value>)',
        },
        secondary: {
          DEFAULT:    'rgb(var(--secondary) / <alpha-value>)',
          foreground: 'rgb(var(--secondary-foreground) / <alpha-value>)',
        },
        destructive: {
          DEFAULT:    'rgb(var(--destructive) / <alpha-value>)',
          foreground: 'rgb(var(--destructive-foreground) / <alpha-value>)',
        },
        muted: {
          DEFAULT:    'rgb(var(--muted) / <alpha-value>)',
          foreground: 'rgb(var(--muted-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT:    'rgb(var(--accent) / <alpha-value>)',
          foreground: 'rgb(var(--accent-foreground) / <alpha-value>)',
        },
        card: {
          DEFAULT:    'rgb(var(--card) / <alpha-value>)',
          foreground: 'rgb(var(--card-foreground) / <alpha-value>)',
        },
        popover: {
          DEFAULT:    'rgb(var(--popover) / <alpha-value>)',
          foreground: 'rgb(var(--popover-foreground) / <alpha-value>)',
        },
      },
      boxShadow: {
        xs:      '0 1px 2px rgb(0 0 0 / 0.04)',
        sm:      '0 1px 3px rgb(0 0 0 / 0.06), 0 1px 2px rgb(0 0 0 / 0.04)',
        DEFAULT: '0 2px 6px rgb(0 0 0 / 0.08), 0 1px 3px rgb(0 0 0 / 0.05)',
        md:      '0 4px 10px rgb(0 0 0 / 0.09), 0 2px 4px rgb(0 0 0 / 0.05)',
        lg:      '0 8px 20px rgb(0 0 0 / 0.1), 0 4px 8px rgb(0 0 0 / 0.05)',
        xl:      '0 16px 36px rgb(0 0 0 / 0.12), 0 8px 16px rgb(0 0 0 / 0.05)',
        none:    'none',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to:   { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to:   { height: '0' },
        },
        'fade-in':   { from: { opacity: '0' }, to: { opacity: '1' } },
        'fade-out':  { from: { opacity: '1' }, to: { opacity: '0' } },
        'fade-up':   { from: { opacity: '0', transform: 'translateY(5px)'  }, to: { opacity: '1', transform: 'translateY(0)' } },
        'fade-down': { from: { opacity: '0', transform: 'translateY(-5px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        'scale-in':  { from: { opacity: '0', transform: 'translate(-50%,-50%) scale(0.97)' }, to: { opacity: '1', transform: 'translate(-50%,-50%) scale(1)' } },
        'scale-out': { from: { opacity: '1', transform: 'translate(-50%,-50%) scale(1)' }, to: { opacity: '0', transform: 'translate(-50%,-50%) scale(0.97)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 180ms cubic-bezier(0.16,1,0.3,1)',
        'accordion-up':   'accordion-up 150ms cubic-bezier(0.4,0,1,1)',
        'fade-in':        'fade-in 150ms cubic-bezier(0.16,1,0.3,1) both',
        'fade-out':       'fade-out 100ms cubic-bezier(0.4,0,1,1) both',
        'fade-up':        'fade-up 150ms cubic-bezier(0.16,1,0.3,1) both',
        'fade-down':      'fade-down 150ms cubic-bezier(0.16,1,0.3,1) both',
        'scale-in':       'scale-in 150ms cubic-bezier(0.16,1,0.3,1) both',
        'scale-out':      'scale-out 100ms cubic-bezier(0.4,0,1,1) both',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}

export default config
