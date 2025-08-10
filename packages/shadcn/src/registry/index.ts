// TODO: Move to a separate file to support client-side usage.
export * from "./schema"

// TODO: Remove these once we have a proper api.
export { resolveRegistryTree as internal_registryResolveItemsTree } from "./resolver"
export { fetchRegistry } from "./fetcher"

export { getRegistryItems } from "./api"
export {
  RegistryError,
  RegistryNotFoundError,
  RegistryUnauthorizedError,
  RegistryForbiddenError,
  RegistryFetchError,
  RegistryNotConfiguredError,
  RegistryLocalFileError,
  RegistryParseError,
  RegistryMissingEnvironmentVariablesError,
} from "./errors"
