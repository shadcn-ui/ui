"use client"

import Link from "next/link"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/aria/components/example"
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/registry/bases/aria/ui/breadcrumb"
import { Button } from "@/registry/bases/aria/ui/button"
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/registry/bases/aria/ui/dropdown-menu"

export default function BreadcrumbExample() {
  return (
    <ExampleWrapper>
      <BreadcrumbBasic />
      <BreadcrumbWithDropdown />
      <BreadcrumbWithLink />
    </ExampleWrapper>
  )
}

function BreadcrumbBasic() {
  return (
    <Example title="Basic" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbWithDropdown() {
  return (
    <Example title="With Dropdown" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="#">Home</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <DropdownMenuTrigger>
              <Button size="icon-sm" variant="ghost">
                <BreadcrumbEllipsis />
                <span className="sr-only">Toggle menu</span>
              </Button>
              <DropdownMenu placement="bottom start">
                <DropdownMenuItem>Documentation</DropdownMenuItem>
                <DropdownMenuItem>Themes</DropdownMenuItem>
                <DropdownMenuItem>GitHub</DropdownMenuItem>
              </DropdownMenu>
            </DropdownMenuTrigger>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink href="#">Components</BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}

function BreadcrumbWithLink() {
  return (
    <Example title="With Link" className="items-center justify-center">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              render={(props) =>
                "href" in props ? <Link {...props} /> : <span {...props} />
              }
            >
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbEllipsis />
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbLink
              href="#"
              render={(props) =>
                "href" in props ? <Link {...props} /> : <span {...props} />
              }
            >
              Components
            </BreadcrumbLink>
          </BreadcrumbItem>

          <BreadcrumbItem>
            <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    </Example>
  )
}
