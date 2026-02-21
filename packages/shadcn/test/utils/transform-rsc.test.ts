import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"

test("transform rsc", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    `,
      config: {
        tsx: true,
        rsc: true,
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `"use client"

      import * as React from "react"
import { Foo } from "bar"
    `,
      config: {
        tsx: true,
        rsc: true,
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `"use client"

      import * as React from "react"
import { Foo } from "bar"
    `,
      config: {
        tsx: true,
        rsc: false,
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `"use foo"

      import * as React from "react"
import { Foo } from "bar"

"use client"
    `,
      config: {
        tsx: true,
        rsc: false,
      },
    })
  ).toMatchSnapshot()


  expect(
    await transform({
      filename: "test.ts",
      raw: `'use client'

      import * as React from 'react'
import { Foo } from 'bar'
    `,
      config: {
        tsx: true,
        rsc: true,
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `'use client'

      import * as React from 'react'
import { Foo } from 'bar'
    `,
      config: {
        tsx: true,
        rsc: false,
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `'use foo'

      import * as React from 'react'
import { Foo } from 'bar'

'use client'
    `,
      config: {
        tsx: true,
        rsc: false,
      },
    })
  ).toMatchSnapshot()
})

test("transform rsc - sequential calls (regression test for #8991)", async () => {
  // Regression test to verify that the stateful regex bug in transformRsc is fixed.
  // This test specifically checks that the "use client" directive is removed
  // consistently across multiple sequential transformations.
  //
  // The original bug: Using /^["']use client["']$/g with .test() created a
  // stateful regex that alternated between true/false on successive calls,
  // causing the directive to be inconsistently removed when rsc: false.

  const rscFalseConfig = {
    tsx: true,
    rsc: false,
  }

  const inputWithDoubleQuotes = `"use client"

import * as React from "react"
import { Foo } from "bar"`

  // Test 1: First transformation
  const result1 = await transform({
    filename: "test1.ts",
    raw: inputWithDoubleQuotes,
    config: rscFalseConfig,
  })
  expect(result1).not.toContain('"use client"')
  expect(result1).toContain('import * as React from "react"')

  // Test 2: Second transformation
  // Before the fix, this would FAIL because the regex state would alternate
  const result2 = await transform({
    filename: "test2.ts",
    raw: inputWithDoubleQuotes,
    config: rscFalseConfig,
  })
  expect(result2).not.toContain('"use client"')
  expect(result2).toContain('import * as React from "react"')

  // Test 3: Third transformation for additional confidence
  const result3 = await transform({
    filename: "test3.ts",
    raw: inputWithDoubleQuotes,
    config: rscFalseConfig,
  })
  expect(result3).not.toContain('"use client"')
  expect(result3).toContain('import * as React from "react"')

  // Test 4: Single quotes variant
  const inputWithSingleQuotes = `'use client'

import * as React from "react"
import { Foo } from "bar"`

  const result4 = await transform({
    filename: "test4.ts",
    raw: inputWithSingleQuotes,
    config: rscFalseConfig,
  })
  expect(result4).not.toContain("'use client'")
  expect(result4).toContain('import * as React from "react"')

  // Test 5: Mixed quotes - another sequential call
  const result5 = await transform({
    filename: "test5.ts",
    raw: inputWithDoubleQuotes,
    config: rscFalseConfig,
  })
  expect(result5).not.toContain('"use client"')
})
