"use client"

import Link from "next/link"
import { ChevronDownIcon } from "lucide-react"
import { Button } from "react-aria-components"

import {
  useTranslation,
  type Translations,
} from "@/components/language-selector"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/styles/aria-nova/ui-rtl/breadcrumb"
import {
  DropdownMenu,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/styles/aria-nova/ui-rtl/dropdown-menu"

const translations: Translations = {
  en: {
    dir: "ltr",
    values: {
      home: "Home",
      components: "Components",
      documentation: "Documentation",
      themes: "Themes",
      github: "GitHub",
      breadcrumb: "Breadcrumb",
    },
  },
  ar: {
    dir: "rtl",
    values: {
      home: "الرئيسية",
      components: "المكونات",
      documentation: "التوثيق",
      themes: "السمات",
      github: "جيت هاب",
      breadcrumb: "مسار التنقل",
    },
  },
  he: {
    dir: "rtl",
    values: {
      home: "בית",
      components: "רכיבים",
      documentation: "תיעוד",
      themes: "ערכות נושא",
      github: "גיטהאב",
      breadcrumb: "פירורי לחם",
    },
  },
}

export function BreadcrumbRtl() {
  const { dir, t, language } = useTranslation(translations, "ar")

  return (
    <Breadcrumb dir={dir}>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink
            href="/"
            render={(props) =>
              "href" in props ? <Link {...props} /> : <span {...props} />
            }
          >
            {t.home}
          </BreadcrumbLink>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <DropdownMenuTrigger>
            <Button className="flex items-center gap-1">
              {t.components}
              <ChevronDownIcon data-icon="inline-end" className="size-3.5" />
            </Button>
            <DropdownMenu
              placement={dir === "rtl" ? "bottom end" : "bottom start"}
              data-lang={dir === "rtl" ? language : undefined}
              dir={dir}
            >
              <DropdownMenuGroup>
                <DropdownMenuItem>{t.documentation}</DropdownMenuItem>
                <DropdownMenuItem>{t.themes}</DropdownMenuItem>
                <DropdownMenuItem>{t.github}</DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenu>
          </DropdownMenuTrigger>
        </BreadcrumbItem>

        <BreadcrumbItem>
          <BreadcrumbPage>{t.breadcrumb}</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  )
}
