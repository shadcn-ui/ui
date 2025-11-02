import { Suspense } from "react"

import { getRegistryComponent } from "@/lib/registry"
import { Canva, CanvaFrame } from "@/app/(new)/components/canva"
import { getRegistryItemsUsingParams } from "@/app/(new)/lib/api"
import { styleSearchParamsCache } from "@/app/(new)/lib/search-params"
import type { DesignSystemStyle } from "@/app/(new)/lib/style"

export async function Preview() {
  const style = styleSearchParamsCache.get("style")

  return (
    <Suspense key={style} fallback={<div>Loading...</div>}>
      <PreviewComponent style={style} />
    </Suspense>
  )
}

async function PreviewComponent({
  style,
}: {
  style: DesignSystemStyle["name"]
}) {
  const items = await getRegistryItemsUsingParams(style)

  return (
    <Canva>
      {items
        .filter((item) => item !== null)
        .map((item) => {
          const Component = getRegistryComponent(item.name, style)
          if (!Component) {
            return null
          }
          return (
            <CanvaFrame name={item.meta?.canva?.title} key={item.name}>
              <Component />
            </CanvaFrame>
          )
        })}
    </Canva>
  )
}
