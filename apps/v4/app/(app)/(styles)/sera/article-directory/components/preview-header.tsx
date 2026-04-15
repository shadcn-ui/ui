import { ArrowLeftIcon, PlusIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/styles/base-sera/ui/breadcrumb"
import { Button } from "@/styles/base-sera/ui/button"
import { ButtonGroup } from "@/styles/base-sera/ui/button-group"

export function PreviewHeader() {
  return (
    <header>
      <div className="container flex flex-col items-center justify-center gap-(--gap) py-(--gap) sm:flex-row sm:justify-between">
        <div className="flex flex-col gap-2 text-center sm:text-left">
          <Breadcrumb>
            <BreadcrumbList className="justify-center md:justify-start">
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="#"
                  className="inline-flex items-center gap-1.5"
                >
                  <ArrowLeftIcon className="size-3" />
                  Editorial Dashboard
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="line-clamp-1 font-heading text-3xl tracking-wide uppercase md:text-3xl lg:text-4xl">
            Article Directory
          </h1>
        </div>
        <div>
          <ButtonGroup className="gap-2 sm:ml-auto md:gap-4">
            <Button>
              <PlusIcon data-icon="inline-start" />
              New Article
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </header>
  )
}
