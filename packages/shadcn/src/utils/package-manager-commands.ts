import { execa } from "execa";
import { getPackageManager, PackageManager } from "./get-package-manager";

export interface Dependencies {
  dependencies?: string[],
  devDependencies?: string[],
}

export interface PackageManagerOptions {
  cwd: string;
}

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
