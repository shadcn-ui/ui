import { useAtom } from "jotai"
import { atomWithStorage } from "jotai/utils"

import {
  designSystemSearchParams,
  DesignSystemSearchParams,
} from "@/app/(new)/lib/search-params"

const sharedParamsAtom = atomWithStorage<DesignSystemSearchParams>(
  "ds-shared-params",
  {
    iconLibrary: null,
    item: null,
    theme: null,
  },
  undefined,
  {
    getOnInit: true,
  }
)

export function useSharedParams() {
  const [sharedParams, setSharedParams] = useAtom(sharedParamsAtom)
  return { sharedParams, setSharedParams }
}
