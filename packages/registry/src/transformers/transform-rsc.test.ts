import type { Config } from "@/src/get-config"
import { transformRsc } from "@/src/transformers/transform-rsc"
import { afterEach, beforeEach, describe, expect, it } from "vitest"

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

describe("transformRsc", () => {
  const rsc = (raw: string, rscEnabled = false) =>
    transform(
      {
        filename: "component.tsx",
        raw,
        config: { tsx: true, rsc: rscEnabled } as Config,
      },
      [transformRsc]
    )

  // transformJsx with tsx: true returns getFullText(), which shows what
  // remove() did to leading trivia (the default getText() drops it anyway).
  const rscFullText = (raw: string) =>
    transform(
      {
        filename: "component.tsx",
        raw,
        config: { tsx: true, rsc: false } as Config,
        transformJsx: true,
      },
      [transformRsc]
    )

  // directiveRegex is a module-level /g regex used with .test(): a match leaves
  // lastIndex set, so the next "use client" file keeps its directive. A file
  // whose first expression statement does not match resets lastIndex to 0.
  const resetDirectiveRegex = () => rsc(`"use foo"\n`)

  // Reset before and after each test so they do not depend on run order.
  beforeEach(resetDirectiveRegex)
  afterEach(resetDirectiveRegex)

  it("resets the regex on a CSS file, which ts-morph tested and failed", async () => {
    const raw = `"use client"

import * as React from "react"
`
    expect(await rsc(raw)).toBe(`import * as React from "react"
`)
    await transform(
      {
        filename: "globals.css",
        raw: `@import "tailwindcss";\n`,
        config: { tsx: true, rsc: false } as Config,
      },
      [transformRsc]
    )
    expect(await rsc(raw)).toBe(`import * as React from "react"
`)
  })

  it("consecutive removals alternate because the regex is global", async () => {
    // Current behavior: every other "use client" file keeps the directive.
    const raw = `"use client"

import * as React from "react"
`
    await resetDirectiveRegex()
    expect(await rsc(raw)).toBe(`import * as React from "react"
`)
    expect(await rsc(raw)).toBe(raw)
    expect(await rsc(raw)).toBe(`import * as React from "react"
`)
  })

  it('keeps "use client"; with a semicolon', async () => {
    // Current behavior: getText() includes the semicolon, so the regex fails.
    const raw = `"use client";

import * as React from "react";
`
    expect(await rsc(raw)).toBe(raw)
  })

  it("removes 'use client' with single quotes", async () => {
    expect(
      await rsc(`'use client'

import * as React from 'react'
`)
    ).toBe(`import * as React from 'react'
`)
  })

  it("removes the directive after a leading line comment", async () => {
    const raw = `// Copyright (c) shadcn

"use client"

import * as React from "react"
`
    expect(await rsc(raw)).toBe(`import * as React from "react"
`)

    await resetDirectiveRegex()
    // The comment survives remove(); the blank line after it does not.
    expect(await rscFullText(raw)).toBe(`// Copyright (c) shadcn
import * as React from "react"
`)
  })

  it("removes a JSDoc block before the directive", async () => {
    // Current behavior: remove() deletes the JSDoc block with the directive.
    expect(
      await rscFullText(`/**
 * @license MIT
 */
"use client"

import * as React from "react"
`)
    ).toBe(`import * as React from "react"
`)
  })

  it("removes a trailing comment on the directive line", async () => {
    expect(
      await rscFullText(`"use client" // client only

import * as React from "react"
`)
    ).toBe(`import * as React from "react"
`)
  })

  it('removes "use client" when it is not the first statement', async () => {
    // Current behavior: the first top-level expression statement is checked,
    // even when imports come before it.
    expect(
      await rsc(`import * as React from "react"

// client
"use client"

export function A() {
  return null
}
`)
    ).toBe(`import * as React from "react"

// client

export function A() {
  return null
}
`)
  })

  it('keeps "use client" after another expression statement', async () => {
    expect(
      await rsc(`import * as React from "react"

console.log("loaded")
"use client"
`)
    ).toBe(`import * as React from "react"

console.log("loaded")
"use client"
`)
  })

  it("keeps the directive when rsc is true", async () => {
    const raw = `"use client"

import * as React from "react"
`
    expect(await rsc(raw, true)).toBe(raw)
  })

  it("keeps other directives", async () => {
    const raw = `"use server"

export async function action() {}
`
    expect(await rsc(raw)).toBe(raw)
  })

  it("CRLF input", async () => {
    expect(
      await rsc(`"use client"\r\n\r\nimport * as React from "react"\r\n`)
    ).toBe(`import * as React from "react"\r\n`)
  })

  it("a file that only contains the directive", async () => {
    expect(await rsc(`"use client"\n`)).toBe(``)
  })

  it.each([
    // A blank line when the statement before or after has a body.
    [
      `function a() {}\n\n"use client"\n\nfunction b() {}\n`,
      `function a() {}\n\nfunction b() {}\n`,
    ],
    // A line break otherwise.
    [
      `import a from "a"\n"use client"\nimport b from "b"\n`,
      `import a from "a"\nimport b from "b"\n`,
    ],
    // Current behavior: remove() takes a shebang before the directive along.
    [
      `#!/usr/bin/env node\n"use client"\n\nconsole.log(1)\n`,
      `console.log(1)\n`,
    ],
  ])("separates the statements around it: %j", async (raw, expected) => {
    expect(await rscFullText(raw)).toBe(expected)
  })
})
