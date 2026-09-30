import * as React from "react"

import type {
  QuestionnaireChoiceContextValue,
  QuestionnaireContextValue,
  QuestionnaireItemContextValue,
} from "./types"

const QuestionnaireChoiceContext =
  React.createContext<QuestionnaireChoiceContextValue | null>(null)
const QuestionnaireContext =
  React.createContext<QuestionnaireContextValue | null>(null)
const QuestionnaireItemContext =
  React.createContext<QuestionnaireItemContextValue | null>(null)

function useQuestionnaireContext(component: string) {
  const context = React.useContext(QuestionnaireContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a Questionnaire.Root component.`
    )
  }

  return context
}

function useQuestionnaireChoiceContext(component: string) {
  const context = React.useContext(QuestionnaireChoiceContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a Questionnaire.Choice component.`
    )
  }

  return context
}

function useQuestionnaireItemContext(component: string) {
  const context = React.useContext(QuestionnaireItemContext)

  if (!context) {
    throw new Error(
      `${component} must be used within a Questionnaire.Item component.`
    )
  }

  return context
}

export {
  QuestionnaireChoiceContext,
  QuestionnaireContext,
  QuestionnaireItemContext,
  useQuestionnaireChoiceContext,
  useQuestionnaireContext,
  useQuestionnaireItemContext,
}
