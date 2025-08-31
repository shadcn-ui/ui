---
title: Open in v0
description: Integrate your registry with Open in v0.
---

If your registry is hosted and publicly accessible via a URL, you can open a registry item in v0 by using the `https://v0.dev/chat/api/open?url=[URL]` endpoint.

eg. [https://v0.dev/chat/api/open?url=https://ui.shadcn.com/r/styles/new-york/login-01.json](https://v0.dev/chat/api/open?url=https://ui.shadcn.com/r/styles/new-york/login-01.json)

<Callout className="mt-6">
  **Important:** `Open in v0` does not support `cssVars`, `css`, `envVars`,
  namespaced registries, or advanced authentication methods.
</Callout>

## Button

See [Build your Open in v0 button](https://v0.dev/chat/button) for more information on how to build your own `Open in v0` button.

Here's a simple example of how to add a `Open in v0` button to your site.

```jsx showLineNumbers
import { Button } from "@/components/ui/button"

export function OpenInV0Button({ url }: { url: string }) {
  return (
    <Button
      aria-label="Open in v0"
      className="h-8 gap-1 rounded-[6px] bg-black px-3 text-xs text-white hover:bg-black hover:text-white dark:bg-white dark:text-black"
      asChild
    >
      <a
        href={`https://v0.dev/chat/api/open?url=${url}`}
        target="_blank"
        rel="noreferrer"
      >
        Open in{" "}
        <svg
          viewBox="0 0 40 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-current"
        >
          <path
            d="M23.3919 0H32.9188C36.7819 0 39.9136 3.13165 39.9136 6.99475V16.0805H36.0006V6.99475C36.0006 6.90167 35.9969 6.80925 35.9898 6.71766L26.4628 16.079C26.4949 16.08 26.5272 16.0805 26.5595 16.0805H36.0006V19.7762H26.5595C22.6964 19.7762 19.4788 16.6139 19.4788 12.7508V3.68923H23.3919V12.7508C23.3919 12.9253 23.4054 13.0977 23.4316 13.2668L33.1682 3.6995C33.0861 3.6927 33.003 3.68923 32.9188 3.68923H23.3919V0Z"
            fill="currentColor"
          ></path>
          <path
            d="M13.7688 19.0956L0 3.68759H5.53933L13.6231 12.7337V3.68759H17.7535V17.5746C17.7535 19.6705 15.1654 20.6584 13.7688 19.0956Z"
            fill="currentColor"
          ></path>
        </svg>
      </a>
    </Button>
  )
}
```

```jsx
<OpenInV0Button url="https://example.com/r/hello-world.json" />
```

## Authentication

Open in v0 only supports query parameter authentication. It does not support namespaced registries or advanced authentication methods like Bearer tokens or API keys in headers.

### Using Query Parameter Authentication

To add authentication to your registry for Open in v0, use a `token` query parameter:

```
https://registry.company.com/r/hello-world.json?token=your_secure_token_here
```

When implementing this on your registry server:

1. Check for the `token` query parameter
2. Validate the token against your authentication system
3. Return a `401 Unauthorized` response if the token is invalid or missing
4. Both the shadcn CLI and Open in v0 will handle the 401 response and display an appropriate message to users

### Example Implementation

```typescript
// Next.js API route example
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token")

  if (!isValidToken(token)) {
    return NextResponse.json(
      {
        error: "Unauthorized",
        message: "Invalid or missing token",
      },
      { status: 401 }
    )
  }

  // Return the registry item
  return NextResponse.json(registryItem)
}
```

<Callout className="mt-6">
  **Security Note:** Make sure to encrypt and expire tokens. Never expose
  production tokens in documentation or examples.
</Callout>
