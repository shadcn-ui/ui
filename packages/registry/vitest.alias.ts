import path from "path"

const root = __dirname

// Resolves @shadcn/registry to its source so tests outside this package mock
// the same modules the registry imports, instead of its built chunks.
export const registrySourceAliases = [
  {
    find: /^@shadcn\/registry$/,
    replacement: path.join(root, "src/registry/index.ts"),
  },
  {
    find: /^@shadcn\/registry\/schema$/,
    replacement: path.join(root, "src/schema/index.ts"),
  },
  {
    find: /^@shadcn\/registry\/internal\/(.*)$/,
    replacement: path.join(root, "src/$1"),
  },
]
