import path from "path"
import { expect, test, vi } from "vitest"
import { execa } from "execa"
import * as getPackageManager from "../../src/utils/get-package-manager";
import { installDependencies } from "../../src/utils/package-manager-commands";

vi.mock("execa");
const defaultOption = { cwd: "." };

test("install dependencies with \"npm\"", async () => {
  vi.spyOn(getPackageManager, "getPackageManager").mockResolvedValue("npm")

  await installDependencies({ dependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toBeCalledWith("npm", ["install", "@radix-ui/react-avatar"], defaultOption);

  // test installing multiple dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toBeCalledWith("npm", ["install", "@radix-ui/react-avatar", "@radix-ui/react-checkbox"], defaultOption);


  // test installing dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("npm", ["install", "@radix-ui/react-avatar", "-D"], defaultOption);

  // test installing multiple dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("npm", ["install", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "-D"], defaultOption);
});

test("install dependencies with \"pnpm\"", async () => {
  vi.spyOn(getPackageManager, "getPackageManager").mockResolvedValue("pnpm")

  await installDependencies({ dependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toBeCalledWith("pnpm", ["add", "@radix-ui/react-avatar"], defaultOption);

  // test installing multiple dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toBeCalledWith("pnpm", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox"], defaultOption);

  // test installing dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("pnpm", ["add", "@radix-ui/react-avatar", "-D"], defaultOption);

  // test installing multiple dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("pnpm", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "-D"], defaultOption);
});


test("install dependencies with \"bun\"", async () => {
  vi.spyOn(getPackageManager, "getPackageManager").mockResolvedValue("bun")

  await installDependencies({ dependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toBeCalledWith("bun", ["add", "@radix-ui/react-avatar"], defaultOption);

  // test installing multiple dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toBeCalledWith("bun", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox"], defaultOption);


  // test installing dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("bun", ["add", "@radix-ui/react-avatar", "--dev"], defaultOption);

  // test installing multiple dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("bun", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "--dev"], defaultOption);
});

test("install dependencies with \"yarn\"", async () => {
  vi.spyOn(getPackageManager, "getPackageManager").mockResolvedValue("yarn")

  await installDependencies({ dependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toBeCalledWith("yarn", ["add", "@radix-ui/react-avatar"], defaultOption);

  // test installing multiple dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toBeCalledWith("yarn", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox"], defaultOption);

  // test installing dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("yarn", ["add", "@radix-ui/react-avatar", "--dev"], defaultOption);

  // test installing multiple dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("yarn", ["add", "@radix-ui/react-avatar", "@radix-ui/react-checkbox", "--dev"], defaultOption);
});

test("install dependencies with \"rush\"", async () => {
  vi.spyOn(getPackageManager, "getPackageManager").mockResolvedValue("rush")

  // test installing dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toBeCalledWith("rush", ["add", "-p", "@radix-ui/react-avatar"], defaultOption);

  // test installing multiple dependencies
  await installDependencies({ dependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toBeCalledWith("rush", ["add", "-p", "@radix-ui/react-avatar", "-p", "@radix-ui/react-checkbox"], defaultOption);

  // test installing dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("rush", ["add", "-p", "@radix-ui/react-avatar", "--dev"], defaultOption);

  // test installing multiple dev dependencies
  await installDependencies({ devDependencies: ["@radix-ui/react-avatar", "@radix-ui/react-checkbox"] }, defaultOption);
  expect(execa).toHaveBeenLastCalledWith("rush", ["add", "-p", "@radix-ui/react-avatar", "-p", "@radix-ui/react-checkbox", "--dev"], defaultOption);
});
