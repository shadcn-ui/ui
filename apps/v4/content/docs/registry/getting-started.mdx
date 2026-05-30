---
title: Getting Started
description: Learn how to get setup and run your own component registry.
---

This guide will walk you through the process of setting up your own component registry. It assumes you already have a project with components and would like to turn it into a registry.

If you're starting a new registry project, you can use the [registry template](https://github.com/shadcn-ui/registry-template) as a starting point. We have already configured it for you.

## Requirements

You are free to design and host your custom registry as you see fit. The only requirement is that your registry catalog and registry items must be valid JSON files that conform to the [registry schema specification](/docs/registry/registry-json) and [registry-item schema specification](/docs/registry/registry-item-json).

Your registry can be a Next.js, Vite, Vue, Svelte, PHP or any other framework as long as it supports serving JSON over HTTP.

If you'd like to see an example of a registry, we have a [template project](https://github.com/shadcn-ui/registry-template) for you to use as a starting point.

## registry.json

The `registry.json` is the entry point for the registry. It contains the registry's name, homepage, and defines all the items present in the registry.

Your registry must have this file (or JSON payload) present at the root of the registry endpoint. The registry endpoint is the URL where your registry is hosted.

Here's an example `registry.json` file:

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "A simple button component.",
      "files": [
        {
          "path": "components/ui/button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

## Structure your registry

You can structure your source registry in one of two ways:

- Define all items in a single root `registry.json`.
- Use a root `registry.json` with `include` to compose multiple `registry.json` files.

### Option A: Single registry.json

Create a `registry.json` file in the root of your project. Add all your registry items to the `items` array. This is the simplest way to define a registry.

```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "A simple button component.",
      "files": [
        {
          "path": "components/ui/button.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "hello-world",
      "type": "registry:block",
      "title": "Hello World",
      "description": "A simple hello world component.",
      "registryDependencies": ["button"],
      "files": [
        {
          "path": "registry/default/hello-world/hello-world.tsx",
          "type": "registry:component"
        }
      ]
    }
  ]
}
```

This `registry.json` file must conform to the [registry schema specification](/docs/registry/registry-json).

### Option B: Using include

For larger registries, you can use `include` to compose your source registry
from multiple `registry.json` files.

```txt
registry.json
components
└── ui
    ├── button.tsx
    ├── input.tsx
    └── registry.json
hooks
├── registry.json
├── use-media-query.ts
└── use-toggle.ts
```

The root `registry.json` defines the registry metadata and includes the nested
registry files.

{/* prettier-ignore */}
```json title="registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "include": [
    "components/ui/registry.json",
    "hooks/registry.json"
  ]
}
```

Included `registry.json` files are valid registry files for composition and may
omit `name` and `homepage`. Only the root `registry.json` must define the
registry metadata.

```json title="components/ui/registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "files": [
        {
          "path": "button.tsx",
          "type": "registry:ui"
        }
      ]
    },
    {
      "name": "input",
      "type": "registry:ui",
      "files": [
        {
          "path": "input.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

```json title="hooks/registry.json" showLineNumbers
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "items": [
    {
      "name": "use-toggle",
      "type": "registry:hook",
      "files": [
        {
          "path": "use-toggle.ts",
          "type": "registry:hook"
        }
      ]
    },
    {
      "name": "use-media-query",
      "type": "registry:hook",
      "files": [
        {
          "path": "use-media-query.ts",
          "type": "registry:hook"
        }
      ]
    }
  ]
}
```

When using `include`, file paths are relative to the `registry.json` file that
declares the item.

## Add an item

### Create a UI component

Add your first item. Here's an example of a simple `<Button />` component:

```tsx title="components/ui/button.tsx" showLineNumbers
import * as React from "react"

export function Button(props: React.ComponentProps<"button">) {
  return (
    <button
      {...props}
      className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
    />
  )
}
```

<Callout className="mt-6">
  **Note:** This example places the component in the `components/ui` directory.
  You can place it anywhere in your project as long as you set the correct path
  in the `registry.json` file.
</Callout>

```txt
components
└── ui
    └── button.tsx
```

### Add the item to the registry

To add your component to the registry, add an item definition to `registry.json`.
If you are using `include`, add the item to the included `registry.json` file
that owns the component. For example, add a UI component to
`components/ui/registry.json`.

```json title="registry.json" showLineNumbers {6-17}
{
  "$schema": "https://ui.shadcn.com/schema/registry.json",
  "name": "acme",
  "homepage": "https://acme.com",
  "items": [
    {
      "name": "button",
      "type": "registry:ui",
      "title": "Button",
      "description": "A simple button component.",
      "files": [
        {
          "path": "components/ui/button.tsx",
          "type": "registry:ui"
        }
      ]
    }
  ]
}
```

You define your registry item by adding a `name`, `type`, `title`, `description` and `files`.

For every file you add, you must specify the `path` and `type` of the file. In a single-file registry, the `path` is relative to the root of your project. When using `include`, the `path` is relative to the `registry.json` file that declares the item. The `type` is the type of the file.

You can read more about the registry item schema and file types in the [registry item schema docs](/docs/registry/registry-item-json).

## Serve your registry

You can serve your registry as static JSON files or from dynamic route handlers.

### Option A: Static JSON files

Run the build command to generate static registry JSON files.

```bash
npx shadcn@latest build
```

If your source registry uses `include`, `shadcn build` resolves the included
registries and writes a flattened registry to your output directory. The
generated `registry.json` does not contain `include`.

<Callout className="mt-6">
  **Note:** By default, the build command will generate the registry JSON files
  in `public/r` e.g `public/r/button.json`. You can change the output directory by passing the `--output` option. See the [shadcn build command](/docs/cli#build) for more information.

</Callout>

If you're running your registry on Next.js, you can serve these files by running
the `next` server. The command might differ for other frameworks.

```bash
npm run dev
```

Your files will now be served at `http://localhost:3000/r/[NAME].json` eg. `http://localhost:3000/r/button.json`.

### Option B: Dynamic route handlers

If you want to serve registry JSON from your source `registry.json` at request
time, use the producer-side loader APIs from `shadcn/registry`.

Install `shadcn` as a runtime dependency:

```bash
npm install shadcn
```

Use `loadRegistry` to serve the registry catalog.

```ts title="app/r/registry.json/route.ts" showLineNumbers
import { loadRegistry } from "shadcn/registry"

export async function GET() {
  try {
    const registry = await loadRegistry()

    return Response.json(registry)
  } catch (error) {
    console.error(error)

    return Response.json({ error: "Failed to load registry." }, { status: 500 })
  }
}
```

Use `loadRegistryItem` to serve individual registry items.

```ts title="app/r/[name].json/route.ts" showLineNumbers
import { loadRegistryItem, RegistryItemNotFoundError } from "shadcn/registry"

export async function GET(
  _request: Request,
  context: {
    params: Promise<{
      name: string
    }>
  }
) {
  const { name } = await context.params

  try {
    const item = await loadRegistryItem(name)

    return Response.json(item)
  } catch (error) {
    if (error instanceof RegistryItemNotFoundError) {
      return Response.json(
        { error: `Registry item "${name}" was not found.` },
        { status: 404 }
      )
    }

    console.error(error)

    return Response.json(
      { error: "Failed to load registry item." },
      { status: 500 }
    )
  }
}
```

Both loaders resolve `include` before returning JSON, so route handlers can use
the same source `registry.json` structure without running `shadcn build`.

<Accordion type="single" collapsible>
  <AccordionItem value="content-negotiation">
    <AccordionTrigger>Content negotiation</AccordionTrigger>
    <AccordionContent>

The `shadcn` CLI supports **HTTP Content Negotiation**. This allows you to host your registry at any endpoint — including the root of your domain — and serve different content depending on who is asking.

From a single URL, you can serve:

<ul>
  <li>
    <strong>HTML</strong> to browsers — a landing page, documentation, or
    marketing site.
  </li>
  <li>
    <strong>JSON</strong> to the <code>shadcn</code> CLI — an installable
    registry item.
  </li>
  <li>
    <strong>Markdown</strong> to AI agents and LLMs — a machine-readable version
    of your content.
  </li>
</ul>

The client signals its preference using the `Accept` request header, and your server decides what to return.

#### Request headers

When the CLI makes a request to a registry, it sends the following headers:

- **User-Agent**: `shadcn`
- **Accept**: `application/vnd.shadcn.v1+json, application/json;q=0.9`

#### Root hosting

By checking these headers on your server, you can route CLI traffic to an installable registry item while keeping browser traffic flowing to your documentation or homepage.

The examples below assume your built registry item is served at `/r/index.json`. Adjust the path to match your output.

In Next.js, express this as a rewrite in `next.config.ts`. This keeps the negotiation in the routing layer and avoids a Proxy function for this static rewrite:

```typescript title="next.config.ts" showLineNumbers
import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "accept",
              value: "(.*)application/vnd\\.shadcn\\.v1\\+json(.*)",
            },
          ],
          destination: "/r/index.json",
        },
        {
          source: "/",
          has: [
            {
              type: "header",
              key: "user-agent",
              value: "shadcn",
            },
          ],
          destination: "/r/index.json",
        },
      ],
    }
  },
  async headers() {
    return [
      {
        source: "/",
        headers: [{ key: "Vary", value: "Accept, User-Agent" }],
      },
    ]
  },
}

export default nextConfig
```

Or, in an Express.js server:

```javascript title="server.js" showLineNumbers
app.get("/", (req, res) => {
  res.vary("Accept")
  res.vary("User-Agent")

  // Check if the client prefers the shadcn vendor type.
  if (req.accepts("application/vnd.shadcn.v1+json")) {
    return res.json(registryData)
  }

  // Optional: Secondary check for the User-Agent.
  if (req.get("User-Agent") === "shadcn") {
    return res.json(registryData)
  }

  // Otherwise, serve your documentation or homepage.
  res.send(htmlContent)
})
```

This enables:

<ul>
  <li>
    <strong>Branded Registry URLs</strong>:{" "}
    <code>shadcn add https://ui.example.com</code>
  </li>
  <li>
    <strong>Shorter URLs</strong>: Users type your domain root, not{" "}
    <code>/r/</code> or <code>/registry/</code> sub-paths.
  </li>
  <li>
    <strong>Easy Mnemonics</strong>: Easier for users to remember and share your
    registry.
  </li>
</ul>

      </AccordionContent>

    </AccordionItem>

</Accordion>

## Test your registry

After your registry is being served, test it with the same CLI commands that
other developers will use.

### Using URL

Use the catalog URL for commands that discover items, like `list` and `search`.
Use item URLs for commands that read or install a specific item, like `view` and
`add`.

#### List items

Start by confirming that the registry catalog can be discovered.

```bash
npx shadcn@latest list http://localhost:3000/r/registry.json
```

#### Search items

Search the registry by query.

```bash
npx shadcn@latest search http://localhost:3000/r/registry.json --query button
```

#### View an item

Then view one registry item by name.

```bash
npx shadcn@latest view http://localhost:3000/r/button.json
```

#### Add an item

To test the install flow, run `add` from a project where you want to install the
item.

```bash
npx shadcn@latest add http://localhost:3000/r/button.json
```

### Using namespace

#### Add the registry

You can also test your registry with a namespace. From a project with a
`components.json` file, add your registry URL template to the project.

```bash
npx shadcn@latest registry add @acme=http://localhost:3000/r/{name}.json
```

The `{name}` placeholder must resolve to an item JSON file. For example,
`@acme/button` resolves to `http://localhost:3000/r/button.json`. The catalog is
still served separately at `http://localhost:3000/r/registry.json`.

#### List items

Then list the items in your registry.

```bash
npx shadcn@latest list @acme
```

#### Search items

Search the registry by query.

```bash
npx shadcn@latest search @acme --query button
```

#### View an item

View one registry item by name.

```bash
npx shadcn@latest view @acme/button
```

#### Add an item

To test the install flow, run `add` from a project where you want to install the
item.

```bash
npx shadcn@latest add @acme/button
```

See the [Namespaced Registries](/docs/registry/namespace) docs for more
information.

## Publish your registry

To make your registry available to other developers, publish your project to a
public URL. Once deployed, users can install items directly from item URLs, or
they can add your registry as a namespace in their project.

### Share namespace setup instructions

If you want users to install items with a namespace like `@acme/button`, tell
them to add your registry URL template to their project. The `{name}`
placeholder is replaced by the item name when the CLI resolves the registry
item.

The template must resolve to item JSON files. For example, `@acme/button`
resolves to `https://acme.com/r/button.json`. Your registry catalog should still
be served separately at `https://acme.com/r/registry.json`.

They can add the namespace with the CLI.

```bash
npx shadcn@latest registry add @acme=https://acme.com/r/{name}.json
```

Or they can add it manually under the `registries` field in their
`components.json` file.

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme": "https://acme.com/r/{name}.json"
  }
}
```

Users can then consume items from your registry by namespace.

```bash
npx shadcn@latest add @acme/button
```

### Add your namespace to the registry index

If your registry is open source and publicly available, you can submit your
namespace to the official registry index. This lets users add your namespace by
name instead of pasting the full URL template.

See the [Registry Index](/docs/registry/registry-index) docs for the submission
requirements.

## Guidelines

Here are some guidelines to follow when building components for a registry.

- Place your registry item in the `registry/[STYLE]/[NAME]` directory. I'm using `default` as an example. It can be anything you want as long as it's nested under the `registry` directory.
- For blocks, the following properties are required: `name`, `description`, `type` and `files`.
- It is recommended to add a proper name and description to your registry item. This helps LLMs understand the component and its purpose.
- Make sure to list all registry dependencies in `registryDependencies`. A registry dependency is the name of the component in the registry eg. `input`, `button`, `card`, etc or a URL to a registry item eg. `http://localhost:3000/r/editor.json`.
- Make sure to list all dependencies in `dependencies`. A dependency is the name of the package in the registry eg. `zod`, `sonner`, etc. To set a version, you can use the `name@version` format eg. `zod@^3.20.0`.
- **Imports should always use the `@/registry` path.** eg. `import { HelloWorld } from "@/registry/default/hello-world/hello-world"`
- Ideally, place your files within a registry item in `components`, `hooks`, `lib` directories.
