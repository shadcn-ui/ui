import { ArrowLeftIcon, SlidersHorizontalIcon, UploadIcon } from "lucide-react"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
} from "@/styles/base-sera/ui/breadcrumb"
import { Button } from "@/styles/base-sera/ui/button"
import { ButtonGroup } from "@/styles/base-sera/ui/button-group"

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
                  Asset management
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="line-clamp-1 font-heading text-3xl tracking-wide uppercase md:text-3xl lg:text-4xl">
            Media Library
          </h1>
        </div>
        <ButtonGroup className="gap-2 sm:ml-auto md:gap-4">
          <Button
            variant="outline"
            className="bg-background hover:bg-background/80"
          >
            <SlidersHorizontalIcon data-icon="inline-start" />
            Filters
          </Button>
          <Button>
            <UploadIcon data-icon="inline-start" />
            Upload Assets
          </Button>
        </ButtonGroup>
      </div>
    </header>
  )
}
