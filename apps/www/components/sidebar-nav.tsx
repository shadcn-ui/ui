"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SidebarNavItem } from "types/nav";

import { type DocsConfig } from "@/config/docs";
import { cn } from "@/lib/utils";

export interface DocsSidebarNavProps {
  config: DocsConfig;
}

export function DocsSidebarNav({ config }: DocsSidebarNavProps) {
  const pathname = usePathname();

  const items = pathname?.startsWith("/charts")
    ? config.chartsNav
    : config.sidebarNav;

  return items.length ? (
    <div className="w-full">
      {items.map((item, index) => (
        <div key={index} className={cn("pb-4")}>
          <h4 className="mb-1 rounded-md px-2 py-1 text-sm font-semibold">
            {item.title}
          </h4>
          {item?.items?.length && (
            <DocsSidebarNavItems items={item.items} pathname={pathname} />
          )}
        </div>
      ))}
    </div>
  ) : null;
}

interface DocsSidebarNavItemsProps {
  items: SidebarNavItem[];
  pathname: string | null;
}

export function DocsSidebarNavItems({
  items,
  pathname,
}: DocsSidebarNavItemsProps) {
  return items?.length ? (
    <div className="grid grid-flow-row auto-rows-max text-sm">
      {items.map((item, index) =>
        item.href && !item.disabled ? (
          <Link
            key={index}
            href={item.href}
            className={cn(
              "group flex w-full items-center rounded-md bg-gray-600 mt-4 px-3 py-2 text-white",
              pathname === item.href
                ? "font-semibold text-white border border-[#525252]"
                : "text-white border border-transparent",
              "hover:bg-gray-500 hover:border-gray-400"
            )}
            target={item.external ? "_blank" : ""}
            rel={item.external ? "noreferrer" : ""}
          >
            {item.title}
            {item.label && (
              <span className="ml-auto rounded-md bg-[#adfa1d] px-2 py-0.5 text-xs leading-none text-[#000000]">
                {item.label}
              </span>
            )}
          </Link>
        ) : (
          <span
            key={index}
            className={cn(
              "flex w-full items-center rounded-md bg-gray-600 mt-4 px-3 py-2 text-white cursor-not-allowed",
              "hover:bg-gray-500"
            )}
          >
            {item.title}
            {item.label && (
              <span className="ml-auto rounded-md bg-[#4a4a4a] px-2 py-0.5 text-xs leading-none text-[#d1d1d1]">
                {item.label}
              </span>
            )}
          </span>
        )
      )}
    </div>
  ) : null;
}
