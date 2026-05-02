// src/shared/figma-normalize.js
// Pure helpers for transforming the raw Figma artifact into the
// nested-token shape that `build` already consumes.
//
// Input: the object returned by parseFigmaVariablesExport()
// Output: a nested object like:
//   {
//     color: { surface: { default: "#ffffff" } },
//     space: { "1": "4px" }
//   }
//
// v1 supports:
//   - resolvedType "COLOR"  → hex string ("#rrggbb" if alpha=1, else "rgba(r, g, b, a)")
//   - resolvedType "FLOAT"  → number passthrough (build-css.js handles numbers)
//
// v1 does NOT support:
//   - VARIABLE_ALIAS resolution (errors with a clear message)
//   - STRING / BOOLEAN resolved types (errors with a clear message)
//   - Multi-mode emission (only defaultModeValue is read)

const SUPPORTED_TYPES = new Set(["COLOR", "FLOAT"]);

/**
 * Normalize a raw Figma artifact (from parseFigmaVariablesExport) into the
 * nested token shape consumed by `design-tokens build`.
 *
 * @param {{ variables: Array<{ name: string, resolvedType: string, defaultModeValue: unknown }> }} raw
 * @returns {Record<string, unknown>} nested token tree
 */
export function normalizeFigmaVariables(raw) {
  if (!raw || typeof raw !== "object" || !Array.isArray(raw.variables)) {
    throw new Error(
      "normalizeFigmaVariables: expected a raw artifact with a `variables` array."
    );
  }

  if (raw.variables.length === 0) {
    throw new Error(
      "normalizeFigmaVariables: raw artifact has zero variables."
    );
  }

  const tree = {};

  for (const variable of raw.variables) {
    const { name, resolvedType, defaultModeValue } = variable;

    if (!SUPPORTED_TYPES.has(resolvedType)) {
      throw new Error(
        `normalizeFigmaVariables: variable "${name}" has unsupported resolvedType "${resolvedType}". v1 supports: ${[...SUPPORTED_TYPES].join(", ")}.`
      );
    }

    if (
      isPlainObject(defaultModeValue) &&
      defaultModeValue.type === "VARIABLE_ALIAS"
    ) {
      throw new Error(
        `normalizeFigmaVariables: variable "${name}" is a VARIABLE_ALIAS; v1 does not resolve aliases yet.`
      );
    }

    const value =
      resolvedType === "COLOR"
        ? rgbaToCss(defaultModeValue, name)
        : floatToValue(defaultModeValue, name);

    const path = pathFromName(name);
    setAtPath(tree, path, value, name);
  }

  return sortDeep(tree);
}

/**
 * Convert a Figma RGBA value (each channel in [0, 1]) to a CSS color string.
 * Pure function, exported for unit testing.
 *
 * @param {unknown} value
 * @param {string} variableName - for error messages
 * @returns {string}
 */
export function rgbaToCss(value, variableName = "<unnamed>") {
  if (
    !isPlainObject(value) ||
    typeof value.r !== "number" ||
    typeof value.g !== "number" ||
    typeof value.b !== "number"
  ) {
    throw new Error(
      `rgbaToCss: variable "${variableName}" has invalid COLOR value (expected {r,g,b,a?} numbers).`
    );
  }
  const r = clampChannel(value.r);
  const g = clampChannel(value.g);
  const b = clampChannel(value.b);
  const a = typeof value.a === "number" ? clamp01(value.a) : 1;

  if (a === 1) {
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  }
  // Match `Number.toFixed(3)` then trim trailing zeros for stability.
  const aStr = trimTrailingZeros(a.toFixed(3));
  return `rgba(${r}, ${g}, ${b}, ${aStr})`;
}

// --- internals ---

function floatToValue(value, variableName) {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    throw new Error(
      `normalizeFigmaVariables: variable "${variableName}" has invalid FLOAT value (expected finite number, got ${describe(value)}).`
    );
  }
  return value;
}

function pathFromName(name) {
  // Figma variable names use "/" as the path separator. We split on "/"
  // and trim each segment; empty segments are an error.
  const segments = name.split("/").map((s) => s.trim());
  if (segments.some((s) => s.length === 0)) {
    throw new Error(
      `normalizeFigmaVariables: variable name "${name}" has an empty path segment.`
    );
  }
  return segments;
}

function setAtPath(tree, path, value, originalName) {
  let cursor = tree;
  for (let i = 0; i < path.length - 1; i++) {
    const key = path[i];
    if (cursor[key] === undefined) {
      cursor[key] = {};
    } else if (!isPlainObject(cursor[key])) {
      throw new Error(
        `normalizeFigmaVariables: variable "${originalName}" path segment "${key}" collides with a non-object value.`
      );
    }
    cursor = cursor[key];
  }
  const leafKey = path[path.length - 1];
  if (cursor[leafKey] !== undefined) {
    throw new Error(
      `normalizeFigmaVariables: duplicate token name "${originalName}".`
    );
  }
  cursor[leafKey] = value;
}

/**
 * Recursively sort object keys so the output is deterministic regardless
 * of input order. Leaves are returned as-is.
 */
function sortDeep(node) {
  if (!isPlainObject(node)) return node;
  const out = {};
  for (const key of Object.keys(node).sort()) {
    out[key] = sortDeep(node[key]);
  }
  return out;
}

function clampChannel(c) {
  return Math.round(clamp01(c) * 255);
}

function clamp01(n) {
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

function toHex(n) {
  return n.toString(16).padStart(2, "0");
}

function trimTrailingZeros(s) {
  if (!s.includes(".")) return s;
  return s.replace(/0+$/, "").replace(/\.$/, "");
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function describe(v) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
