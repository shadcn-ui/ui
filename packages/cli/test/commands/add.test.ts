import fs from "fs"
import path from "path"
import { execa } from "execa"
import { afterAll, expect, test, vi, describe,beforeAll, beforeEach } from "vitest"
import { runAdd } from "../../src/commands/add"
import * as getPackageManger from "../../src/utils/get-package-manager"
import { logger } from "../../src/utils/logger"

let mockWriteFile, mockMkdir, errorSpy, warnSpy;

const setupMocks = () => {
  vi.mock("execa")
  vi.mock("fs/promises", () => ({
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    existsSync: vi.fn()
  }))

  vi.spyOn(process, 'exit').mockImplementation((code) => {
    throw new Error(`Process exited with code ${code}`);
  });

  mockWriteFile = vi.spyOn(fs.promises, "writeFile").mockResolvedValue();
  mockMkdir = vi.spyOn(fs.promises, "mkdir").mockResolvedValue(undefined)
  errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
  warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});
  vi.spyOn(getPackageManger, "getPackageManager").mockResolvedValue("npm");
};


describe("runAdd exit conditions", () => {
  beforeAll(() => {
    setupMocks();
  });

  afterAll(() => {
    vi.clearAllMocks()
  })

  test('should exit if provided path does not exist', async () => {
    await expect(runAdd([], { yes: true, overwrite: false, all: false, cwd: "unresolvable-path" })).rejects.toThrow("Process exited with code 1");
    expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(/^The path .* does not exist\. Please try again\.$/));

  });

  test('should exit if configuration is missing', async () => {
    vi.mock('@/src/utils/get-config', () => ({
      getConfig: vi.fn(() => null),
    }));
    await expect(runAdd([], { yes: true, overwrite: false,  all: false,cwd: '' })).rejects.toThrow("Process exited with code 1");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/^Configuration is missing\. Please run .* to create a components\.json file\.$/));
  });

});

describe("runAdd with given components", () => {
  beforeAll(() => {
    setupMocks();
  });
  afterAll(() => {
    vi.clearAllMocks()
  })

  test("should exit if the given component dosen't exist ", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await expect(runAdd(['non-existant-component'], { yes: true, cwd: cwd,  all: false,overwrite: false })).rejects.toThrow("Process exited with code 1");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching("Selected components not found. Exiting."));
  });

  test("should write files for the given component", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await runAdd(['button'], { yes: true, cwd: cwd,  all: false,overwrite: false });

    expect(mockWriteFile).toHaveBeenNthCalledWith(
      1,
      path.join(cwd, "src", "components", "ui", "button.tsx"),
      expect.any(String)
    );
  });

  test("should write files for the given components", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await runAdd(['button', 'accordion'], { yes: true, cwd: cwd, all: false, overwrite: false });

    expect(mockWriteFile).toHaveBeenCalledWith(
      path.join(cwd, "src", "components", "ui", "button.tsx"),
      expect.any(String)
    );

    expect(mockWriteFile).toHaveBeenCalledWith(
      path.join(cwd, "src", "components", "ui", "accordion.tsx"),
      expect.any(String)
    );
  });

  test("should install dependencies for prompted components", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await runAdd(['button'], { yes: true, cwd: cwd, all: false, overwrite: false });
    expect(execa).toHaveBeenCalledWith(
      "npm",
      [
        "install",
        "@radix-ui/react-slot"
      ],
      { cwd: cwd }
    );
  });

});

describe("runAdd with prompted components", () => {
  beforeAll(() => {
    setupMocks();
    vi.mock('prompts', () => ({
      default: vi.fn(() => Promise.resolve({ components: ['button'] }))
    }));
  });

  afterAll(() => {
    vi.clearAllMocks()
  })

  test("should write files for the prompted component", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await runAdd([], { yes: true, cwd: cwd,  all: false,overwrite: false });

    expect(mockWriteFile).toHaveBeenNthCalledWith(
      1,
      path.join(cwd, "src", "components", "ui", "button.tsx"),
      expect.any(String)
    );
  });

  test("should install dependencies for prompted components", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");
    await runAdd([], { yes: true, cwd: cwd,  all: false,overwrite: false });
    expect(execa).toHaveBeenCalledWith(
      "npm",
      [
        "install",
        "@radix-ui/react-slot"
      ],
      { cwd: cwd }
    );
  });
});

