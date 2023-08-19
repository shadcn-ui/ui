  import path from "path"
  import { afterEach, expect, test, vi, describe,beforeAll, beforeEach } from "vitest"
  import { runAdd } from "../../src/commands/add" // Assuming this is the correct path
  import { logger } from "../../src/utils/logger"

  vi.mock('prompts', () => ({
    default: vi.fn(() => {
      console.log('mock prompts');
      return Promise.resolve({ components: [] } )}),
  }));

  vi.mock("execa")
  vi.mock("fs/promises", () => ({
    writeFile: vi.fn(),
    mkdir: vi.fn(),
    existsSync: vi.fn()
  }))
  vi.mock("ora")

  vi.spyOn(process, 'exit').mockImplementation(((code?: number | undefined) => {
    throw new Error(`Process exited with code ${code}`);
  }) as any);

  const errorSpy = vi.spyOn(logger, 'error').mockImplementation(() => {});
  const warnSpy = vi.spyOn(logger, 'warn').mockImplementation(() => {});

  test('should exit if provided path does not exist', async () => {
    await expect(runAdd([], { yes: true, overwrite: false, cwd: "unresolvable-path" })).rejects.toThrow("Process exited with code 1");
    expect(errorSpy).toHaveBeenCalledWith(expect.stringMatching(/^The path .* does not exist\. Please try again\.$/));

  });

  test('should exit if configuration is missing', async () => {
    vi.mock('@/src/utils/get-config', () => ({
      getConfig: vi.fn(() => null),
    }));
    await expect(runAdd([], { yes: true, overwrite: false, cwd: '' })).rejects.toThrow("Process exited with code 1");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching(/^Configuration is missing\. Please run .* to create a components\.json file\.$/));
  });

  test("should log warn if no components are selected", async () => {
    let cwd = path.resolve(__dirname, "../fixtures/config-full");

    await expect(runAdd([], { yes: true, overwrite: false, cwd })).rejects.toThrow("Process exited with code 1");
    expect(warnSpy).toHaveBeenCalledWith(expect.stringMatching("No components selected. Exiting."));
  });

