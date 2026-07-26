export {
  getRegistries,
  getRegistryItems,
  resolveRegistryItems,
  getRegistry,
  getRegistriesIndex,
  getRegistriesConfig,
} from "./api"

export { addRegistryItems, type AddRegistryItemsOptions } from "./add"

export {
  addRegistriesToConfig,
  type AddRegistriesToConfigOptions,
  type AddRegistriesToConfigResult,
} from "./project-config"

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
} from "./errors"
