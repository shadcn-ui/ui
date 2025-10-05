# Fix: shadcn not installing in Turborepo environments

Fixes #8262

## Problem

The shadcn CLI was failing to initialize in Turborepo/monorepo environments due to two main issues:

1. **Windows tar extraction failure**: The tar command was failing on Windows with `tar (child): Cannot connect to C: resolve failed` error
2. **Import alias validation failure**: The CLI couldn't detect import aliases in monorepo tsconfig.json files, causing initialization to fail

## Solution

### 1. Cross-platform tar extraction

- Added `tar` package as a dependency for cross-platform tar extraction
- Implemented fallback mechanism that tries:
  1. Node.js `tar` package (cross-platform)
  2. WSL tar command on Windows
  3. Git Bash tar command as final fallback
- Improved error handling for git initialization (optional step)

### 2. Enhanced import alias detection

- Improved `getTsConfigAliasPrefix` function to handle:
  - Direct tsconfig.json reading when tsconfig-paths fails
  - String paths in addition to array paths
  - Better pattern matching for alias detection
- Updated preflight checks to be more lenient with monorepo setups
- Added default alias prefix (`@`) when none is detected in monorepo environments

### 3. Better monorepo support

- Enhanced monorepo project creation with proper default configuration
- Improved project config generation to handle missing alias prefixes
- Added comprehensive test coverage for monorepo scenarios

## Changes

### Modified Files

- `packages/shadcn/src/utils/create-project.ts`: Fixed tar extraction with cross-platform support
- `packages/shadcn/src/utils/get-project-info.ts`: Enhanced alias detection and project config generation
- `packages/shadcn/src/preflights/preflight-init.ts`: More lenient validation for monorepos
- `packages/shadcn/src/commands/init.ts`: Better monorepo handling in init command
- `packages/shadcn/package.json`: Added tar dependency

### Added Files

- `packages/shadcn/test/monorepo-fixes.test.ts`: Test coverage for monorepo fixes

## Testing

The fixes have been tested with:
- ✅ Windows environments with Git Bash
- ✅ Monorepo structures with workspace references
- ✅ Various tsconfig.json configurations
- ✅ Both string and array path formats in tsconfig

## Breaking Changes

None. All changes are backward compatible.

## Before/After

### Before
```bash
$ pnpm dlx shadcn@canary init
✖ Something went wrong creating a new Next.js monorepo.
Command failed with exit code 2: tar -xzf ... 
tar (child): Cannot connect to C: resolve failed
```

### After
```bash
$ pnpm dlx shadcn@canary init
✔ Creating a new Next.js monorepo.
✔ Success! Project initialization completed.
```