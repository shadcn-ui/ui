---
title: Authentication
description: Secure your registry with authentication for private and personalized components.
---

Authentication lets you run private registries, control who can access your components, and give different teams or users different content. This guide shows common authentication patterns and how to set them up.

Authentication enables these use cases:

- **Private Components**: Keep your business logic and internal components secure
- **Team-Specific Resources**: Give different teams different components
- **Access Control**: Limit who can see sensitive or experimental components
- **Usage Analytics**: See who's using which components in your organization
- **Licensing**: Control who gets premium or licensed components

## Common Authentication Patterns

### Token-Based Authentication

The most common approach uses Bearer tokens or API keys:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Set your token in environment variables:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
```

### API Key Authentication

Some registries use API keys in headers:

```json title="components.json"
{
  "registries": {
    "@company": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "X-API-Key": "${API_KEY}",
        "X-Workspace-Id": "${WORKSPACE_ID}"
      }
    }
  }
}
```

### Query Parameter Authentication

For simpler setups, use query parameters:

```json title="components.json"
{
  "registries": {
    "@internal": {
      "url": "https://registry.company.com/{name}.json",
      "params": {
        "token": "${ACCESS_TOKEN}"
      }
    }
  }
}
```

This creates: `https://registry.company.com/button.json?token=your_token`

## Server-Side Implementation

Here's how to add authentication to your registry server:

### Next.js API Route Example

```typescript title="app/api/registry/[name]/route.ts"
import { NextRequest, NextResponse } from "next/server"

export async function GET(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  // Get token from Authorization header.
  const authHeader = request.headers.get("authorization")
  const token = authHeader?.replace("Bearer ", "")

  // Or from query parameters.
  const queryToken = request.nextUrl.searchParams.get("token")

  // Check if token is valid.
  if (!isValidToken(token || queryToken)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  // Check if token can access this component.
  if (!hasAccessToComponent(token, params.name)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  // Return the component.
  const component = await getComponent(params.name)
  return NextResponse.json(component)
}

function isValidToken(token: string | null) {
  // Add your token validation logic here.
  // Check against database, JWT validation, etc.
  return token === process.env.VALID_TOKEN
}

function hasAccessToComponent(token: string, componentName: string) {
  // Add role-based access control here.
  // Check if token can access specific component.
  return true // Your logic here.
}
```

### Express.js Example

```javascript title="server.js"
app.get("/registry/:name.json", (req, res) => {
  const token = req.headers.authorization?.replace("Bearer ", "")

  if (!isValidToken(token)) {
    return res.status(401).json({ error: "Unauthorized" })
  }

  const component = getComponent(req.params.name)
  if (!component) {
    return res.status(404).json({ error: "Component not found" })
  }

  res.json(component)
})
```

## Advanced Authentication Patterns

### Team-Based Access

Give different teams different components:

```typescript title="api/registry/route.ts"
async function GET(request: NextRequest) {
  const token = extractToken(request)
  const team = await getTeamFromToken(token)

  // Get components for this team.
  const components = await getComponentsForTeam(team)
  return NextResponse.json(components)
}
```

### User-Personalized Registries

Give users components based on their preferences:

```typescript
async function GET(request: NextRequest) {
  const user = await authenticateUser(request)

  // Get user's style and framework preferences.
  const preferences = await getUserPreferences(user.id)

  // Get personalized component version.
  const component = await getPersonalizedComponent(params.name, preferences)

  return NextResponse.json(component)
}
```

### Temporary Access Tokens

Use expiring tokens for better security:

```typescript
interface TemporaryToken {
  token: string
  expiresAt: Date
  scope: string[]
}

async function validateTemporaryToken(token: string) {
  const tokenData = await getTokenData(token)

  if (!tokenData) return false
  if (new Date() > tokenData.expiresAt) return false

  return true
}
```

## Multi-Registry Authentication

With [namespaced registries](/docs/registry/namespace), you can set up multiple registries with different authentication:

```json title="components.json"
{
  "registries": {
    "@public": "https://public.company.com/{name}.json",
    "@internal": {
      "url": "https://internal.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${INTERNAL_TOKEN}"
      }
    },
    "@premium": {
      "url": "https://premium.company.com/{name}.json",
      "headers": {
        "X-License-Key": "${LICENSE_KEY}"
      }
    }
  }
}
```

This lets you:

- Mix public and private registries
- Use different authentication per registry
- Organize components by access level

## Security Best Practices

### Use Environment Variables

Never commit tokens to version control. Always use environment variables:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
API_KEY=your_api_key_here
```

Then reference them in `components.json`:

```json
{
  "registries": {
    "@private": {
      "url": "https://registry.company.com/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

### Use HTTPS

Always use HTTPS URLs for registries to protect your tokens in transit:

```json
{
  "@secure": "https://registry.company.com/{name}.json" // ✅
  "@insecure": "http://registry.company.com/{name}.json" // ❌
}
```

### Add Rate Limiting

Protect your registry from abuse:

```typescript
import rateLimit from "express-rate-limit"

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
})

app.use("/registry", limiter)
```

### Rotate Tokens

Change access tokens regularly:

```typescript
// Create new token with expiration.
function generateToken() {
  const token = crypto.randomBytes(32).toString("hex")
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days.

  return { token, expiresAt }
}
```

### Log Access

Track registry access for security and analytics:

```typescript
async function logAccess(request: Request, component: string, userId: string) {
  await db.accessLog.create({
    timestamp: new Date(),
    userId,
    component,
    ip: request.ip,
    userAgent: request.headers["user-agent"],
  })
}
```

## Testing Authentication

Test your authenticated registry locally:

```bash
# Test with curl.
curl -H "Authorization: Bearer your_token" \
  https://registry.company.com/button.json

# Test with the CLI.
REGISTRY_TOKEN=your_token npx shadcn@latest add @private/button
```

## Error Handling

The shadcn CLI handles authentication errors gracefully:

- **401 Unauthorized**: Token is invalid or missing
- **403 Forbidden**: Token lacks permission for this resource
- **429 Too Many Requests**: Rate limit exceeded

### Custom Error Messages

Your registry server can return custom error messages in the response body, and the CLI will display them to users:

```typescript
// Registry server returns custom error
return NextResponse.json(
  {
    error: "Unauthorized",
    message:
      "Your subscription has expired. Please renew at company.com/billing",
  },
  { status: 403 }
)
```

The user will see:

```txt
Your subscription has expired. Please renew at company.com/billing
```

This helps provide context-specific guidance:

```typescript
// Different error messages for different scenarios
if (!token) {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message:
        "Authentication required. Set REGISTRY_TOKEN in your .env.local file",
    },
    { status: 401 }
  )
}

if (isExpiredToken(token)) {
  return NextResponse.json(
    {
      error: "Unauthorized",
      message: "Token expired. Request a new token at company.com/tokens",
    },
    { status: 401 }
  )
}

if (!hasTeamAccess(token, component)) {
  return NextResponse.json(
    {
      error: "Forbidden",
      message: `Component '${component}' is restricted to the Design team`,
    },
    { status: 403 }
  )
}
```

## Next Steps

To set up authentication with multiple registries and advanced patterns, see the [Namespaced Registries](/docs/registry/namespace) documentation. It covers:

- Setting up multiple authenticated registries
- Using different authentication per namespace
- Cross-registry dependency resolution
- Advanced authentication patterns
