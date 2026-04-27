// test/build.test.js
//
// Pure-function tests for the build pipeline (flattenTokens + renderCssFile)
// plus a small smoke test for the build command's I/O loop.

import { test } from "node:test"
import assert from "node:assert/strict"
import { mkdtemp, readFile, writeFile, rm } from "node:fs/promises"
import { tmpdir } from "node:os"
import { join } from "node:path"

import {
  flattenTokens,
  renderCssFile,
} from "../src/shared/build-css.js"
import { run as runBuild } from "../src/commands/build.js"

// --- flattenTokens ---

test("flattenTokens: emits one CSS variable per leaf string value", () => {
  const pairs = flattenTokens({
    color: { text: { default: "#000", muted: "#666" } },
  })
  assert.deepEqual(
    pairs.map((p) => [p.name, p.value]),
    [
      ["--lead-color-text-default", "#000"],
      ["--lead-color-text-muted", "#666"],
    ]
  )
})

test("flattenTokens: supports number leaves (font weights, line heights)", () => {
  const pairs = flattenTokens({
    font: { weight: { medium: 500 } },
    line: { height: { tight: 1.2 } },
  })
  assert.deepEqual(
    pairs.map((p) => [p.name, p.value]),
    [
      ["--lead-font-weight-medium", "500"],
      ["--lead-line-height-tight", "1.2"],
    ]
  )
})

test("flattenTokens: supports {value} wrapper objects on leaves", () => {
  const pairs = flattenTokens({
    color: { text: { default: { value: "#000", description: "ignored" } } },
  })
  assert.deepEqual(
    pairs.map((p) => p.value),
    ["#000"]
  )
})

test("flattenTokens: orders top-level groups alphabetically", () => {
  const pairs = flattenTokens({
    space: { "1": "4px" },
    color: { text: { default: "#000" } },
    radius: { sm: "4px" },
  })
  assert.deepEqual(
    pairs.map((p) => p.group),
    ["color", "radius", "space"]
  )
})

test("flattenTokens: preserves declared key order within a group (non-integer keys)", () => {
  // Groups are sorted alphabetically; *within* a group, non-integer keys
  // come in the order the input declares them so authors can group related
  // vars. (JS auto-sorts integer-like string keys per spec; that's a
  // separate test below.)
  const pairs = flattenTokens({
    color: {
      text: { onPrimary: "#fff", default: "#000", muted: "#666" },
    },
  })
  assert.deepEqual(
    pairs.map((p) => p.name),
    [
      "--lead-color-text-onPrimary",
      "--lead-color-text-default",
      "--lead-color-text-muted",
    ]
  )
})

test("flattenTokens: integer-like keys come out in numeric order (JS object key spec)", () => {
  // JS engines reorder integer-like string keys (e.g. "1", "5", "3") to
  // numeric ascending order regardless of declaration order. Lock in this
  // behavior so future authors aren't surprised.
  const pairs = flattenTokens({
    space: { "5": "24px", "1": "4px", "3": "12px" },
  })
  assert.deepEqual(
    pairs.map((p) => p.name),
    [
      "--lead-space-1",
      "--lead-space-3",
      "--lead-space-5",
    ]
  )
})

test("flattenTokens: nests deeper than two levels (action.primary.default)", () => {
  const pairs = flattenTokens({
    color: {
      action: { primary: { default: "#1856f3", hover: "#1547d2" } },
    },
  })
  assert.deepEqual(
    pairs.map((p) => p.name),
    [
      "--lead-color-action-primary-default",
      "--lead-color-action-primary-hover",
    ]
  )
})

test("flattenTokens: throws when input is not an object", () => {
  assert.throws(() => flattenTokens(null), /expected a top-level object/)
  assert.throws(() => flattenTokens([]), /expected a top-level object/)
  assert.throws(() => flattenTokens("x"), /expected a top-level object/)
})

test("flattenTokens: throws when a top-level group is not an object", () => {
  assert.throws(
    () => flattenTokens({ color: "red" }),
    /group "color" must be an object/
  )
})

test("flattenTokens: throws on unsupported node shapes (e.g. array leaves)", () => {
  assert.throws(
    () => flattenTokens({ color: { text: { default: ["#000"] } } }),
    /unsupported node at "color\.text\.default"/
  )
})

// --- renderCssFile ---

test("renderCssFile: stamps version + 'do not edit' header", () => {
  const css = renderCssFile(
    [{ name: "--lead-x", value: "1", group: "x" }],
    { version: "0.0.1", generator: "design-tokens build" }
  )
  assert.match(css, /version: 0\.0\.1/)
  assert.match(css, /DO NOT EDIT BY HAND/)
  assert.match(css, /generator: design-tokens build/)
})

test("renderCssFile: emits a :root block with one declaration per pair", () => {
  const css = renderCssFile(
    [
      { name: "--lead-color-text-default", value: "#000", group: "color" },
      { name: "--lead-color-text-muted", value: "#666", group: "color" },
    ],
    { version: "0.0.1" }
  )
  assert.match(css, /:root \{[\s\S]*\}\n$/)
  assert.match(css, /--lead-color-text-default: #000;/)
  assert.match(css, /--lead-color-text-muted: #666;/)
})

test("renderCssFile: separates groups with blank lines for readability", () => {
  const css = renderCssFile(
    [
      { name: "--lead-color-x", value: "#000", group: "color" },
      { name: "--lead-radius-sm", value: "4px", group: "radius" },
    ],
    { version: "0.0.1" }
  )
  // Blank line between groups inside :root block.
  assert.match(
    css,
    /--lead-color-x: #000;\n\n {2}--lead-radius-sm: 4px;/
  )
})

test("renderCssFile: throws when version is missing", () => {
  assert.throws(
    () => renderCssFile([], {}),
    /meta\.version is required/
  )
})

// --- build command (integration; tmp dir I/O) ---

test("build: writes a CSS file with stable, alphabetically-grouped variables", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lead-tokens-build-"))
  try {
    const inputPath = join(dir, "input.json")
    const outPath = join(dir, "output.css")
    await writeFile(
      inputPath,
      JSON.stringify({
        space: { "1": "4px" },
        color: { text: { default: "#000" } },
      }),
      "utf8"
    )

    const cwd = process.cwd()
    process.chdir(dir)
    try {
      const exitCode = await runBuild([
        "--input",
        "input.json",
        "--out",
        "output.css",
      ])
      assert.equal(exitCode, 0)
    } finally {
      process.chdir(cwd)
    }

    const css = await readFile(outPath, "utf8")
    // color group is alphabetically before space.
    const colorIdx = css.indexOf("--lead-color-text-default")
    const spaceIdx = css.indexOf("--lead-space-1")
    assert.ok(colorIdx > 0 && spaceIdx > 0 && colorIdx < spaceIdx)
    assert.match(css, /--lead-color-text-default: #000;/)
    assert.match(css, /--lead-space-1: 4px;/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("build: fails clearly when input file does not exist", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lead-tokens-build-"))
  try {
    const cwd = process.cwd()
    process.chdir(dir)
    try {
      await assert.rejects(
        runBuild(["--input", "missing.json", "--out", "out.css"]),
        /build: failed to read input/
      )
    } finally {
      process.chdir(cwd)
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("build: fails clearly when input file is not valid JSON", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lead-tokens-build-"))
  try {
    const inputPath = join(dir, "broken.json")
    await writeFile(inputPath, "{ not json", "utf8")
    const cwd = process.cwd()
    process.chdir(dir)
    try {
      await assert.rejects(
        runBuild(["--input", "broken.json", "--out", "out.css"]),
        /build: input "broken\.json" is not valid JSON/
      )
    } finally {
      process.chdir(cwd)
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("build: fails clearly when input produces zero tokens", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lead-tokens-build-"))
  try {
    const inputPath = join(dir, "empty.json")
    await writeFile(inputPath, "{}", "utf8")
    const cwd = process.cwd()
    process.chdir(dir)
    try {
      await assert.rejects(
        runBuild(["--input", "empty.json", "--out", "out.css"]),
        /produced zero tokens/
      )
    } finally {
      process.chdir(cwd)
    }
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})

test("build: produces a Lead-shaped CSS file when given the realistic fixture", async () => {
  const dir = await mkdtemp(join(tmpdir(), "lead-tokens-build-"))
  try {
    const cwd = process.cwd()
    const fixturePath = join(
      cwd,
      "test",
      "fixtures",
      "tokens.normalized.fixture.json"
    )
    const outPath = join(dir, "tokens.css")
    process.chdir(cwd)
    const exitCode = await runBuild([
      "--input",
      fixturePath,
      "--out",
      outPath,
    ])
    assert.equal(exitCode, 0)

    const css = await readFile(outPath, "utf8")
    // Spot-check a handful of variables that real components consume.
    assert.match(css, /--lead-color-action-primary-default: #1856f3;/)
    assert.match(css, /--lead-color-text-onPrimary: #ffffff;/)
    assert.match(css, /--lead-radius-md: 8px;/)
    assert.match(css, /--lead-space-3: 12px;/)
    assert.match(css, /--lead-font-weight-semibold: 600;/)
    assert.match(css, /--lead-easing-standard: cubic-bezier\(0\.2, 0, 0, 1\);/)
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
})
