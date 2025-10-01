---
title: Namespaces
description: Configure and use multiple resource registries with namespace support.
---

Namespaced registries let you configure multiple resource sources in one project. This means you can install components, libraries, utilities, AI prompts, configuration files, and other resources from various registries, whether they're public, third-party, or your own custom private libraries.

## Table of Contents

- [Overview](#overview)
- [Decentralized Namespace System](#decentralized-namespace-system)
- [Getting Started](#getting-started)
- [Registry Naming Convention](#registry-naming-convention)
- [Configuration](#configuration)
- [Authentication & Security](#authentication--security)
- [Versioning](#versioning)
- [Dependency Resolution](#dependency-resolution)
- [Built-in Registries](#built-in-registries)
- [CLI Commands](#cli-commands)
- [Error Handling](#error-handling)
- [Creating Your Own Registry](#creating-your-own-registry)
- [Example Configurations](#example-configurations)
- [Technical Details](#technical-details)
- [Best Practices](#best-practices)
- [Troubleshooting](#troubleshooting)

---

## Overview

Registry namespaces are prefixed with `@` and provide a way to organize and reference resources from different sources. Resources can be any type of content: components, libraries, utilities, hooks, AI prompts, configuration files, themes, and more. For example:

- `@shadcn/button` - UI component from the shadcn registry
- `@v0/dashboard` - Dashboard component from the v0 registry
- `@ai-elements/input` - AI prompt input from an AI elements registry
- `@acme/auth-utils` - Authentication utilities from your company's private registry
- `@ai/chatbot-rules` - AI prompt rules from an AI resources registry
- `@themes/dark-mode` - Theme configuration from a themes registry

---

## Decentralized Namespace System

We intentionally designed the namespace system to be decentralized. There is a [central open source registry index](/docs/registry/registry-index) for open source namespaces but you are free to create and use any namespace you want.

This decentralized approach gives you complete flexibility to organize your resources however makes sense for your organization.

You can create multiple registries for different purposes:

```json title="components.json" showLineNumbers
{
  "registries": {
    "@acme-ui": "https://registry.acme.com/ui/{name}.json",
    "@acme-docs": "https://registry.acme.com/docs/{name}.json",
    "@acme-ai": "https://registry.acme.com/ai/{name}.json",
    "@acme-themes": "https://registry.acme.com/themes/{name}.json",
    "@acme-internal": {
      "url": "https://internal.acme.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${INTERNAL_TOKEN}"
      }
    }
  }
}
```

This allows you to:

- **Organize by type**: Separate UI components, documentation, AI resources, etc.
- **Organize by team**: Different teams can maintain their own registries
- **Organize by visibility**: Public vs. private resources
- **Organize by version**: Stable vs. experimental registries
- **No naming conflicts**: Since there's no central authority, you don't need to worry about namespace collisions

### Examples of Multi-Registry Setups

#### By Resource Type

```json title="components.json" showLineNumbers
{
  "@components": "https://cdn.company.com/components/{name}.json",
  "@hooks": "https://cdn.company.com/hooks/{name}.json",
  "@utils": "https://cdn.company.com/utils/{name}.json",
  "@prompts": "https://cdn.company.com/ai-prompts/{name}.json"
}
```

#### By Team or Department

```json title="components.json" showLineNumbers
{
  "@design": "https://design.company.com/registry/{name}.json",
  "@engineering": "https://eng.company.com/registry/{name}.json",
  "@marketing": "https://marketing.company.com/registry/{name}.json"
}
```

#### By Stability

```json title="components.json" showLineNumbers
{
  "@stable": "https://registry.company.com/stable/{name}.json",
  "@latest": "https://registry.company.com/beta/{name}.json",
  "@experimental": "https://registry.company.com/experimental/{name}.json"
}
```

---

## Getting Started

### Installing Resources

Once configured, you can install resources using the namespace syntax:

```bash
npx shadcn@latest add @v0/dashboard
```

or multiple resources at once:

```bash
npx shadcn@latest add @acme/header @lib/auth-utils @ai/chatbot-rules
```

### Quick Configuration

Add registries to your `components.json`:

```json title="components.json"
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": "https://registry.acme.com/resources/{name}.json"
  }
}
```

Then start installing:

```bash
npx shadcn@latest add @acme/button
```

---

## Registry Naming Convention

Registry names must follow these rules:

- Start with `@` symbol
- Contain only alphanumeric characters, hyphens, and underscores
- Examples of valid names: `@v0`, `@acme-ui`, `@my_company`

The pattern for referencing resources is: `@namespace/resource-name`

---

## Configuration

Namespaced registries are configured in your `components.json` file under the `registries` field.

### Basic Configuration

The simplest way to configure a registry is with a URL template string:

```json title="components.json"
{
  "registries": {
    "@v0": "https://v0.dev/chat/b/{name}",
    "@acme": "https://registry.acme.com/resources/{name}.json",
    "@lib": "https://lib.company.com/utilities/{name}",
    "@ai": "https://ai-resources.com/r/{name}.json"
  }
}
```

> **Note:** The `{name}` placeholder in the URL is automatically parsed and replaced with the resource name when you run `npx shadcn@latest add @namespace/resource-name`. For example, `@acme/button` becomes `https://registry.acme.com/resources/button.json`. See [URL Pattern System](#url-pattern-system) for more details.

### Advanced Configuration

For registries that require authentication or additional parameters, use the object format:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}",
        "X-API-Key": "${API_KEY}"
      },
      "params": {
        "version": "latest",
        "format": "json"
      }
    }
  }
}
```

> **Note:** Environment variables in the format `${VAR_NAME}` are automatically expanded from your environment (process.env). This works in URLs, headers, and params. For example, `${REGISTRY_TOKEN}` will be replaced with the value of `process.env.REGISTRY_TOKEN`. See [Authentication & Security](#authentication--security) for more details on using environment variables.

---

### URL Pattern System

Registry URLs support the following placeholders:

### `{name}` Placeholder (required)

The `{name}` placeholder is replaced with the resource name:

```json title="components.json" showLineNumbers
{
  "@acme": "https://registry.acme.com/{name}.json"
}
```

When installing `@acme/button`, the URL becomes: `https://registry.acme.com/button.json`
When installing `@acme/auth-utils`, the URL becomes: `https://registry.acme.com/auth-utils.json`

### `{style}` Placeholder (optional)

The `{style}` placeholder is replaced with the current style configuration:

```json
{
  "@themes": "https://registry.example.com/{style}/{name}.json"
}
```

With style set to `new-york`, installing `@themes/card` resolves to: `https://registry.example.com/new-york/card.json`

The style placeholder is optional. Use this when you want to serve different versions of the same resource. For example, you can serve a different version of a component for each style.

---

## Authentication & Security

### Environment Variables

Use environment variables to securely store credentials:

```json title="components.json"
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${REGISTRY_TOKEN}"
      }
    }
  }
}
```

Then set the environment variable:

```bash title=".env.local"
REGISTRY_TOKEN=your_secret_token_here
```

### Authentication Methods

#### Bearer Token (OAuth 2.0)

```json
{
  "@github": {
    "url": "https://api.github.com/repos/org/registry/contents/{name}.json",
    "headers": {
      "Authorization": "Bearer ${GITHUB_TOKEN}"
    }
  }
}
```

#### API Key in Headers

```json title="components.json" showLineNumbers
{
  "@private": {
    "url": "https://api.company.com/registry/{name}",
    "headers": {
      "X-API-Key": "${API_KEY}"
    }
  }
}
```

#### Basic Authentication

```json title="components.json" showLineNumbers
{
  "@internal": {
    "url": "https://registry.company.com/{name}.json",
    "headers": {
      "Authorization": "Basic ${BASE64_CREDENTIALS}"
    }
  }
}
```

#### Query Parameter Authentication

```json title="components.json" showLineNumbers
{
  "@secure": {
    "url": "https://registry.example.com/{name}.json",
    "params": {
      "api_key": "${API_KEY}",
      "client_id": "${CLIENT_ID}",
      "signature": "${REQUEST_SIGNATURE}"
    }
  }
}
```

#### Multiple Authentication Methods

Some registries require multiple authentication methods:

```json title="components.json" showLineNumbers
{
  "@enterprise": {
    "url": "https://api.enterprise.com/v2/registry/{name}",
    "headers": {
      "Authorization": "Bearer ${ACCESS_TOKEN}",
      "X-API-Key": "${API_KEY}",
      "X-Workspace-Id": "${WORKSPACE_ID}"
    },
    "params": {
      "version": "latest"
    }
  }
}
```

### Security Considerations

When working with namespaced registries, especially third-party or public ones, security is paramount. Here's how we handle security:

### Resource Validation

All resources fetched from registries are validated against our registry item schema before installation. This ensures:

- **Structure validation**: Resources must conform to the expected JSON schema
- **Type safety**: Resource types are validated (`registry:ui`, `registry:lib`, etc.)
- **No arbitrary code execution**: Resources are data files, not executable scripts

### Environment Variable Security

Environment variables used for authentication are:

- **Never logged**: The CLI never logs or displays environment variable values
- **Expanded at runtime**: Variables are only expanded when needed, not stored
- **Isolated per registry**: Each registry maintains its own authentication context

Example of secure configuration:

```json title="components.json" showLineNumbers
{
  "registries": {
    "@private": {
      "url": "https://api.company.com/registry/{name}.json",
      "headers": {
        "Authorization": "Bearer ${PRIVATE_REGISTRY_TOKEN}"
      }
    }
  }
}
```

Never commit actual tokens to version control. Use `.env.local`:

```bash title=".env.local"
PRIVATE_REGISTRY_TOKEN=actual_token_here
```

### HTTPS Enforcement

We strongly recommend using HTTPS for all registry URLs:

- **Encrypted transport**: Prevents man-in-the-middle attacks
- **Certificate validation**: Ensures you're connecting to the legitimate registry
- **Credential protection**: Headers and tokens are encrypted in transit

```json title="components.json" showLineNumbers
{
  "registries": {
    "@secure": "https://registry.example.com/{name}.json", // ✅ Good
    "@insecure": "http://registry.example.com/{name}.json" // ❌ Avoid
  }
}
```

### Content Security

Resources from registries are treated as data, not code:

1. **JSON parsing only**: Resources must be valid JSON
2. **Schema validation**: Must match the registry item schema
3. **File path restrictions**: Files can only be written to configured paths
4. **No script execution**: The CLI doesn't execute any code from registry resources

### Registry Trust Model

The namespace system operates on a trust model:

- **You trust what you install**: Only add registries you trust to your configuration
- **Explicit configuration**: Registries must be explicitly configured in `components.json`
- **No automatic registry discovery**: The CLI never automatically adds registries
- **Dependency transparency**: All dependencies are clearly listed in registry items

### Best Practices for Registry Operators

If you're running your own registry:

1. **Use HTTPS always**: Never serve registry content over HTTP
2. **Implement authentication**: Require API keys or tokens for private registries
3. **Rate limiting**: Protect your registry from abuse
4. **Content validation**: Validate resources before serving them

Example secure registry setup:

```json title="components.json" showLineNumbers
{
  "@company": {
    "url": "https://registry.company.com/v1/{name}.json",
    "headers": {
      "Authorization": "Bearer ${COMPANY_TOKEN}",
      "X-Registry-Version": "1.0"
    }
  }
}
```

### Inspecting Resources Before Installation

The CLI provides transparency about what's being installed. You can see the payload of a registry item using the following command:

```bash
npx shadcn@latest view @acme/button
```

This will output the payload of the registry item to the console.

---

## Dependency Resolution

### Basic Dependency Resolution

Resources can have dependencies across different registries:

```json title="registry-item.json" showLineNumbers
{
  "name": "dashboard",
  "type": "registry:block",
  "registryDependencies": [
    "@shadcn/card", // From default registry
    "@v0/chart", // From v0 registry
    "@acme/data-table", // From acme registry
    "@lib/data-fetcher", // Utility library
    "@ai/analytics-prompt" // AI prompt resource
  ]
}
```

The CLI automatically resolves and installs all dependencies from their respective registries.

### Advanced Dependency Resolution

Understanding how dependencies are resolved internally is important if you're developing registries or need to customize third-party resources.

### How Resolution Works

When you run `npx shadcn@latest add @namespace/resource`, the CLI does the following:

1. **Clears registry context** to start fresh
2. **Fetches the main resource** from the specified registry
3. **Recursively resolves dependencies** from their respective registries
4. **Applies topological sorting** to ensure proper installation order
5. **Deduplicates files** based on target paths (last one wins)
6. **Deep merges configurations** (tailwind, cssVars, css, envVars)

This means that if you run the following command:

```bash
npx shadcn@latest add @acme/auth @custom/login-form
```

The `login-form.ts` from `@custom/login-form` will override the `login-form.ts` from `@acme/auth` because it's resolved last.

### Overriding Third-Party Resources

You can leverage the dependency resolution process to override any third-party resource by adding them to your custom resource under `registryDependencies` and overriding with your own custom values.

#### Example: Customizing a Third-Party Button

Let's say you want to customize a button from a vendor registry:

**1. Original vendor button** (`@vendor/button`):

```json title="button.json" showLineNumbers
{
  "name": "button",
  "type": "registry:ui",
  "files": [
    {
      "path": "components/ui/button.tsx",
      "type": "registry:ui",
      "content": "// Vendor's button implementation\nexport function Button() { ... }"
    }
  ],
  "cssVars": {
    "light": {
      "--button-bg": "blue"
    }
  }
}
```

**2. Create your custom override** (`@my-company/custom-button`):

```json title="custom-button.json" showLineNumbers
{
  "name": "custom-button",
  "type": "registry:ui",
  "registryDependencies": [
    "@vendor/button" // Import original first
  ],
  "cssVars": {
    "light": {
      "--button-bg": "purple" // Override the color
    }
  }
}
```

**3. Install your custom version**:

```bash
npx shadcn@latest add @my-company/custom-button
```

This installs the original button from `@vendor/button` and then overrides the `cssVars` with your own custom values.

### Advanced Override Patterns

#### Extending Without Replacing

Keep the original and add extensions:

```json title="extended-table.json" showLineNumbers
{
  "name": "extended-table",
  "registryDependencies": ["@vendor/table"],
  "files": [
    {
      "path": "components/ui/table-extended.tsx",
      "content": "import { Table } from '@vendor/table'\n// Add your extensions\nexport function ExtendedTable() { ... }"
    }
  ]
}
```

This will install the original table from `@vendor/table` and then add your extensions to `components/ui/table-extended.tsx`.

#### Partial Override (Multi-file Resources)

Override only specific files from a complex component:

```json title="custom-auth.json" showLineNumbers
{
  "name": "custom-auth",
  "registryDependencies": [
    "@vendor/auth" // Has multiple files
  ],
  "files": [
    {
      "path": "lib/auth-server.ts",
      "type": "registry:lib",
      "content": "// Your custom auth server"
    }
  ]
}
```

### Resolution Order Example

When you install `@custom/dashboard` that depends on multiple resources:

```json title="dashboard.json" showLineNumbers
{
  "name": "dashboard",
  "registryDependencies": [
    "@shadcn/card", // 1. Resolved first
    "@vendor/chart", // 2. Resolved second
    "@custom/card" // 3. Resolved last (overrides @shadcn/card)
  ]
}
```

Resolution order:

1. `@shadcn/card` - installs to `components/ui/card.tsx`
2. `@vendor/chart` - installs to `components/ui/chart.tsx`
3. `@custom/card` - overwrites `components/ui/card.tsx` (if same target)

### Key Resolution Features

1. **Source Tracking**: Each resource knows which registry it came from, avoiding naming conflicts
2. **Circular Dependency Prevention**: Automatically detects and prevents circular dependencies
3. **Smart Installation Order**: Dependencies are installed first, then the resources that use them

---

## Versioning

You can implement versioning for your registry resources using query parameters. This allows users to pin specific versions or use different release channels.

### Basic Version Parameter

```json title="components.json" showLineNumbers
{
  "@versioned": {
    "url": "https://registry.example.com/{name}",
    "params": {
      "version": "v2"
    }
  }
}
```

This resolves `@versioned/button` to: `https://registry.example.com/button?version=v2`

### Dynamic Version Selection

Use environment variables to control versions across your project:

```json title="components.json" showLineNumbers
{
  "@stable": {
    "url": "https://registry.company.com/{name}",
    "params": {
      "version": "${REGISTRY_VERSION}"
    }
  }
}
```

This allows you to:

- Set `REGISTRY_VERSION=v1.2.3` in production
- Override per environment (dev, staging, prod)

### Semantic Versioning

Implement semantic versioning with range support:

```json title="components.json" showLineNumbers
{
  "@npm-style": {
    "url": "https://registry.example.com/{name}",
    "params": {
      "semver": "^2.0.0",
      "prerelease": "${ALLOW_PRERELEASE}"
    }
  }
}
```

### Version Resolution Best Practices

1. **Use environment variables** for version control across environments
2. **Provide sensible defaults** using the `${VAR:-default}` syntax
3. **Document version schemes** clearly for registry users
4. **Support version pinning** for reproducible builds
5. **Implement version discovery** endpoints (e.g., `/versions/{name}`)
6. **Cache versioned resources** appropriately with proper cache headers

---

## CLI Commands

The shadcn CLI provides several commands for working with namespaced registries:

### Adding Resources

Install resources from any configured registry:

```bash
# Install from a specific registry
npx shadcn@latest add @v0/dashboard

# Install multiple resources
npx shadcn@latest add @acme/button @lib/utils @ai/prompt

# Install from URL directly
npx shadcn@latest add https://registry.example.com/button.json

# Install from local file
npx shadcn@latest add ./local-registry/button.json
```

### Viewing Resources

Inspect registry items before installation:

```bash
# View a resource from a registry
npx shadcn@latest view @acme/button

# View multiple resources
npx shadcn@latest view @v0/dashboard @shadcn/card

# View from URL
npx shadcn@latest view https://registry.example.com/button.json
```

The `view` command displays:

- Resource metadata (name, type, description)
- Dependencies and registry dependencies
- File contents that will be installed
- CSS variables and Tailwind configuration
- Required environment variables

### Searching Registries

Search for available resources in registries:

```bash
# Search a specific registry
npx shadcn@latest search @v0

# Search with query
npx shadcn@latest search @acme --query "auth"

# Search multiple registries
npx shadcn@latest search @v0 @acme @lib

# Limit results
npx shadcn@latest search @v0 --limit 10 --offset 20

# List all items (alias for search)
npx shadcn@latest list @acme
```

Search results include:

- Resource name and type
- Description
- Registry source

---

## Error Handling

### Registry Not Configured

If you reference a registry that isn't configured:

```bash
npx shadcn@latest add @non-existent/component
```

Error:

```txt
Unknown registry "@non-existent". Make sure it is defined in components.json as follows:
{
  "registries": {
    "@non-existent": "[URL_TO_REGISTRY]"
  }
}
```

### Missing Environment Variables

If required environment variables are not set:

```txt
Registry "@private" requires the following environment variables:

  • REGISTRY_TOKEN

Set the required environment variables to your .env or .env.local file.
```

### Resource Not Found

404 Not Found:

```txt
The item at https://registry.company.com/button.json was not found. It may not exist at the registry.
```

This usually means:

- The resource name is misspelled
- The resource doesn't exist in the registry
- The registry URL pattern is incorrect

### Authentication Failures

401 Unauthorized:

```txt
You are not authorized to access the item at https://api.company.com/button.json
Check your authentication credentials and environment variables.
```

403 Forbidden:

```txt
Access forbidden for https://api.company.com/button.json
Verify your API key has the necessary permissions.
```

---

## Creating Your Own Registry

To make your registry compatible with the namespace system, you can serve any type of resource - components, libraries, utilities, AI prompts, themes, configurations, or any other shareable code/content:

1. **Implement the registry item schema**: Your registry must return JSON that conforms to the [registry item schema](/docs/registry/registry-item-json).

2. **Support the URL pattern**: Include `{name}` in your URL template where the resource name will be inserted.

3. **Define resource types**: Use appropriate `type` fields to identify your resources (e.g., `registry:ui`, `registry:lib`, `registry:ai`, `registry:theme`, etc.).

4. **Handle authentication** (if needed): Accept authentication via headers or query parameters.

5. **Document your namespace**: Provide clear instructions for users to configure your registry:

```json title="components.json" showLineNumbers
{
  "registries": {
    "@your-registry": "https://your-domain.com/r/{name}.json"
  }
}
```

---

## Technical Details

### Parser Pattern

The namespace parser uses the following regex pattern:

```regex title="namespace-parser.js"
/^(@[a-zA-Z0-9](?:[a-zA-Z0-9-_]*[a-zA-Z0-9])?)\/(.+)$/
```

This ensures valid namespace formatting and proper component name extraction.

### Resolution Process

1. **Parse**: Extract namespace and component name from `@namespace/component`
2. **Lookup**: Find registry configuration for `@namespace`
3. **Build URL**: Replace placeholders with actual values
4. **Set Headers**: Apply authentication headers if configured
5. **Fetch**: Retrieve component from the resolved URL
6. **Validate**: Ensure response matches registry item schema
7. **Resolve Dependencies**: Recursively fetch any registry dependencies

### Cross-Registry Dependencies

When a component has dependencies from different registries, the resolver:

1. Maintains separate authentication contexts for each registry
2. Resolves each dependency from its respective source
3. Deduplicates files based on target paths
4. Merges configurations (tailwind, cssVars, etc.) from all sources

---

## Best Practices

1. **Use environment variables** for sensitive data like API keys and tokens
2. **Namespace your registry** with a unique, descriptive name
3. **Document authentication requirements** clearly for users
4. **Implement proper error responses** with helpful messages
5. **Cache registry responses** when possible to improve performance
6. **Support style variants** if your components have multiple themes

---

## Troubleshooting

### Resources not found

- Verify the registry URL is correct and accessible
- Check that the `{name}` placeholder is included in the URL
- Ensure the resource exists in the registry
- Confirm the resource type matches what the registry provides

### Authentication issues

- Confirm environment variables are set correctly
- Verify API keys/tokens are valid and not expired
- Check that headers are being sent in the correct format

### Dependency conflicts

- Review resources with the same name from different registries
- Use fully qualified names (`@namespace/resource`) to avoid ambiguity
- Check for circular dependencies between registries
- Ensure resource types are compatible when mixing registries
