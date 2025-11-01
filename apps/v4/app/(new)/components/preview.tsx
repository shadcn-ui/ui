import { Suspense } from "react"

import { getRegistryComponent } from "@/lib/registry"
import { cn } from "@/lib/utils"
import { getRegistryItemsUsingParams } from "@/app/(new)/lib/api"
import {
  designSystemSearchParamsCache,
  getDesignSystemParamsCacheKey,
  type DesignSystemSearchParams,
} from "@/app/(new)/lib/search-params"

export async function Preview() {
  const params = designSystemSearchParamsCache.all()
  const key = getDesignSystemParamsCacheKey(params)

  return (
    <Suspense key={key} fallback={<div>Loading...</div>}>
      <PreviewComponent params={params} />
    </Suspense>
  )
}

async function PreviewComponent({
  params,
}: {
  params: DesignSystemSearchParams
}) {
  const items = await getRegistryItemsUsingParams(params)

  return (
    <div className="bg-muted flex flex-1 flex-col gap-6 p-6">
      {items
        .filter((item) => item !== null)
        .map((item) => {
          const Component = getRegistryComponent(item.name, params.style)
          if (!Component) {
            return null
          }
          return (
            <div
              key={item.name}
              className="bg-background rounded-lg border p-4"
            >
              <Component />
            </div>
          )
        })}
    </div>
  )
}
