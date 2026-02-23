---
title: Remix
description: Adding dark mode to your remix app.
---

<Steps>

## Modify your tailwind.css file

Add `:root[class~="dark"]` to your tailwind.css file. This will allow you to use the `dark` class on your html element to apply dark mode styles.

```css {2} title="app/tailwind.css" showLineNumbers
.dark,
:root[class~="dark"] {
  ...;
}
```

## Install remix-themes

Start by installing `remix-themes`:

```bash
npm install remix-themes
```

## Create a session storage and theme session resolver

```tsx title="app/sessions.server.tsx" showLineNumbers
import { createThemeSessionResolver } from "remix-themes"

// You can default to 'development' if process.env.NODE_ENV is not set
const isProduction = process.env.NODE_ENV === "production"

const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "theme",
    path: "/",
    httpOnly: true,
    sameSite: "lax",
    secrets: ["s3cr3t"],
    // Set domain and secure only if in production
    ...(isProduction
      ? { domain: "your-production-domain.com", secure: true }
      : {}),
  },
})

export const themeSessionResolver = createThemeSessionResolver(sessionStorage)
```

## Set up Remix Themes

Add the `ThemeProvider` to your root layout.

```tsx {1-3,6-11,15-22,25-26,28,33} title="app/root.tsx" showLineNumbers
import clsx from "clsx"
import { PreventFlashOnWrongTheme, ThemeProvider, useTheme } from "remix-themes"

import { themeSessionResolver } from "./sessions.server"

// Return the theme from the session storage using the loader
export async function loader({ request }: LoaderFunctionArgs) {
  const { getTheme } = await themeSessionResolver(request)
  return {
    theme: getTheme(),
  }
}
// Wrap your app with ThemeProvider.
// `specifiedTheme` is the stored theme in the session storage.
// `themeAction` is the action name that's used to change the theme in the session storage.
export default function AppWithProviders() {
  const data = useLoaderData<typeof loader>()
  return (
    <ThemeProvider specifiedTheme={data.theme} themeAction="/action/set-theme">
      <App />
    </ThemeProvider>
  )
}

export function App() {
  const data = useLoaderData<typeof loader>()
  const [theme] = useTheme()
  return (
    <html lang="en" className={clsx(theme)}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <PreventFlashOnWrongTheme ssrTheme={Boolean(data.theme)} />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        <LiveReload />
      </body>
    </html>
  )
}
```

## Add an action route

Create a file in `/routes/action.set-theme.ts`. Ensure that you pass the filename to the ThemeProvider component. This route it's used to store the preferred theme in the session storage when the user changes it.

```tsx title="app/routes/action.set-theme.ts" showLineNumbers
import { createThemeAction } from "remix-themes"

import { themeSessionResolver } from "./sessions.server"

export const action = createThemeAction(themeSessionResolver)
```

## Add a mode toggle

Place a mode toggle on your site to toggle between light and dark mode.

```tsx title="components/mode-toggle.tsx" showLineNumbers
import { Moon, Sun } from "lucide-react"
import { Theme, useTheme } from "remix-themes"

import { Button } from "./ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

export function ModeToggle() {
  const [, setTheme] = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme(Theme.LIGHT)}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme(Theme.DARK)}>
          Dark
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

</Steps>
