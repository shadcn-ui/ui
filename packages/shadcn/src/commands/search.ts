import path from "path"
import { configWithDefaults } from "@/src/registry/config"
import { clearRegistryContext } from "@/src/registry/context"
import {
  findUnknownSearchTypes,
  printSearchResults,
  resolveSearchRegistries,
  SEARCHABLE_TYPES,
  searchRegistries,
} from "@/src/registry/search"
import { validateRegistryConfigForItems } from "@/src/registry/validator"
import { rawConfigSchema } from "@/src/schema"
import { loadEnvFiles } from "@/src/utils/env-loader"
import { createConfig, getConfig } from "@/src/utils/get-config"
import { handleError } from "@/src/utils/handle-error"
import { highlighter } from "@/src/utils/highlighter"
import { logger } from "@/src/utils/logger"
import { ensureRegistriesInConfig } from "@/src/utils/registries"
import { Command } from "commander"
import fsExtra from "fs-extra"
import { z } from "zod"

const searchOptionsSchema = z.object({
  cwd: z.string(),
  query: z.string().optional(),
  types: z.array(z.string()).optional(),
  limit: z.number().optional(),
  offset: z.number().optional(),
})

// TODO: We're duplicating logic for shadowConfig here.
// Revisit and properly abstract this.

export const search = new Command()
  .name("search")
  .alias("list")
  .description("search items from registries")
  .argument(
    "[registries...]",
    "the registry addresses to search. Supports namespaces, GitHub sources and URLs. When omitted, searches all registries configured in components.json."
  )
  .option(
    "-c, --cwd <cwd>",
    "the working directory. defaults to the current directory.",
    process.cwd()
  )
  .option("-q, --query <query>", "query string")
  .option(
    "-t, --type <type>",
    "filter by item type, e.g. ui, block, hook. Comma-separated for multiple."
  )
  .option("-l, --limit <number>", "maximum number of items to display", "100")
  .option("-o, --offset <number>", "number of items to skip", "0")
  .option("--json", "output as JSON.", false)
  .action(async (registries: string[], opts) => {
    try {
      const options = searchOptionsSchema.parse({
        cwd: path.resolve(opts.cwd),
        query: opts.query,
        types: opts.type
          ? opts.type
              .split(",")
              .map((type: string) => type.trim())
              .filter(Boolean)
          : undefined,
        limit: opts.limit ? parseInt(opts.limit, 10) : undefined,
        offset: opts.offset ? parseInt(opts.offset, 10) : undefined,
      })

      // Validate type filters up front so an unknown type fails clearly
      // instead of silently returning no results.
      if (options.types?.length) {
        const unknownTypes = findUnknownSearchTypes(options.types)
        if (unknownTypes.length > 0) {
          logger.break()
          logger.error(
            `Unknown ${unknownTypes.length === 1 ? "type" : "types"}: ${unknownTypes
              .map((type) => highlighter.info(type))
              .join(", ")}.`
          )
          logger.error(`Valid types: ${SEARCHABLE_TYPES.join(", ")}.`)
          logger.break()
          process.exit(1)
        }
      }

      await loadEnvFiles(options.cwd)

      // Start with a shadow config to support partial components.json.
      // Use createConfig to get proper default paths
      const defaultConfig = createConfig({
        style: "new-york",
        resolvedPaths: {
          cwd: options.cwd,
        },
      })
      let shadowConfig = configWithDefaults(defaultConfig)

      // Check if there's a components.json file (partial or complete).
      const componentsJsonPath = path.resolve(options.cwd, "components.json")
      const hasComponentsJson = fsExtra.existsSync(componentsJsonPath)
      if (hasComponentsJson) {
        const existingConfig = await fsExtra.readJson(componentsJsonPath)
        const partialConfig = rawConfigSchema.partial().parse(existingConfig)
        shadowConfig = configWithDefaults({
          ...defaultConfig,
          ...partialConfig,
        })
      }

      // Try to get the full config, but fall back to shadow config if it fails.
      let config = shadowConfig
      try {
        const fullConfig = await getConfig(options.cwd)
        if (fullConfig) {
          config = configWithDefaults(fullConfig)
        }
      } catch {
        // Use shadow config if getConfig fails (partial components.json).
      }

      // When no registry is provided, search across every registry configured
      // in components.json. This only makes sense when a components.json is
      // present to enumerate; otherwise there is nothing to search and we ask
      // for an explicit registry/namespace argument.
      const searchAllConfigured = registries.length === 0
      if (searchAllConfigured && !hasComponentsJson) {
        logger.break()
        logger.error(
          `Provide a registry or namespace to search, e.g. ${highlighter.info(
            "shadcn search @shadcn"
          )}.`
        )
        logger.break()
        logger.error(
          `If you have a ${highlighter.info(
            "components.json"
          )} with registries configured, run ${highlighter.info(
            "shadcn search"
          )} with no arguments to search all of them.`
        )
        logger.break()
        process.exit(1)
      }

      // Only namespace registries passed explicitly need to be discovered and
      // added to the config. Registries already configured in components.json
      // are resolved directly from the config below.
      const { config: updatedConfig, newRegistries } =
        await ensureRegistriesInConfig(
          registries
            .filter((registry) => registry.startsWith("@"))
            .map((registry) => `${registry}/registry`),
          config,
          {
            silent: true,
            writeFile: false,
          }
        )
      if (newRegistries.length > 0) {
        config.registries = updatedConfig.registries
      }

      // When no registry is passed, "search all" resolves to every configured
      // registry, excluding builtins (e.g. @shadcn).
      const registriesToSearch = resolveSearchRegistries(registries, config)

      if (searchAllConfigured && registriesToSearch.length === 0) {
        logger.break()
        logger.error(
          `No registries are configured in ${highlighter.info(
            "components.json"
          )}.`
        )
        logger.error(
          `Provide a registry or namespace to search, e.g. ${highlighter.info(
            "shadcn search @shadcn"
          )}.`
        )
        logger.break()
        process.exit(1)
      }

      // For explicitly requested registries we validate up front so the user
      // gets a clear error (e.g. missing env vars). When searching every
      // configured registry we skip strict validation and instead tolerate
      // individual registry failures (see continueOnError below).
      if (!searchAllConfigured) {
        validateRegistryConfigForItems(registriesToSearch, config)
      }

      const results = await searchRegistries(registriesToSearch, {
        query: options.query,
        types: options.types,
        limit: options.limit,
        offset: options.offset,
        config,
        // Tolerate per-registry failures when searching every configured
        // registry; failures are returned in `results.errors` so they can be
        // surfaced to humans (printSearchResults) and machines (--json) alike.
        continueOnError: searchAllConfigured,
      })

      // In search-all mode, failures are tolerated and collected. If *every*
      // registry failed, the search did not succeed — exit non-zero.
      const allRegistriesFailed =
        searchAllConfigured &&
        results.errors?.length === registriesToSearch.length

      if (opts.json) {
        console.log(JSON.stringify(results, null, 2))
      } else {
        printSearchResults(results, {
          query: options.query,
          types: options.types,
          registries: registriesToSearch,
        })
      }

      process.exit(allRegistriesFailed ? 1 : 0)
    } catch (error) {
      handleError(error)
    } finally {
      clearRegistryContext()
    }
  })
