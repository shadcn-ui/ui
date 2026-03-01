---
title: Remix
description: Install and configure shadcn/ui for Remix.
---

<Callout>

**Note:** This guide is for Remix. For React Router, see the [React Router](/docs/installation/react-router) guide.

</Callout>

<Steps>

### Create project

Start by creating a new Remix project using `create-remix`:

```bash
npx create-remix@latest my-app
```

### Run the CLI

Run the `shadcn` init command to setup your project:

```bash
npx shadcn@latest init
```

### Configure components.json

You will be asked a few questions to configure `components.json`:

```bash
Which color would you like to use as base color? › Neutral
```

### App structure

<Callout>

**Note**: This app structure is only a suggestion. You can place the files wherever you want.

</Callout>

- Place the UI components in the `app/components/ui` folder.
- Your own components can be placed in the `app/components` folder.
- The `app/lib` folder contains all the utility functions. We have a `utils.ts` where we define the `cn` helper.
- The `app/tailwind.css` file contains the global CSS.

### Install Tailwind CSS

```bash
npm install -D tailwindcss@latest autoprefixer@latest
```

Then we create a `postcss.config.js` file:

```js title="postcss.config.js" showLineNumbers
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

And finally we add the following to our `remix.config.js` file:

```js title="remix.config.js" {4-5} showLineNumbers
/** @type {import('@remix-run/dev').AppConfig} */
export default {
  ...
  tailwind: true,
  postcss: true,
  ...
};
```

### Add `tailwind.css` to your app

In your `app/root.tsx` file, import the `tailwind.css` file:

```js {1, 4} showLineNumbers title="app/root.tsx"
import styles from "./tailwind.css?url"

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: styles },
  ...(cssBundleHref ? [{ rel: "stylesheet", href: cssBundleHref }] : []),
]
```

### That's it

You can now start adding components to your project.

```bash
npx shadcn@latest add button
```

The command above will add the `Button` component to your project. You can then import it like this:

```tsx {1,6} showLineNumbers title="app/routes/index.tsx"
import { Button } from "~/components/ui/button"

export default function Home() {
  return (
    <div>
      <Button>Click me</Button>
    </div>
  )
}
```

</Steps>
