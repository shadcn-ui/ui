import { ArrowLeftIcon, ExternalLinkIcon } from "lucide-react"

import { Badge } from "@/styles/base-sera/ui/badge"
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
                  Back to articles
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="line-clamp-1 font-heading text-3xl tracking-wide uppercase md:text-3xl lg:text-4xl">
            EDIT ARTICLE
          </h1>
        </div>
        <ButtonGroup className="gap-2 md:gap-4">
          <Badge title="2 minutes ago">Autosaved</Badge>
          <ButtonGroup className="gap-2 md:gap-4">
            <Button variant="link">
              Preview
              <ExternalLinkIcon data-icon="inline-end" />
            </Button>
            <Button>Submit Draft</Button>
          </ButtonGroup>
        </ButtonGroup>
      </div>
    </header>
  )
}
