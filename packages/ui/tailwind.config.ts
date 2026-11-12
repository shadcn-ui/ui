import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'
import containerQueries from '@tailwindcss/container-queries'

const config: Config = {
  darkMode: ['class'],
  content: ['./src/**/*.{vue,ts}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        sans: ['"Vazirmatn Variable"', 'Vazirmatn', 'Tahoma', 'sans-serif'],
        display: ['"Vazirmatn Variable"', 'Vazirmatn', 'Tahoma', 'sans-serif'],
      },
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'collapsible-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-collapsible-content-height)' },
        },
        'collapsible-up': {
          from: { height: 'var(--radix-collapsible-content-height)' },
          to: { height: '0' },
        },
        'saaze-slide-in-from-start': {
          from: { transform: 'translateX(var(--saaze-slide-start-enter))' },
          to: { transform: 'translateX(0)' },
        },
        'saaze-slide-out-to-start': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(var(--saaze-slide-start-exit))' },
        },
        'saaze-slide-in-from-end': {
          from: { transform: 'translateX(var(--saaze-slide-end-enter))' },
          to: { transform: 'translateX(0)' },
        },
        'saaze-slide-out-to-end': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(var(--saaze-slide-end-exit))' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'collapsible-down': 'collapsible-down 0.2s ease-out',
        'collapsible-up': 'collapsible-up 0.2s ease-out',
        'saaze-slide-in-from-start': 'saaze-slide-in-from-start 0.5s ease-in-out',
        'saaze-slide-out-to-start': 'saaze-slide-out-to-start 0.3s ease-in-out',
        'saaze-slide-in-from-end': 'saaze-slide-in-from-end 0.5s ease-in-out',
        'saaze-slide-out-to-end': 'saaze-slide-out-to-end 0.3s ease-in-out',
      },
    },
  },
  plugins: [animate, containerQueries],
}

export default config
