export class RegistryError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = "RegistryError"
  }
}

export class RegistryNotFoundError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    super(`The item at ${url} was not found.`, cause)
    this.name = "RegistryNotFoundError"
  }
}

export class RegistryUnauthorizedError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    super(`Unauthorized access to registry: ${url}`, cause)
    this.name = "RegistryUnauthorizedError"
  }
}

export class RegistryForbiddenError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    super(`Forbidden access to registry: ${url}`, cause)
    this.name = "RegistryForbiddenError"
  }
}

export class RegistryParseError extends RegistryError {
  constructor(
    public readonly item: string,
    public readonly parseError: unknown
  ) {
    super(`Failed to parse registry item: ${item}`, parseError)
    this.name = "RegistryParseError"
  }
}

export class RegistryFetchError extends RegistryError {
  constructor(
    public readonly url: string,
    public readonly statusCode?: number,
    cause?: unknown
  ) {
    const message = statusCode
      ? `Failed to fetch from registry (${statusCode}): ${url}`
      : `Failed to fetch from registry: ${url}`
    super(message, cause)
    this.name = "RegistryFetchError"
  }
}

export class RegistryNotConfiguredError extends RegistryError {
  constructor(public readonly registryName: string | null) {
    const message = registryName
      ? `Unknown registry "${registryName}". Make sure it is defined in components.json as follows:
{
  "registries": {
    "${registryName}": "https://example.com/{name}.json"
  }
}`
      : `Unknown registry. Make sure it is defined in components.json under "registries".`
    super(message)
    this.name = "RegistryNotConfiguredError"
  }
}

export class RegistryLocalFileError extends RegistryError {
  constructor(public readonly filePath: string, cause?: unknown) {
    super(`Failed to read local registry file: ${filePath}`, cause)
    this.name = "RegistryLocalFileError"
  }
}
