"use client"

import * as React from "react"
import { Button } from "@/examples/radix/ui-rtl/button"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/examples/radix/ui-rtl/collapsible"
import { ChevronsUpDown } from "lucide-react"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      orderNumber: "Order #4189",
      status: "Status",
      shipped: "Shipped",
      shippingAddress: "Shipping address",
      address: "100 Market St, San Francisco",
      items: "Items",
      itemsDescription: "2x Studio Headphones",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      orderNumber: "الطلب #4189",
      status: "الحالة",
      shipped: "تم الشحن",
      shippingAddress: "عنوان الشحن",
      address: "100 Market St, San Francisco",
      items: "العناصر",
      itemsDescription: "2x سماعات الاستوديو",
    },
  },
  he: {
    dir: "rtl",
    values: {
      orderNumber: "הזמנה #4189",
      status: "סטטוס",
      shipped: "נשלח",
      shippingAddress: "כתובת משלוח",
      address: "100 Market St, San Francisco",
      items: "פריטים",
      itemsDescription: "2x אוזניות סטודיו",
    },
  },
}

export function CollapsibleRtl() {
  const { dir, t } = useTranslation(translations, "ar")
  const [isOpen, setIsOpen] = React.useState(false)

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="flex w-[350px] flex-col gap-2"
      dir={dir}
    >
      <div className="flex items-center justify-between gap-4 px-4">
        <h4 className="text-sm font-semibold">{t.orderNumber}</h4>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" size="icon" className="size-8">
            <ChevronsUpDown />
            <span className="sr-only">Toggle details</span>
          </Button>
        </CollapsibleTrigger>
      </div>
      <div className="flex items-center justify-between rounded-md border px-4 py-2 text-sm">
        <span className="text-muted-foreground">{t.status}</span>
        <span className="font-medium">{t.shipped}</span>
      </div>
      <CollapsibleContent className="flex flex-col gap-2">
        <div className="rounded-md border px-4 py-2 text-sm">
          <p className="font-medium">{t.shippingAddress}</p>
          <p className="text-muted-foreground">{t.address}</p>
        </div>
        <div className="rounded-md border px-4 py-2 text-sm">
          <p className="font-medium">{t.items}</p>
          <p className="text-muted-foreground">{t.itemsDescription}</p>
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
