import { z } from "zod"

// Error codes for programmatic error handling
export const RegistryErrorCode = {
  // Network errors
  NETWORK_ERROR: "NETWORK_ERROR",
  NOT_FOUND: "NOT_FOUND",
  UNAUTHORIZED: "UNAUTHORIZED",
  FORBIDDEN: "FORBIDDEN",
  FETCH_ERROR: "FETCH_ERROR",

  // Configuration errors
  NOT_CONFIGURED: "NOT_CONFIGURED",
  INVALID_CONFIG: "INVALID_CONFIG",
  MISSING_ENV_VARS: "MISSING_ENV_VARS",

  // File system errors
  LOCAL_FILE_ERROR: "LOCAL_FILE_ERROR",

  // Parsing errors
  PARSE_ERROR: "PARSE_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",

  // Generic errors
  UNKNOWN_ERROR: "UNKNOWN_ERROR",
} as const

export type RegistryErrorCode =
  (typeof RegistryErrorCode)[keyof typeof RegistryErrorCode]

export class RegistryError extends Error {
  public readonly code: RegistryErrorCode
  public readonly statusCode?: number
  public readonly context?: Record<string, unknown>
  public readonly suggestion?: string
  public readonly timestamp: Date
  public readonly cause?: unknown

  constructor(
    message: string,
    options: {
      code?: RegistryErrorCode
      statusCode?: number
      cause?: unknown
      context?: Record<string, unknown>
      suggestion?: string
    } = {}
  ) {
    super(message)
    this.name = "RegistryError"
    this.code = options.code || RegistryErrorCode.UNKNOWN_ERROR
    this.statusCode = options.statusCode
    this.cause = options.cause
    this.context = options.context
    this.suggestion = options.suggestion
    this.timestamp = new Date()

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      statusCode: this.statusCode,
      context: this.context,
      suggestion: this.suggestion,
      timestamp: this.timestamp,
      stack: this.stack,
    }
  }
}

export class RegistryNotFoundError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    const message = `The item at ${url} was not found. It may not exist at the registry.`

    super(message, {
      code: RegistryErrorCode.NOT_FOUND,
      statusCode: 404,
      cause,
      context: { url },
      suggestion:
        "Check if the item name is correct and the registry URL is accessible.",
    })
    this.name = "RegistryNotFoundError"
  }
}

export class RegistryUnauthorizedError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    const message = `You are not authorized to access the item at ${url}. If this is a remote registry, you may need to authenticate.`

    super(message, {
      code: RegistryErrorCode.UNAUTHORIZED,
      statusCode: 401,
      cause,
      context: { url },
      suggestion:
        "Check your authentication credentials and environment variables.",
    })
    this.name = "RegistryUnauthorizedError"
  }
}

export class RegistryForbiddenError extends RegistryError {
  constructor(public readonly url: string, cause?: unknown) {
    const message = `You are not authorized to access the item at ${url}. If this is a remote registry, you may need to authenticate.`

    super(message, {
      code: RegistryErrorCode.FORBIDDEN,
      statusCode: 403,
      cause,
      context: { url },
      suggestion:
        "Check your authentication credentials and environment variables.",
    })
    this.name = "RegistryForbiddenError"
  }
}

export class RegistryFetchError extends RegistryError {
  constructor(
    public readonly url: string,
    statusCode?: number,
    public readonly responseBody?: string,
    cause?: unknown
  ) {
    // Use the error detail from the server if available
    const baseMessage = statusCode
      ? `Failed to fetch from registry (${statusCode}): ${url}`
      : `Failed to fetch from registry: ${url}`

    const message =
      typeof cause === "string" && cause
        ? `${baseMessage} - ${cause}`
        : baseMessage

    let suggestion = "Check your network connection and try again."
    if (statusCode === 404) {
      suggestion =
        "The requested resource was not found. Check the URL or item name."
    } else if (statusCode === 500) {
      suggestion = "The registry server encountered an error. Try again later."
    } else if (statusCode && statusCode >= 400 && statusCode < 500) {
      suggestion = "There was a client error. Check your request parameters."
    }

    super(message, {
      code: RegistryErrorCode.FETCH_ERROR,
      statusCode,
      cause,
      context: { url, responseBody },
      suggestion,
    })
    this.name = "RegistryFetchError"
  }
}

export class RegistryNotConfiguredError extends RegistryError {
  constructor(public readonly registryName: string | null) {
    const message = registryName
      ? `Unknown registry "${registryName}". Make sure it is defined in components.json as follows:
{
  "registries": {
    "${registryName}": "[URL_TO_REGISTRY]"
  }
}`
      : `Unknown registry. Make sure it is defined in components.json under "registries".`

    super(message, {
      code: RegistryErrorCode.NOT_CONFIGURED,
      context: { registryName },
      suggestion:
        "Add the registry configuration to your components.json file. Consult the registry documentation for the correct format.",
    })
    this.name = "RegistryNotConfiguredError"
  }
}

export class RegistryLocalFileError extends RegistryError {
  constructor(public readonly filePath: string, cause?: unknown) {
    super(`Failed to read local registry file: ${filePath}`, {
      code: RegistryErrorCode.LOCAL_FILE_ERROR,
      cause,
      context: { filePath },
      suggestion: "Check if the file exists and you have read permissions.",
    })
    this.name = "RegistryLocalFileError"
  }
}

export class RegistryParseError extends RegistryError {
  public readonly parseError: unknown

  constructor(public readonly item: string, parseError: unknown) {
    let message = `Failed to parse registry item: ${item}`

    if (parseError instanceof z.ZodError) {
      message = `Failed to parse registry item: ${item}\n${parseError.errors
        .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
        .join("\n")}`
    }

    super(message, {
      code: RegistryErrorCode.PARSE_ERROR,
      cause: parseError,
      context: { item },
      suggestion:
        "The registry item may be corrupted or have an invalid format. Please make sure it returns a valid JSON object. See https://ui.shadcn.com/schema/registry-item.json.",
    })

    this.parseError = parseError
    this.name = "RegistryParseError"
  }
}

export class RegistryMissingEnvironmentVariablesError extends RegistryError {
  constructor(
    public readonly registryName: string,
    public readonly missingVars: string[]
  ) {
    const message =
      `Registry "${registryName}" requires the following environment variables:\n\n` +
      missingVars.map((v) => `  • ${v}`).join("\n")

    super(message, {
      code: RegistryErrorCode.MISSING_ENV_VARS,
      context: { registryName, missingVars },
      suggestion:
        "Set the required environment variables to your .env or .env.local file.",
    })
    this.name = "RegistryMissingEnvironmentVariablesError"
  }
}

export class RegistryInvalidNamespaceError extends RegistryError {
  constructor(public readonly name: string) {
    const message = `Invalid registry namespace: "${name}". Registry names must start with @ (e.g., @shadcn, @v0).`

    super(message, {
      code: RegistryErrorCode.VALIDATION_ERROR,
      context: { name },
      suggestion:
        "Use a valid registry name starting with @ or provide a direct URL to the registry.",
    })
    this.name = "RegistryInvalidNamespaceError"
  }
}

export class ConfigMissingError extends RegistryError {
  constructor(public readonly cwd: string) {
    const message = `No components.json found in ${cwd} or parent directories.`

    super(message, {
      code: RegistryErrorCode.NOT_CONFIGURED,
      context: { cwd },
      suggestion:
        "Run 'npx shadcn@latest init' to create a components.json file, or check that you're in the correct directory.",
    })
    this.name = "ConfigMissingError"
  }
}

export class ConfigParseError extends RegistryError {
  constructor(public readonly cwd: string, parseError: unknown) {
    let message = `Invalid components.json configuration in ${cwd}.`

    if (parseError instanceof z.ZodError) {
      message = `Invalid components.json configuration in ${cwd}:\n${parseError.errors
        .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
        .join("\n")}`
    }

    super(message, {
      code: RegistryErrorCode.INVALID_CONFIG,
      cause: parseError,
      context: { cwd },
      suggestion:
        "Check your components.json file for syntax errors or invalid configuration. Run 'npx shadcn@latest init' to regenerate a valid configuration.",
    })
    this.name = "ConfigParseError"
  }
}

export class RegistriesIndexParseError extends RegistryError {
  public readonly parseError: unknown

  constructor(parseError: unknown) {
    let message = "Failed to parse registries index"

    if (parseError instanceof z.ZodError) {
      const invalidNamespaces = parseError.errors
        .filter((e) => e.path.length > 0)
        .map((e) => `"${e.path[0]}"`)
        .filter((v, i, arr) => arr.indexOf(v) === i) // remove duplicates

      if (invalidNamespaces.length > 0) {
        message = `Failed to parse registries index. Invalid registry namespace(s): ${invalidNamespaces.join(
          ", "
        )}\n${parseError.errors
          .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
          .join("\n")}`
      } else {
        message = `Failed to parse registries index:\n${parseError.errors
          .map((e) => `  - ${e.path.join(".")}: ${e.message}`)
          .join("\n")}`
      }
    }

    super(message, {
      code: RegistryErrorCode.PARSE_ERROR,
      cause: parseError,
      context: { parseError },
      suggestion:
        "The registries index may be corrupted or have invalid registry namespace format. Registry names must start with @ (e.g., @shadcn, @example).",
    })

    this.parseError = parseError
    this.name = "RegistriesIndexParseError"
  }
}
