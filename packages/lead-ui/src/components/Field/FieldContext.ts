import { createContext, useContext } from "react"

export interface FieldContextValue {
  fieldId: string
  descriptionId: string
  errorId: string
  hasDescription: boolean
  hasError: boolean
  invalid: boolean
  disabled: boolean
  registerDescription: () => void
  unregisterDescription: () => void
  registerError: () => void
  unregisterError: () => void
}

export const FieldContext = createContext<FieldContextValue | null>(null)

export function useFieldContext(): FieldContextValue | null {
  return useContext(FieldContext)
}
