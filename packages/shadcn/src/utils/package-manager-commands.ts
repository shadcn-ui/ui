import { execa } from "execa";
import { getPackageManager, PackageManager } from "./get-package-manager";

export interface Dependencies {
  dependencies?: string[],
  devDependencies?: string[],
}

export interface PackageManagerOptions {
  cwd: string;
}

/**
 * Generates command arguments for specified package manager for installing dependencies
 * arguments then will be used to construct and execute a command to install dependencies using specified package manager
 * @param {PackageManager} packageManager - package manager name (npm , yarn etc)
 * @param {string[]} dependencies - list of npm packages to be installed
 * @returns returns a string[] with command arguments for installing the dependencies using the specified package manager
 */
function dependencyCommand(packageManager: PackageManager, dependencies: string[]) {
  const commands: string[] = [];
  switch (packageManager) {
    case "npm":
      commands.push("install");
      break;
    case "yarn":
    case "bun":
    case "pnpm":
    case "rush":
      commands.push("add");
      break;
  }

  if (packageManager === "rush") {
    // build rush command to install multiple dependencies : reference : https://rushjs.io/pages/commands/rush_add
    dependencies.forEach(packageName=>commands.push('-p',`${packageName}`));
  } else {
    commands.push(...dependencies);
  }
  return commands;
}

/**
 * Generates command arguments for specified package manager for installing devDependencies
 * arguments then will be used to construct and execute a command to install devDependencies using specified package manager
 * @param {PackageManager} packageManager - package manager name (npm , yarn etc)
 * @param {string[]} devDependencies - list of npm packages to be installed as devDependencies
 * @returns returns a string[] with command arguments for installing the dependencies using the specified package manager
 */
function devDependencyCommand(packageManager: PackageManager, devDependencies: string[]) {
  const commands = dependencyCommand(packageManager, devDependencies);

  switch (packageManager) {
    case "npm":
    case "pnpm":
      commands.push('-D');
    break;
    case "yarn":
    case "bun":
    case "rush":
      commands.push('--dev');
      break;
  }
  return commands;
}

/**
 * Installs npm package dependencies and devDependencies using the specifies package manager
 * @param {Dependencies} dependencies - on object that contains list of dependencies and devDependencies to be installed
 * @param {PackageManagerOptions} options - to specify cwd for running the installation command
 * @returns
 */
export async function installDependencies(dependencies: Dependencies, options:PackageManagerOptions) {

  if ((!dependencies.dependencies || dependencies.dependencies.length === 0) &&
    (!dependencies.devDependencies || dependencies.devDependencies.length === 0)) {
    return;
  }

  const packageManager = await getPackageManager(options.cwd);

  if (dependencies.dependencies && dependencies.dependencies.length > 0) {
    const commands = dependencyCommand(packageManager, dependencies.dependencies);
    await execa(packageManager, commands, { cwd:options.cwd });
  }

  if (dependencies.devDependencies && dependencies.devDependencies.length > 0) {
    const commands = devDependencyCommand(packageManager, dependencies.devDependencies);
    await execa(packageManager, commands, { cwd:options.cwd });
  }

}
