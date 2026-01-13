# Offline/On-Premises Setup Guide for shadcn Package

## Overview

This document outlines where the `packages/shadcn` package accesses the internet and how to configure it for offline/on-premises use.

## Internet Access Points

### 1. Registry Fetching (`src/registry/fetcher.ts`)

**Location**: `packages/shadcn/src/registry/fetcher.ts`

**What it does**:

- Fetches registry items (components, styles, etc.) from remote URLs
- Uses `node-fetch` to make HTTP requests
- Default registry URL: `https://ui.shadcn.com/r` (from `REGISTRY_URL` env var)

**Code**:

```typescript
export async function fetchRegistry(
  paths: string[],
  options: { useCache?: boolean } = {}
)
```

**How to make offline**:

- Set `REGISTRY_URL` environment variable to point to a local server or file path
- Use local registry files (`.json` files) - already supported via `fetchRegistryLocal()`
- Configure custom registries in `components.json` to point to local paths

### 2. Registry URL Resolution (`src/registry/constants.ts`)

**Location**: `packages/shadcn/src/registry/constants.ts`

**What it does**:

- Defines the default registry URL
- Can be overridden via `REGISTRY_URL` environment variable

**Code**:

```typescript
export const REGISTRY_URL =
  process.env.REGISTRY_URL ?? "https://ui.shadcn.com/r"
```

**How to make offline**:

- Set `REGISTRY_URL` environment variable:
  ```bash
  export REGISTRY_URL=http://localhost:4000/r
  # or
  export REGISTRY_URL=file:///path/to/local/registry
  ```

### 3. GitHub Template Download (`src/utils/create-project.ts`)

**Location**: `packages/shadcn/src/utils/create-project.ts`

**What it does**:

- Downloads project templates from GitHub when creating new projects
- Uses `https://codeload.github.com/shadcn-ui/ui/tar.gz/main`

**Code**:

```typescript
const GITHUB_TEMPLATE_URL =
  "https://codeload.github.com/shadcn-ui/ui/tar.gz/main"
```

**How to make offline**:

- Pre-download templates and serve them locally
- Modify the code to use a local template path
- Or skip template download and use local project structure

### 4. Built-in Registry Configuration (`src/registry/builder.ts`)

**Location**: `packages/shadcn/src/registry/builder.ts`

**What it does**:

- Builds URLs for registry items based on configuration
- Uses `BUILTIN_REGISTRIES` which defaults to `@shadcn` registry

**Code**:

```typescript
export const BUILTIN_REGISTRIES: z.infer<typeof registryConfigSchema> = {
  "@shadcn": `${REGISTRY_URL}/styles/{style}/{name}.json`,
}
```

**How to make offline**:

- Override registries in `components.json`:
  ```json
  {
    "registries": {
      "@shadcn": "file:///path/to/local/registry/styles/{style}/{name}.json"
    }
  }
  ```

## Solution: Making It Work Offline

### Option 1: Local Registry Server (Recommended)

1. **Set up a local registry server** that mirrors the structure of `https://ui.shadcn.com/r`
2. **Set the REGISTRY_URL environment variable**:
   ```bash
   export REGISTRY_URL=http://localhost:4000/r
   ```
3. **Or configure in components.json**:
   ```json
   {
     "registries": {
       "@shadcn": "http://localhost:4000/r/styles/{style}/{name}.json"
     }
   }
   ```

### Option 2: Local File System

1. **Download registry files** to a local directory structure:

   ```
   /local/registry/
     ├── styles/
     │   ├── new-york-v4/
     │   │   ├── button.json
     │   │   ├── card.json
     │   │   └── ...
     │   └── ...
     └── registries.json
   ```

2. **Use local file paths** in `components.json`:

   ```json
   {
     "registries": {
       "@shadcn": "file:///local/registry/styles/{style}/{name}.json"
     }
   }
   ```

3. **Or use relative paths** for local `.json` files:
   ```bash
   shadcn add ./local-registry/button.json
   ```

### Option 3: Modify Code for Full Offline Support

To make it completely offline without requiring a server:

1. **Modify `src/registry/fetcher.ts`**:

   - Add fallback to local file system when network requests fail
   - Check for local registry files before making HTTP requests

2. **Modify `src/utils/create-project.ts`**:

   - Add option to use local templates instead of GitHub
   - Check for local template directory first

3. **Add local registry detection**:
   - Check for `./registry.json` or `./registry/` directory
   - Use local registry if found, fallback to remote if not

## Implementation Steps

### Step 1: Download Registry Files

You'll need to download all registry files from `https://ui.shadcn.com/r`:

```bash
# Example structure needed:
registry/
  ├── styles/
  │   ├── new-york-v4/
  │   │   ├── button.json
  │   │   ├── card.json
  │   │   └── ... (all components)
  │   └── ... (other styles)
  ├── registries.json
  └── config.json
```

### Step 2: Configure Local Registry

In your project's `components.json`:

```json
{
  "style": "new-york-v4",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "tailwind.config.js",
    "css": "app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils"
  },
  "registries": {
    "@shadcn": "file:///absolute/path/to/registry/styles/{style}/{name}.json"
  }
}
```

### Step 3: Set Environment Variable (Optional)

```bash
export REGISTRY_URL=file:///path/to/local/registry
```

### Step 4: Handle Template Downloads

For the `create` command, you'll need to:

1. Pre-download templates from GitHub
2. Serve them locally or modify the code to use local templates
3. Or skip template creation and use existing project structure

## Testing Offline Setup

1. **Disconnect from internet** or block external URLs
2. **Set REGISTRY_URL** to local path
3. **Run shadcn commands**:
   ```bash
   shadcn add button
   shadcn add card
   ```
4. **Verify** that components are added without network requests

## Current Offline Support

The package already has some offline support:

✅ **Local file support**: Can use `.json` files directly

```bash
shadcn add ./local/button.json
```

✅ **Custom registries**: Can configure registries in `components.json`

✅ **Environment variable**: `REGISTRY_URL` can be set to local server

❌ **Default behavior**: Still tries to fetch from `https://ui.shadcn.com/r` if not configured

❌ **Template downloads**: Still downloads from GitHub for `create` command

## Recommended Approach

For a production offline environment:

1. **Set up a local registry server** (mirror of `ui.shadcn.com/r`)
2. **Set `REGISTRY_URL`** environment variable to point to local server
3. **Pre-download templates** and serve them locally
4. **Configure registries** in `components.json` as backup
5. **Test thoroughly** with network disabled

## Files That Need Modification for Full Offline Support

1. `src/registry/fetcher.ts` - Add local file fallback
2. `src/registry/builder.ts` - Support `file://` protocol better
3. `src/utils/create-project.ts` - Add local template support
4. `src/registry/constants.ts` - Better default handling for offline mode

## Environment Variables

- `REGISTRY_URL`: Override default registry URL (default: `https://ui.shadcn.com/r`)
- `https_proxy`: Proxy support for HTTP requests (already supported)

## Related Files

- `src/registry/fetcher.ts` - HTTP fetching logic
- `src/registry/builder.ts` - URL building logic
- `src/registry/constants.ts` - Default registry URL
- `src/utils/create-project.ts` - Template download
- `src/registry/utils.ts` - Local file detection utilities
