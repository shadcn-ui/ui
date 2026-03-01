export {
  getRegistries,
  getRegistryItems,
  resolveRegistryItems,
  getRegistry,
  getRegistriesIndex,
} from "./api"

export { searchRegistries } from "./search"

export {
  RegistryError,
  RegistryNotFoundError,
  RegistryUnauthorizedError,
  RegistryForbiddenError,
  RegistryFetchError,
  RegistryNotConfiguredError,
  RegistryLocalFileError,
  RegistryParseError,
  RegistriesIndexParseError,
  RegistryMissingEnvironmentVariablesError,
  RegistryInvalidNamespaceError,
  // Type guards for error handling
  isRegistryError,
  isNetworkError,
  isRetryableError,
} from "./errors"
