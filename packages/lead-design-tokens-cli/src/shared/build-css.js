// src/shared/build-css.js
// Pure helpers for the `build` command. No I/O — easy to unit-test.

/**
 * Flatten a nested token tree into an ordered list of CSS variable
 * `[name, value]` pairs.
 *
 * Input shape (v1 — narrow on purpose):
 *
 *   {
 *     "color": {
 *       "surface": { "default": "#ffffff", "muted": "#f5f5f6" },
 *       "text": { "default": "#15161a" }
 *     },
 *     "space": { "1": "4px", "2": "8px" },
 *     "font": {
 *       "family": { "sans": "\"Inter\", sans-serif" }
 *     }
 *   }
 *
 * Leaves are either:
 *   - a primitive value (string | number) — used directly as the CSS value.
 *   - an object with a `value` field — `value` is used; other fields
 *     are reserved for future use (description, source token reference).
 *
 * Each leaf becomes:
 *   --lead-<group>-<path>-<leaf>: <value>;
 *
 * Path segments are joined with a hyphen (no transformation of segment
 * casing — the input chooses its own naming). Groups are sorted
 * alphabetically; within a group, keys are emitted in the order the
 * input declares them so authors can group related variables visually.
 *
 * @param {Record<string, unknown>} tokens
 * @returns {{ name: string, value: string, group: string }[]}
 */
export function flattenTokens(tokens) {
  if (!tokens || typeof tokens !== "object" || Array.isArray(tokens)) {
    throw new Error(
      "flattenTokens: expected a top-level object of token groups."
    );
  }

  const groups = Object.keys(tokens).sort();
  const result = [];

  for (const group of groups) {
    const groupValue = tokens[group];
    if (!isPlainObject(groupValue)) {
      throw new Error(
        `flattenTokens: group "${group}" must be an object; got ${describe(groupValue)}.`
      );
    }
    walk(group, [group], groupValue, result, group);
  }

  return result;
}

/**
 * Render the flattened pair list as a CSS file with a `:root { ... }`
 * block.
 *
 * @param {{ name: string, value: string, group: string }[]} pairs
 * @param {{ version: string, generator?: string, header?: string }} meta
 * @returns {string}
 */
export function renderCssFile(pairs, meta) {
  if (!meta || typeof meta !== "object") {
    throw new Error("renderCssFile: meta is required.");
  }
  const version = meta.version
  if (typeof version !== "string" || version.length === 0) {
    throw new Error("renderCssFile: meta.version is required.")
  }

  const lines = [];
  lines.push("/*");
  lines.push(" * Lead Design Tokens — generated CSS");
  lines.push(` * version: ${version}`);
  if (meta.generator) lines.push(` * generator: ${meta.generator}`);
  lines.push(" *");
  lines.push(" * DO NOT EDIT BY HAND. Regenerate with `design-tokens build`.");
  if (meta.header) {
    for (const headerLine of meta.header.split("\n")) {
      lines.push(` * ${headerLine}`);
    }
  }
  lines.push(" */");
  lines.push("");
  lines.push(":root {");

  let lastGroup = null;
  for (const { name, value, group } of pairs) {
    if (lastGroup !== null && group !== lastGroup) {
      lines.push(""); // blank line between groups for readability
    }
    lines.push(`  ${name}: ${value};`);
    lastGroup = group;
  }

  lines.push("}");
  lines.push(""); // trailing newline
  return lines.join("\n");
}

// --- helpers (not exported) ---

function walk(group, path, node, result, originalGroup) {
  for (const key of Object.keys(node)) {
    const child = node[key]
    const childPath = [...path, key]

    if (isLeafValue(child)) {
      result.push({
        name: cssVarName(childPath),
        value: stringifyValue(child),
        group: originalGroup,
      })
      continue
    }

    if (isLeafWithValueWrapper(child)) {
      result.push({
        name: cssVarName(childPath),
        value: stringifyValue(child.value),
        group: originalGroup,
      })
      continue
    }

    if (isPlainObject(child)) {
      walk(group, childPath, child, result, originalGroup)
      continue
    }

    throw new Error(
      `flattenTokens: unsupported node at "${childPath.join(".")}" — ${describe(child)}.`
    )
  }
}

function cssVarName(path) {
  return `--lead-${path.join("-")}`
}

function isPlainObject(v) {
  return (
    v !== null && typeof v === "object" && !Array.isArray(v)
  )
}

function isLeafValue(v) {
  return typeof v === "string" || typeof v === "number"
}

function isLeafWithValueWrapper(v) {
  return (
    isPlainObject(v) &&
    Object.prototype.hasOwnProperty.call(v, "value") &&
    isLeafValue(v.value)
  )
}

function stringifyValue(v) {
  if (typeof v === "number") return String(v)
  return v
}

function describe(v) {
  if (v === null) return "null"
  if (Array.isArray(v)) return "array"
  return typeof v
}
