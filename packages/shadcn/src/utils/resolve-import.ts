import { dirname } from 'path';
import { createMatchPath, type ConfigLoaderSuccessResult } from "tsconfig-paths"

export async function resolveImport(
  importPath: string,
  config: Pick<ConfigLoaderSuccessResult, "absoluteBaseUrl" | "paths">
) {
  const matchPath = createMatchPath(
    config.absoluteBaseUrl,
    config.paths
  )(
    importPath,
    undefined,
    () => true,
    [".ts", ".tsx"]
  );

  // if the matchPath is a file then return the containing directory
  if (matchPath?.endsWith(".ts") || matchPath?.endsWith(".tsx")) {
    return dirname(matchPath)
  }

  return matchPath
}
