import { CASE_CONVENTION } from "@/src/utils/registry"
import toCamelCase from "lodash.camelcase"
import toKebabCase from "lodash.kebabcase"
import toSnakeCase from "lodash.snakecase"


export function formatFileName(
  fullFileName: string,
  caseConvention: CASE_CONVENTION
) {
  let fileNameWithExt = fullFileName;
  let fileName = fileNameWithExt;
  let path = '';
  let ext = '';

  if (fullFileName.includes('/')) {
    const lastSlashIndex = fullFileName.lastIndexOf('/');
    fileNameWithExt = fullFileName.substring(lastSlashIndex + 1);
    path = fullFileName.substring(0, lastSlashIndex + 1);
  }

  if (fileNameWithExt.includes('.')) {
    const lastDotIndex = fileNameWithExt.lastIndexOf('.');
    fileName = fileNameWithExt.substring(0, lastDotIndex);
    ext = fileNameWithExt.substring(lastDotIndex);
  }

  switch (caseConvention) {
    case CASE_CONVENTION.KEBAB:
      fileName = toKebabCase(fileName)
      break
    case CASE_CONVENTION.PASCAL:
      const camelCase = toCamelCase(fileName)
      fileName = camelCase.charAt(0).toUpperCase() + camelCase.slice(1)
      break
    case CASE_CONVENTION.CAMEL:
      fileName = toCamelCase(fileName)
      break
    case CASE_CONVENTION.SNAKE:
      fileName = toSnakeCase(fileName)
      break
  }

  return `${path}${fileName}${ext}`
}
