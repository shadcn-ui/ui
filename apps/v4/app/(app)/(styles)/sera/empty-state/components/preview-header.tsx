import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/styles/base-sera/ui/breadcrumb"
import { Button } from "@/styles/base-sera/ui/button"

export function PreviewHeader() {
  return (
    <header>
      <div className="container flex flex-col items-center justify-center gap-(--gap) py-(--gap) sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="#" className="flex items-center gap-1.5">
                  <ArrowLeftIcon className="size-3.5" />
                  Editorial Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="line-clamp-1 font-heading text-3xl tracking-wide uppercase md:text-3xl lg:text-4xl">
            Article Directory
          </h1>
        </div>
        <Button className="sm:ml-auto">
          <PlusIcon data-icon="inline-start" />
          New Article
        </Button>
      </div>
    </header>
  )
}
