import { highlighter } from "@/src/utils/highlighter"

export const logger = {
  error(...args: unknown[]) {
    console.log(highlighter.error(args.join(" ")))
  },
  warn(...args: unknown[]) {
    console.log(highlighter.warn(args.join(" ")))
  },
  info(...args: unknown[]) {
    console.log(highlighter.info(args.join(" ")))
  },
  success(...args: unknown[]) {
    console.log(highlighter.success(args.join(" ")))
  },
  log(...args: unknown[]) {
    console.log(args.join(" "))
  },
  break() {
    console.log("")
  },
  // New: verbose logging that can be enabled via environment variable
  verbose(...args: unknown[]) {
    if (process.env["SHADCN_VERBOSE"] === "true") {
      console.log(highlighter.info(`[verbose] ${args.join(" ")}`))
    }
  },
}
