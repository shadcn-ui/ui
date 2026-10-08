---
title: Next.js
description: Create a new Next.js project with RTL support.
---

<Callout className="mb-6 border-emerald-600 bg-emerald-100 dark:border-emerald-400 dark:bg-emerald-900">

**Starting a new project?** Use [shadcn/create](/create?template=next&base=base&rtl=true) for a fully configured Next.js app with custom themes, Base UI or Radix, and icon libraries.

</Callout>

<Steps>

### Create Project

Create a new project using the `--rtl` flag and the `next` template.

**You can skip this step if you have already created a project using [shadcn/create](/create?template=next&base=base&rtl=true).**

```bash
npx shadcn@latest create --template next --rtl
```

This will create a `components.json` file with the `rtl: true` flag.

```json title="components.json" showLineNumbers {4}
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "base-nova",
  "rtl": true
}
```

### Add DirectionProvider

Wrap your application with the `DirectionProvider` component with the `direction="rtl"` prop.

Then add the `dir="rtl"` and `lang="ar"` attributes to the `html` tag. Update `lang="ar"` to your target language.

```tsx title="app/layout.tsx" showLineNumbers {1,9-13}
import { DirectionProvider } from "@/components/ui/direction"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  )
}
```

### Add Font

For the best RTL experience, we recommend using fonts that have proper support for your target language. [Noto](https://fonts.google.com/noto) is a great font family for this and it pairs well with Inter and Geist.

```tsx title="app/layout.tsx" showLineNumbers {1,5-8,16}
import { Noto_Sans_Arabic } from "next/font/google"

import { DirectionProvider } from "@/components/ui/direction"

const fontSans = Noto_Sans_Arabic({
  subsets: ["arabic"],
  variable: "--font-sans",
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl" className={fontSans.variable}>
      <body>
        <DirectionProvider direction="rtl">{children}</DirectionProvider>
      </body>
    </html>
  )
}
```

For other languages, eg. Hebrew, you can use the `Noto_Sans_Hebrew` font.

### Add Components

You are now ready to add components to your project. The CLI will take care of handling RTL support for you.

```bash
npx shadcn@latest add item
```

</Steps>
