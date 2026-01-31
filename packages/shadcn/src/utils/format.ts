import { basename, extname } from "path"
import {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} from "change-case"

export const formatCase = {
  camelCase,
  capitalCase,
  constantCase,
  dotCase,
  kebabCase,
  pascalCase,
  pascalSnakeCase,
  pathCase,
  sentenceCase,
  snakeCase,
  trainCase,
} as const

export const formatCases = [
  "camelCase",
  "capitalCase",
  "constantCase",
  "dotCase",
  "kebabCase",
  "pascalCase",
  "pascalSnakeCase",
  "pathCase",
  "sentenceCase",
  "snakeCase",
  "trainCase",
] as const

export type FormatCase = (typeof formatCases)[number]

export function formatFileName(fileName: string, fileCase?: FormatCase) {
  if (!fileCase) {
    return fileName
  }
  const extName = extname(fileName)
  const baseName = basename(fileName, extName)
  const newName = formatCase[fileCase](baseName)
  const pathIndex = fileName.lastIndexOf("/")
  if (pathIndex === -1) {
    return `${newName}${extName}`
  } else {
    return `${fileName.substring(0, pathIndex)}/${newName}${extName}`
  }
}
