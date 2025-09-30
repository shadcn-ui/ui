import { RegistryItemFile } from "@/src/schema"

const createRegistryFile = (
  filePath: string,
  fileType: RegistryItemFile["type"],
  target: string = ""
): RegistryItemFile => {
  //
  return {
    path: filePath,
    type: fileType,
    target: target,
  }
}

export { createRegistryFile }
