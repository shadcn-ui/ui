export {
  getRegistries,
  getRegistryItems,
  resolveRegistryItems,
  getRegistry,
  getRegistriesIndex,
} from "./api"

export { searchRegistries } from "./search"

export {
  loadRegistry,
  loadRegistryItem,
  type LoadRegistryOptions,
} from "./loader"

export {
  RegistryErrorCode,
  RegistryError,
  RegistryNotFoundError,
  RegistryUnauthorizedError,
  RegistryForbiddenError,
  RegistryFetchError,
  RegistryNotConfiguredError,
  RegistryLocalFileError,
  RegistryParseError,
  RegistryValidationError,
  RegistryItemNotFoundError,
  RegistriesIndexParseError,
  RegistryMissingEnvironmentVariablesError,
  RegistryInvalidNamespaceError,
  // Type guards for error handling
  isRegistryError,
  isNetworkError,
  isRetryableError,
} from "./errors"
