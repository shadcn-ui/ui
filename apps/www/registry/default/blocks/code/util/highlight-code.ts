import { BundledLanguage, BundledTheme } from "shiki"

export const getTokens = async (
  code: string,
  language: BundledLanguage,
  appTheme?: string,
  theme?: BundledTheme
) => {
  const { codeToTokens } = await import("shiki")

  return await codeToTokens(code, {
    lang: language as BundledLanguage,
    theme:
      theme ??
      (appTheme === "light" ? "github-light-default" : "github-dark-default"),
  })
}
