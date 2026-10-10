import type {
  ItemRegistration,
  QuestionnaireItemDefinition,
  QuestionnaireShortcutMode,
} from "./types"
import { getShortcutKeys } from "./utils"

type QuestionnaireCollection = {
  enabledItems: readonly QuestionnaireItemDefinition[]
  itemByName: ReadonlyMap<string, QuestionnaireItemDefinition>
  items: readonly QuestionnaireItemDefinition[]
}

function createQuestionnaireCollection(
  items: readonly QuestionnaireItemDefinition[] | undefined
): QuestionnaireCollection | null {
  if (items === undefined) {
    return null
  }

  return {
    enabledItems: items.filter((item) => !item.disabled),
    itemByName: new Map(items.map((item) => [item.name, item])),
    items,
  }
}

function getInitialItemName(
  collection: QuestionnaireCollection | null,
  defaultItem: string | undefined
) {
  if (!collection) {
    return defaultItem ?? null
  }

  const defaultDefinition = defaultItem
    ? collection.itemByName.get(defaultItem)
    : undefined

  if (defaultDefinition && !defaultDefinition.disabled) {
    return defaultDefinition.name
  }

  return collection.enabledItems[0]?.name ?? null
}

function getShortcutByChoiceValue(
  item: QuestionnaireItemDefinition | undefined,
  shortcuts: QuestionnaireShortcutMode | null
) {
  const shortcutByChoiceValue = new Map<string, string>()

  if (!item || !shortcuts) {
    return shortcutByChoiceValue
  }

  const keys = getShortcutKeys(shortcuts)
  let shortcutIndex = 0

  for (const choice of item.choices ?? []) {
    if (choice.disabled) {
      continue
    }

    const shortcut = keys[shortcutIndex]

    if (!shortcut) {
      break
    }

    shortcutByChoiceValue.set(choice.value, shortcut)
    shortcutIndex += 1
  }

  return shortcutByChoiceValue
}

function getCollectionDefinitionWarnings(
  collection: QuestionnaireCollection,
  defaultItem: string | undefined
) {
  const warnings: string[] = []
  const itemNames = new Set<string>()

  for (const item of collection.items) {
    if (itemNames.has(item.name)) {
      warnings.push(`Item name "${item.name}" is defined more than once.`)
    }

    itemNames.add(item.name)

    const choiceValues = new Set<string>()

    for (const choice of item.choices ?? []) {
      if (choiceValues.has(choice.value)) {
        warnings.push(
          `Choice value "${choice.value}" is defined more than once in item "${item.name}".`
        )
      }

      choiceValues.add(choice.value)
    }
  }

  if (defaultItem) {
    const defaultDefinition = collection.itemByName.get(defaultItem)

    if (!defaultDefinition || defaultDefinition.disabled) {
      warnings.push(
        `defaultItem "${defaultItem}" does not identify an enabled item. The first enabled item will be used instead.`
      )
    }
  }

  return warnings
}

function getCollectionRegistrationWarnings(
  collection: QuestionnaireCollection,
  registrations: readonly ItemRegistration[],
  shortcuts: QuestionnaireShortcutMode | null
) {
  const warnings: string[] = []
  const registrationByName = new Map(
    registrations.map((registration) => [registration.name, registration])
  )

  for (const definition of collection.items) {
    const registration = registrationByName.get(definition.name)

    if (!registration) {
      if (!definition.disabled) {
        warnings.push(
          `Item "${definition.name}" is defined but has no rendered Questionnaire.Item.`
        )
      }

      continue
    }

    if (registration.disabled !== Boolean(definition.disabled)) {
      warnings.push(
        `Item "${definition.name}" has different disabled values in Root.items and Questionnaire.Item.`
      )
    }

    if (registration.required !== Boolean(definition.required)) {
      warnings.push(
        `Item "${definition.name}" has different required values in Root.items and Questionnaire.Item.`
      )
    }

    const definedChoices = definition.choices ?? []
    const definedChoiceByValue = new Map(
      definedChoices.map((choice) => [choice.value, choice])
    )
    const registeredChoiceByValue = new Map(
      registration.choices.map((choice) => [choice.value, choice])
    )

    for (const choice of definedChoices) {
      const registeredChoice = registeredChoiceByValue.get(choice.value)

      if (!registeredChoice) {
        warnings.push(
          `Choice "${choice.value}" is defined for item "${definition.name}" but has no rendered Questionnaire.Choice.`
        )
        continue
      }

      if (registeredChoice.disabled !== Boolean(choice.disabled)) {
        warnings.push(
          `Choice "${choice.value}" in item "${definition.name}" has different disabled values in Root.items and Questionnaire.Choice.`
        )
      }
    }

    if (shortcuts) {
      for (const choice of registration.choices) {
        if (!definedChoiceByValue.has(choice.value)) {
          warnings.push(
            `Rendered choice "${choice.value}" in item "${definition.name}" is missing from Root.items and will not receive a shortcut.`
          )
        }
      }

      const definedOrder = definedChoices
        .filter((choice) => !choice.disabled)
        .map((choice) => choice.value)
      const registeredOrder = registration.choices
        .filter((choice) => !choice.disabled)
        .map((choice) => choice.value)

      const sameChoices =
        definedOrder.length > 0 &&
        definedOrder.length === registeredOrder.length &&
        definedOrder.every((choiceValue) =>
          registeredOrder.includes(choiceValue)
        )

      if (
        sameChoices &&
        definedOrder.some(
          (choiceValue, index) => choiceValue !== registeredOrder[index]
        )
      ) {
        warnings.push(
          `Choice order for item "${definition.name}" differs between Root.items and the rendered Questionnaire.Choice elements.`
        )
      }
    }
  }

  for (const registration of registrations) {
    if (
      !registration.disabled &&
      !collection.itemByName.has(registration.name)
    ) {
      warnings.push(
        `Rendered item "${registration.name}" is missing from Root.items and is excluded from the questionnaire collection.`
      )
    }
  }

  return warnings
}

export {
  createQuestionnaireCollection,
  getCollectionDefinitionWarnings,
  getCollectionRegistrationWarnings,
  getInitialItemName,
  getShortcutByChoiceValue,
}
