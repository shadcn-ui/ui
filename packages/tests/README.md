# Tests

<!-- This package contains integration tests that verify the shadcn CLI works correctly with a local registry. The tests run actual CLI commands against test fixtures to ensure files are created and updated properly.
## Running Tests
Run the following command from the root of the workspace:<> -->

This package contains comprehensive integration tests that verify the shadcn CLI works correctly with a local registry. The tests run actual CLI commands against test fixtures to ensure files are created and updated properly.

## 🚀 Features

- **Style Refactoring Tests**: Validates the new `base-lyra` and `radix-nova` style variants
- **Component Validation**: Ensures consistency across different style implementations
- **Registry Integration**: Tests component addition from various registries
- **Performance Monitoring**: Tracks test execution performance
- **Comprehensive Coverage**: Validates imports, exports, CSS variables, and component structure

## 📋 Test Categories

### Core Tests
- `add.test.ts` - Tests component addition functionality
- `init.test.ts` - Tests project initialization
- `registries.test.ts` - Tests registry configuration and usage
- `search.test.ts` - Tests component search functionality
- `view.test.ts` - Tests component viewing

### Style Refactoring Tests
- `style-refactoring.test.ts` - Validates new style architecture
- `component-differences.test.ts` - Tests differences between style variants
- `validation.test.ts` - Comprehensive validation utilities

## 🏃 Running Tests

### From Workspace Root
```bash
pnpm tests:test
```

### Individual Test Commands
```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Run coverage
npm run test:coverage

# Type checking
npm run typecheck

# Format code
npm run format:write
```

## 📝 Writing Tests

### Basic Test Structure
```typescript
import {
  createFixtureTestDirectory,
  npxShadcn,
} from "../utils/helpers"
import { configureRegistries, createRegistryServer } from "../utils/registry"

describe("my test suite", () => {
  it("should do something", async () => {
    // Create a test directory from a fixture
    const testDir = await createFixtureTestDirectory("next-app")

    // Configure registry if needed
    await configureRegistries(testDir, {
      "@my-registry": "http://localhost:4000/r/{name}",
    })

    // Run CLI command
    await npxShadcn(testDir, ["add", "button"])

    // Make assertions
    expect(await fs.pathExists(path.join(testDir, "components/ui/button.tsx"))).toBe(true)
  })
})
```

### Style Variant Testing
```typescript
import { TestHelper } from "../utils/test-helpers"

describe("style variant tests", () => {
  it("should validate style consistency", async () => {
    const testDir = await createFixtureTestDirectory("next-app")
    await npxShadcn(testDir, ["add", "accordion"])

    const baseLyraPath = path.join(testDir, "components/ui/base-lyra/accordion.tsx")
    const radixNovaPath = path.join(testDir, "components/ui/radix-nova/accordion.tsx")

    const consistency = await TestHelper.checkStyleVariantConsistency(baseLyraPath, radixNovaPath)
    expect(consistency.consistent).toBe(true)
  })
})
```

### Performance Testing
```typescript
import { performanceMonitor } from "../utils/test-helpers"

describe("performance tests", () => {
  it("should complete within time limit", async () => {
    const duration = performanceMonitor.measure("test-operation", async () => {
      // Perform operation
      await someAsyncOperation()
    })

    expect(duration).toBeLessThan(5000) // 5 seconds max
  })
})
```

## 🛠️ Test Utilities

### Core Helpers
- `createFixtureTestDirectory()` - Creates isolated test directories
- `npxShadcn()` - Executes CLI commands
- `runCommand()` - Low-level command execution
- `cssHasProperties()` - Validates CSS properties

### Advanced Helpers
- `TestHelper` - Component validation and consistency checking
- `PerformanceMonitor` - Performance measurement utilities
- `TestDataGenerator` - Test data generation utilities

### Registry Utilities
- `createRegistryServer()` - Creates mock registry servers
- `configureRegistries()` - Sets up test registries

## 📊 Test Configuration

### Vitest Configuration
- Test timeout: 120 seconds
- Hook timeout: 120 seconds
- Max concurrency: 4
- Environment: Node.js
- Retry attempts: 2

### Coverage Areas
- ✅ Component addition and removal
- ✅ Style variant consistency
- ✅ Registry integration
- ✅ Import/export validation
- ✅ CSS variable consistency
- ✅ Performance benchmarks
- ✅ Error handling
- ✅ Edge cases

## 🎯 Style Refactoring Validation

The test suite specifically validates the recent style refactoring changes:

### Key Validations
1. **Import Consistency**: Ensures `base-lyra` uses `@base-ui/react` and `radix-nova` uses `radix-ui`
2. **Type Safety**: Validates correct prop types across variants
3. **Component Structure**: Ensures consistent component exports and structure
4. **CSS Variables**: Validates proper CSS variable naming conventions
5. **Data Slots**: Ensures consistent `data-slot` attributes

### Test Coverage Matrix
| Feature | base-lyra | radix-nova | Validation |
|---------|-----------|-----------|------------|
| Accordion | ✅ | ✅ | Import consistency |
| Button | ✅ | ✅ | Export consistency |
| Tooltip | ✅ | ✅ | Type safety |
| CSS Variables | ✅ | ✅ | Naming conventions |

## 🐛 Debugging

### Enable Debug Mode
```bash
DEBUG_TESTS=true npm run test
```

### Individual Test Debugging
```typescript
// Enable debug for specific test
await npxShadcn(testDir, ["add", "button"], { debug: true })
```

### Performance Profiling
```typescript
// Use performance monitor
const duration = performanceMonitor.measure("operation", () => {
  // Your code here
})
console.log(`Operation took ${duration}ms`)
```

## 📈 Performance Benchmarks

- **Test Suite Duration**: ~2-3 minutes
- **Individual Test Duration**: <30 seconds average
- **Memory Usage**: <512MB peak
- **Concurrent Tests**: 4 max

## 🤝 Contributing

When adding new tests:

1. **Use Test Helpers**: Leverage existing utilities for consistency
2. **Add Performance Monitoring**: Include timing for critical operations
3. **Validate Style Variants**: Ensure both `base-lyra` and `radix-nova` are tested
4. **Add Edge Cases**: Cover error scenarios and edge cases
5. **Document Purpose**: Add clear descriptions for test intent

### Test Naming Convention
- Use descriptive test names
- Follow pattern: `should [expected behavior] when [condition]`
- Include style variant in name when relevant

### Example
```typescript
it("should create consistent component exports across base-lyra and radix-nova variants", async () => {
  // Test implementation
})
```

## 🔍 Troubleshooting

### Common Issues
1. **CLI Not Found**: Build the CLI first with `pnpm build:shadcn`
2. **Registry Connection**: Ensure registry server is running
3. **Timeout Issues**: Increase timeout in vitest config
4. **Path Issues**: Verify fixture directories exist

### Test Failures
- Check test logs for detailed error messages
- Verify fixture integrity
- Ensure proper cleanup between tests
- Validate registry server status

## 📚 Additional Resources

- [Vitest Documentation](https://vitest.dev/)
- [shadcn CLI Documentation](../../docs)
- [Style Refactoring Guide](../../STYLE_REFACTORING.md)
