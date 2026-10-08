# Tests

This package contains integration tests that verify the shadcn CLI works correctly with a local registry. The tests run actual CLI commands against test fixtures to ensure files are created and updated properly.

## Running Tests

Run the following command from the root of the workspace:

```bash
pnpm tests:test
```

## Writing Tests

```typescript
import {
  createFixtureTestDirectory,
  fileExists,
  npxShadcn,
} from "../utils/helpers"

describe("my test suite", () => {
  it("should do something", async () => {
    // Create a test directory from a fixture
    const testDir = await createFixtureTestDirectory("next-app")

    // Run CLI command
    await npxShadcn(testDir, ["init", "--base-color=neutral"])

    // Make assertions
    expect(await fileExists(path.join(testDir, "components.json"))).toBe(true)
  })
})
```
