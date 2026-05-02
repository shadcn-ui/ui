// src/shared/figma-import.js
// Pure helpers for parsing a Figma variables export
// (GET /v1/files/:key/variables/local response shape).
//
// v1 scope:
//   - Accept either the full API response ({ meta: { variables, variableCollections } })
//     or just the meta object directly.
//   - Validate that the expected top-level keys exist and look correct.
//   - Return a stable "raw" object suitable for snapshotting + downstream
//     normalization. Output is deterministic (keys sorted, values by mode
//     deterministic).
//
// Out of v1 scope:
//   - Direct Figma API calls (use a local file export for now).
//   - Multi-mode resolution (only the collection's defaultModeId is read).
//   - Variable aliases (resolvedType "VARIABLE_ALIAS") — error for v1.
//   - Token type coverage beyond COLOR + FLOAT.

/**
 * Validate and shape a Figma variables export into the raw artifact we
 * snapshot. Pure function, no I/O.
 *
 * @param {unknown} input - parsed JSON (full API response or meta object)
 * @returns {{
 *   importedKind: 'figma',
 *   collections: Array<{ id: string, name: string, defaultModeId: string }>,
 *   variables: Array<{
 *     id: string,
 *     name: string,
 *     resolvedType: string,
 *     collectionId: string,
 *     defaultModeValue: unknown,
 *   }>
 * }}
 */
export function parseFigmaVariablesExport(input) {
  if (!isPlainObject(input)) {
    throw new Error(
      "parseFigmaVariablesExport: expected a JSON object."
    );
  }

  // Accept either the full Figma API response (with `meta`) or just the
  // meta object. Real callers will usually pipe a curl response straight
  // through, which has the wrapper.
  const meta = isPlainObject(input.meta) ? input.meta : input;

  if (!isPlainObject(meta.variables)) {
    throw new Error(
      "parseFigmaVariablesExport: missing or invalid `meta.variables` (or `variables`)."
    );
  }
  if (!isPlainObject(meta.variableCollections)) {
    throw new Error(
      "parseFigmaVariablesExport: missing or invalid `meta.variableCollections` (or `variableCollections`)."
    );
  }

  const collectionEntries = Object.values(meta.variableCollections);
  if (collectionEntries.length === 0) {
    throw new Error(
      "parseFigmaVariablesExport: export contains zero variable collections."
    );
  }

  const collections = collectionEntries
    .map((c) => {
      if (!isPlainObject(c)) {
        throw new Error(
          "parseFigmaVariablesExport: collection entry is not an object."
        );
      }
      const id = requireString(c, "id");
      const name = requireString(c, "name");
      const defaultModeId = requireString(c, "defaultModeId");
      return { id, name, defaultModeId };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  const collectionsById = new Map(collections.map((c) => [c.id, c]));

  const variableEntries = Object.values(meta.variables);
  if (variableEntries.length === 0) {
    throw new Error(
      "parseFigmaVariablesExport: export contains zero variables."
    );
  }

  const variables = variableEntries
    .map((v) => {
      if (!isPlainObject(v)) {
        throw new Error(
          "parseFigmaVariablesExport: variable entry is not an object."
        );
      }
      const id = requireString(v, "id");
      const name = requireString(v, "name");
      const resolvedType = requireString(v, "resolvedType");
      const collectionId = requireString(v, "variableCollectionId");
      const collection = collectionsById.get(collectionId);
      if (!collection) {
        throw new Error(
          `parseFigmaVariablesExport: variable "${name}" (${id}) references unknown collection "${collectionId}".`
        );
      }
      if (!isPlainObject(v.valuesByMode)) {
        throw new Error(
          `parseFigmaVariablesExport: variable "${name}" (${id}) is missing valuesByMode.`
        );
      }
      const defaultModeValue = v.valuesByMode[collection.defaultModeId];
      if (defaultModeValue === undefined) {
        throw new Error(
          `parseFigmaVariablesExport: variable "${name}" (${id}) has no value for defaultModeId "${collection.defaultModeId}".`
        );
      }
      return {
        id,
        name,
        resolvedType,
        collectionId,
        defaultModeValue,
      };
    })
    .sort((a, b) => a.id.localeCompare(b.id));

  return {
    importedKind: "figma",
    collections,
    variables,
  };
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function requireString(obj, key) {
  const value = obj[key];
  if (typeof value !== "string" || value.length === 0) {
    throw new Error(
      `parseFigmaVariablesExport: expected non-empty string at "${key}", got ${describe(value)}.`
    );
  }
  return value;
}

function describe(v) {
  if (v === null) return "null";
  if (v === undefined) return "undefined";
  if (Array.isArray(v)) return "array";
  return typeof v;
}
