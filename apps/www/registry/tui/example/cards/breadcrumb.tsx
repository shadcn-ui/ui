import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Breadcrumb, BreadcrumItem } from "../../ui/breadcrumb"
import { BreadcrumbIcon } from "../breadcrumbIcon"
import { BreadcrumbText } from "../breadcrumbText"
import { BreadcrumbIconWithText } from "../breadcrumbIconText"


export function CardsBreadcrumb() {
  const firstItem:BreadcrumItem[] = [
    { icon: 'house-solid', text: "Home", href: '#', display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#', display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]

  const secondItem:BreadcrumItem[] = [
    { icon: 'house-solid', text: "Home", href: '#', display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#', display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]

  const thirdItem:BreadcrumItem[] = [
    { icon: 'house-solid', text: "Home", href: '#',  display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#',  display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-primary">Breadcrumb</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-7 space-x-7">

        <div className="font-bold text-primary">Contained</div>
        <Breadcrumb items={firstItem} BreadcrumbStyle="shadow"  />

        <div className="font-bold text-primary">Full Width Bar</div>
        <Breadcrumb items={firstItem} BreadcrumbStyle="fullWidth" />

        <div className="font-bold text-primary">Simple With Chevron</div>
        <Breadcrumb items={secondItem} itemIconStyle="h-4 w-4" />

        <div className="font-bold text-primary">Simple with slashes</div>
        <Breadcrumb items={thirdItem} itemIcon="slash-forward-thin" itemIconStyle="h-4 w-4" />
        </div>
          <BreadcrumbIcon />
          <BreadcrumbText />
          <BreadcrumbIconWithText />
      </CardContent>
    </Card>
  )
}