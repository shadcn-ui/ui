import { expect, test } from "vitest"

import { transform } from "../../src/utils/transformers"

test("transform prefix", async () => {
  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
function NoPrefixFunc() {}
const NoPrefixConst = () => {}
type NoPrefixType = {}
interface NoPrefixInterface {}

function lowerFoo() {}
const Foo = () => {}
type FooType = {}
export { Foo, type FooType, lowerFoo }

export function Bar() {}
export const Bar2 = () => {}
export type Baz = {}
export interface Qux {}
"
    `,
      config: {
        tsx: true,
        prefix: "",
      },
    })
  ).toMatchSnapshot()

  expect(
    await transform({
      filename: "test.ts",
      raw: `import * as React from "react"
function NoPrefixFunc() {}
const NoPrefixConst = () => {}
type NoPrefixType = {}
interface NoPrefixInterface {}

function lowerFoo() {}
const Foo = () => {}
type FooType = {}
export { Foo, type FooType, lowerFoo }

export function Bar() {}
export const Bar2 = () => {}
export type Baz = {}
export interface Qux {}
"
    `,
      config: {
        tsx: true,
        prefix: "Sh",
      },
    })
  ).toMatchSnapshot()
})
