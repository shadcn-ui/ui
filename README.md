# shadcn/ui

Beautifully designed components built with Radix UI and Tailwind CSS.

![hero](apps/www/public/og.jpg)

## Roadmap

> **Warning**
> This is work in progress. I'm building this in public. You can follow the progress on Twitter [@shadcn](https://twitter.com/shadcn).

- [ ] Toast
- [ ] Toggle Group
- [ ] Toolbar
- [x] ~Toggle~
- [x] ~Navigation Menu~
- [x] ~Figma~

## Get Started

Starting a new project? Check out the Next.js template.

```bash
npx create-next-app -e https://github.com/shadcn/next-template
```

### Features

- Radix UI Primitives
- Tailwind CSS
- Fonts with `@next/font`
- Icons from [Lucide](https://lucide.dev)
- Dark mode with `next-themes`
- Automatic import sorting with `@ianvs/prettier-plugin-sort-imports`

### Tailwind CSS Features

- Class merging with `tailwind-merge`
- Animation with `tailwindcss-animate`
- Conditional classes with `clsx`
- Variants with `class-variance-authority`
- Automatic class sorting with `eslint-plugin-tailwindcss`

### Development

This project is configured to use [pnpm](https://pnpm.io/) .

Use `pnpm install` to download dependencies.

Duplicate `.env.example` and rename it to `.env.local` (modify the default `3000` port according to your situation.)

Run `pnpm dev` , then you can see it at `localhost:3000`

#### Troubleshooting

Failed to fetch `Inter` from Google Fonts.
pnpm run build exited
https://github.com/shadcn/ui/issues/62

## License

Licensed under the [MIT license](https://github.com/shadcn/ui/blob/main/LICENSE.md).
