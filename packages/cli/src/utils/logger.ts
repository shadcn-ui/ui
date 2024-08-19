import { cyan, green, red, yellow } from "kleur/colors"

export const logger = {
  error(...args: unknown[]) {
    console.log(red(args.join(" ")))
  },
  warn(...args: unknown[]) {
    console.log(yellow(args.join(" ")))
  },
  info(...args: unknown[]) {
    console.log(cyan(args.join(" ")))
  },
  success(...args: unknown[]) {
    console.log(green(args.join(" ")))
  },
  break() {
    console.log("")
  },
}
