import { fetchRegistry } from "@/src/registry/api"
import { execa } from "execa"
import fs from "fs-extra"
import prompts from "prompts"
import path from "path"
import { logger } from "@/src/utils/logger"
import {
  afterEach,
  beforeEach,
  describe,
  expect,
  it,
  vi,
  type MockInstance,
} from "vitest"

import { TEMPLATES, createProject } from "./create-project"

// Mock dependencies
vi.mock("fs-extra")
vi.mock("execa")
vi.mock("prompts")
vi.mock("@/src/registry/api")
vi.mock("@/src/utils/get-package-manager", () => ({
  getPackageManager: vi.fn().mockResolvedValue("npm"),
}))
vi.mock("@/src/utils/spinner")
vi.mock("@/src/utils/logger", () => ({
  logger: {
    break: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}))

describe("createProject", () => {
  let mockLoggerError: ReturnType<typeof vi.spyOn>;
  let mockExit: MockInstance;

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockLoggerError = vi.spyOn(logger, 'error').mockImplementation(() => {});
    mockExit = vi.spyOn(process, "exit").mockImplementation(() => {
      return undefined as never
    })
  })

  afterEach(() => {
    vi.resetAllMocks()
    
    mockLoggerError.mockRestore();
    mockExit.mockRestore();
  })

  it("should create a Next.js project with default options", async () => {
    vi.mocked(prompts).mockResolvedValue({ type: "next", name: "my-app" })

    const result = await createProject({
      cwd: path.resolve("/test"),
      force: false,
      srcDir: false,
    })

    const cwd = "/test"
    const projectPath = "my-app"
    const resolvedPath = path.resolve(cwd, projectPath)

    expect(result).toEqual({
      projectPath: resolvedPath,
      projectName: projectPath,
      template: TEMPLATES.next,
    })

    expect(execa).toHaveBeenCalledWith(
      "npx",
      expect.arrayContaining(["create-next-app@latest", resolvedPath]),
      expect.any(Object)
    )
  })

  it("should create a monorepo project when selected", async () => {
    vi.mocked(prompts).mockResolvedValue({
      type: "next-monorepo",
      name: "my-monorepo",
    })

    const result = await createProject({
      cwd: path.resolve("/test"),
      force: false,
      srcDir: false,
    })

    expect(result).toEqual({
      projectPath: path.resolve("/test", "my-monorepo"),
      projectName: "my-monorepo",
      template: TEMPLATES["next-monorepo"],
    })
  })

  it("should handle remote components and force next template", async () => {
    vi.mocked(fetchRegistry).mockResolvedValue([
      {
        meta: { nextVersion: "13.0.0" },
      },
    ])

    const result = await createProject({
      cwd: "/test",
      force: true,
      components: ["/chat/b/some-component"],
    })

    expect(result.template).toBe(TEMPLATES.next)
  })

  it('should throw error if project path already exists and is not empty (error EEXIST)', async () => {
    const cwd = '/test';
    const projectName = 'existing-app';
    const projectPath = path.resolve(cwd, projectName);

    let mockedDirHandle: any;

    vi.mocked(prompts).mockResolvedValue({ type: 'next', name: projectName });

    vi.mocked(fs.mkdirSync).mockImplementation((pathArg) => {
      const resolvedArg = path.resolve(cwd, String(pathArg));
      if (resolvedArg === projectPath) {
        const error: any = new Error('File already exists');
        error.code = 'EEXIST';
        throw error;
      }
      return undefined;
    });

    vi.mocked(fs.opendirSync).mockImplementation((pathArg) => {
      const resolvedArg = path.resolve(cwd, String(pathArg));
      if (resolvedArg === projectPath) {
        mockedDirHandle = {
          readSync: vi.fn().mockReturnValueOnce({ name: 'somefile.txt' }).mockReturnValue(null),
          closeSync: vi.fn(),
        } as any;
        return mockedDirHandle;
      }
      return {
        readSync: vi.fn().mockReturnValue(null),
        closeSync: vi.fn(),
      } as any;
    });

    await createProject({ cwd, force: false });

    expect(mockLoggerError).toHaveBeenCalledWith(`Directory ${projectName} already exists and is not empty.`);
    expect(mockExit).toHaveBeenCalledWith(1);
    expect(fs.opendirSync).toHaveBeenCalledWith(projectPath);
    expect(mockedDirHandle.closeSync).toHaveBeenCalled();
  });

  it("should throw error if path is not writable (mkdir fails with EACCES)", async () => {
    const cwd = "/test-unwritable"
    const projectName = "my-app"
    const projectPath = path.resolve(cwd, projectName)

    vi.mocked(prompts).mockResolvedValue({ type: "next", name: projectName })
    vi.mocked(fs.mkdirSync).mockImplementation((pathArg) => {
      const resolvedArg = path.resolve(cwd, String(pathArg));
      if (resolvedArg === projectPath) {
        const error: any = new Error("Permission denied")
        error.code = "EACCES"
        throw error
      }
      return undefined
    })

    await createProject({ cwd, force: false })
    
    
    expect(mockLoggerError).toHaveBeenCalledWith(`Path ${cwd} is not writable.`);
    expect(mockExit).toHaveBeenCalledWith(1)
  })


  it('should proceed if project path already exists but is empty (EEXIST handled gracefully)', async () => {
    const cwd = '/test';
    const projectName = 'empty-app';
    const projectPath = path.resolve(cwd, projectName);

    vi.mocked(prompts).mockResolvedValue({ type: 'next', name: projectName });

    vi.mocked(fs.mkdirSync).mockImplementation((pathArg) => {
      const resolvedArg = path.resolve(cwd, String(pathArg));
      if (resolvedArg === projectPath) {
        const error: any = new Error('File already exists');
        error.code = 'EEXIST';
        throw error;
      }
      return undefined;
    });

    vi.mocked(fs.opendirSync).mockImplementation((pathArg) => {
      const resolvedArg = path.resolve(cwd, String(pathArg));
      if (resolvedArg === projectPath) {
        return {
          readSync: vi.fn().mockReturnValue(null),
          closeSync: vi.fn(),
        } as any;
      }
      return {
        readSync: vi.fn().mockReturnValue(null),
        closeSync: vi.fn(),
      } as any;
    });

    await createProject({ cwd, force: false });

    expect(mockLoggerError).not.toHaveBeenCalled();
    expect(mockExit).not.toHaveBeenCalled();
    expect(fs.opendirSync).toHaveBeenCalledWith(projectPath);
  });
})