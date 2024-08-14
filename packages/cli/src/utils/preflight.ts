import path from "path"
import * as ERRORS from "@/src/utils/errors"
import { getProjectInfo } from "@/src/utils/get-project-info"
import fs from "fs-extra"

export async function preFlight(cwd: string) {
  // Ensure target directory exists.
  if (!fs.existsSync(cwd)) {
    return {
      error: ERRORS.MISSING_DIR,
      info: null,
    }
  }

  // Check for existing components.json file.
  if (fs.existsSync(path.resolve(cwd, "components.json"))) {
    return {
      error: ERRORS.EXISTING_CONFIG,
      info: null,
    }
  }

  // Check for empty project. We assume if no package.json exists, the project is empty.
  if (!fs.existsSync(path.resolve(cwd, "package.json"))) {
    return {
      error: ERRORS.EMPTY_PROJECT,
      info: null,
    }
  }

  const projectInfo = await getProjectInfo(cwd)

  if (!projectInfo?.tailwindConfigFile || !projectInfo?.tailwindCssFile) {
    return {
      error: ERRORS.TAILWIND_NOT_CONFIGURED,
      info: projectInfo,
    }
  }

  if (!projectInfo.tsConfigAliasPrefix) {
    return {
      error: ERRORS.IMPORT_ALIAS_MISSING,
      info: projectInfo,
    }
  }

  return {
    error: null,
    info: projectInfo,
  }
}
