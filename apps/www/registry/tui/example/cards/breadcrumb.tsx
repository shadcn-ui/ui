import { Card, CardContent, CardHeader, CardTitle, } from "@/registry/tui/ui/card"
import { Breadcrumbs } from "../../ui/breadcrumb"
import { BreadcrumbIcon } from "../breadcrumbIcon"
import { BreadcrumbText } from "../breadcrumbText"
import { BreadcrumbIconWithText } from "../breadcrumbIconText"


export function CardsBreadcrumb() {
  const firstItem = [
    { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "chevron-right-thin", display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]

  const secondItem = [
    { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "chevron-right-thin", display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "chevron-right-thin", display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]

  const thirdItem = [
    { icon: 'house-solid', text: "Home", href: '#', separatorIcon: "slash-forward-thin", display: "onlyIcon" },
    { icon: "folder-solid", text: 'Projects', href: '#', separatorIcon: "slash-forward-thin", display: "onlyText" },
    { icon: "folder-open-solid", text: 'Project Nero', href: '#', display: "onlyText" },
  ]
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-normal text-primary">Breadcrumbs</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-m font-bold text-primary pb-6">Contained</div>
        <Breadcrumbs dataItem={firstItem} contained={true} iconStyle="h-5 w-5 text-gray-400 hover:text-gray-500" separatorIconStyle="h-full w-6 flex-shrink-0 text-gray-200" textColor="gray" />

        <div className="text-m mt-14 font-bold text-primary pb-6">Full Width Bar</div>
        <Breadcrumbs dataItem={firstItem} fullWidthContained={true} iconStyle="h-5 w-5 text-gray-400 hover:text-gray-500" separatorIconStyle="h-full w-6 flex-shrink-0 text-gray-200" textColor="gray" size="default" />

        <div className="text-m mt-14 font-bold text-primary pb-6">Simple With Chevron</div>
        <Breadcrumbs dataItem={secondItem} withChevronSeparator={true} iconStyle="h-5 w-5 text-gray-400 hover:text-gray-500" separatorIconStyle="h-4 w-4 flex-shrink-0 text-gray-400" textColor="gray" />

        <div className="text-m mt-14 font-bold text-primary pb-6">Simple with slashes</div>
        <Breadcrumbs dataItem={thirdItem} withSlashSeparator={true} iconStyle="h-5 w-5 text-gray-400 hover:text-gray-500" separatorIconStyle="h-4 w-4 flex-shrink-0 text-gray-400" textColor="gray" />

        <div className="space-x-2 space-y-2">
          <BreadcrumbIcon />
          <BreadcrumbText />
          <BreadcrumbIconWithText />
        </div>
      </CardContent>
    </Card>
  )
}