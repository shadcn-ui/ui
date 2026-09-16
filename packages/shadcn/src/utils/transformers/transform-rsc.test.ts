import type { Config } from "@/src/utils/get-config"
import { expect, it } from "vitest"

import { transform } from "."

it("transform rsc", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
import { Foo } from "bar"
    `,
      config: {
        tsx: true,
        rsc: true,
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
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
      } as Config,
    })
  ).toMatchSnapshot()
})

it("transform rsc for consecutive files", async () => {
  const raw = `"use client"

      import * as React from "react"
import { Foo } from "bar"
    `

  // Transforming the same input twice must produce the same output. This
  // guards against shared regex state leaking between files, which happens
  // when a single `shadcn add` run transforms multiple components.
  for (const filename of ["first.ts", "second.ts"]) {
    const result = await transform({
      filename,
      raw,
      config: {
        tsx: true,
        rsc: false,
      } as Config,
    })

    expect(
      result,
      `expected "use client" to be removed from ${filename}`
    ).not.toContain("use client")
  }
})
