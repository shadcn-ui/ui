const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive) / <alpha-value>)",
          foreground: "hsl(var(--destructive-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: `var(--radius)`,
        md: `calc(var(--radius) - 2px)`,
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },

        rotateCounterClockwise: {
          "0%": {
            transform: "rotate(0)",
          },
          to: {
            transform: "rotate(-360deg)",
          },
        },
        rotateClockwise: {
          "0%": {
            transform: "rotate(0)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        twinkling: {
          "0%": {
            background: "rgba(255, 255, 255, 0)",
            transform: "translateZ(0) translate(0) scale(1)",
          },
          "10%": {
            background: "rgb(255, 255, 255)",
          },
          to: {
            background: "rgb(255, 255, 255)",
            transform: "translateZ(0) scale(0.5)",
          },
        },

        starsMovingAnimationUp: {
          '0%': {
            transform: 'translateZ(0) translateY(0)'
          },
          'to': {
            transform: 'translateZ(0) translateY(-2000px)'
          }
        },
        starsMovingAnimationDown: {
          '0%': {
            transform: 'translateZ(0) translateY(-1900px)'
          },
          'to': {
            transform: 'translateZ(0) translateY(0)'
          }
        },
        starsMovingAnimationLRDown: {
          '0%': {
            transform: 'translateZ(0) translateX(-1000px) translateY(-1000px)'
          },
          'to': {
            transform: 'translateZ(0) translateX(0) translateY(0)'
          }
        },
        starsMovingAnimationLRUp: {
          '0%': {
            transform: 'translateZ(0) translateX(-1000px) translateY(0)'
          },
          'to': {
            transform: 'translateZ(0) translateX(0) translateY(-1000px)'
          }
        },
        starsMovingAnimationRLDown: {
          '0%': {
            transform: 'translateZ(0) translateX(0) translateY(-1000px)'
          },
          'to': {
            transform: 'translateZ(0) translateX(-1000px) translateY(0)'
          }
        },
        starsMovingAnimationRLUp: {
          '0%': {
            transform: 'translateZ(0) translateX(0) translateY(0)'
          },
          'to': {
            transform: 'translateZ(0) translateX(-1000px) translateY(-1000px)'
          }
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "rotate-clockwise": "rotateClockwise 70s linear infinite",
        "rotate-counter-clockwise":
          "rotateCounterClockwise 70s linear infinite",
        twinkling: "twinkling 13s linear infinite",

        starsMovingAnimationUp: 'starsMovingAnimationUp linear infinite',
        starsMovingAnimationDown: 'starsMovingAnimationDown linear infinite',
        starsMovingAnimationLRDown: 'starsMovingAnimationLRDown linear infinite',
        starsMovingAnimationLRUp: 'starsMovingAnimationLRUp linear infinite',
        starsMovingAnimationRLDown: 'starsMovingAnimationRLDown linear infinite',
        starsMovingAnimationRLUp: 'starsMovingAnimationRLUp linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
}
