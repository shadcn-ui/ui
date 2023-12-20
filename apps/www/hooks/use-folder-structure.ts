import { useAtom, atom } from "jotai"
import { atomWithStorage } from "jotai/utils"
import { z } from "zod"
import { packageZod } from "@/lib/validations/packages"

export type PackageFile = Pick<z.infer<typeof packageZod>, "name" | "files"> 

const configAtom = atom<PackageFile>({
  name: "",
  files: [],
})

export function useFolder() {
  return useAtom(configAtom)
}
