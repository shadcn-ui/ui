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
