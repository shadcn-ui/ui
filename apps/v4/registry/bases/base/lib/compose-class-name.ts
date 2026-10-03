import { cn as mergeClasses, type ClassValue } from "cn"

type ClassNameResult<Value> = Value extends (
  state: infer State
) => string | undefined
  ? (state: State) => string
  : string

export function cn<Value extends ClassValue>(
  ...inputs: [...ClassValue[], Value]
): ClassNameResult<Value>
export function cn(...inputs: ClassValue[]): string
export function cn(...inputs: ClassValue[]) {
  const className = inputs.pop()

  // Defer the final className callback until the primitive supplies its state.
  if (typeof className === "function") {
    return (state: unknown) => mergeClasses(...inputs, className(state))
  }

  return mergeClasses(...inputs, className)
}
