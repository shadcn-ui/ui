import prettier from "prettier"

export async function formatCode(code: string, filepath: string) {
  const config = await prettier.resolveConfig(filepath)
  return await prettier.format(code, {
    ...config,
    filepath,
    parser: "typescript",
  })
}
