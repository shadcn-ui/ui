"use client"

import * as React from "react"

import { iconLibraries, type IconLibraryName } from "@/registry/config"
import { LockButton } from "@/app/(app)/(create)/components/lock-button"
import {
  Picker,
  PickerContent,
  PickerGroup,
  PickerRadioGroup,
  PickerRadioItem,
  PickerTrigger,
} from "@/app/(app)/(create)/components/picker"
import { usePreviewOverride } from "@/app/(app)/(create)/components/preview-override"
import { useDesignSystemSearchParams } from "@/app/(app)/(create)/lib/search-params"

const logos = {
  lucide: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        d="M14 12a4 4 0 0 0-8 0 8 8 0 1 0 16 0 11.97 11.97 0 0 0-4-8.944"
      />
      <path
        stroke="currentColor"
        d="M10 12a4 4 0 0 0 8 0 8 8 0 1 0-16 0 11.97 11.97 0 0 0 4.063 9"
      />
    </svg>
  ),
  tabler: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="none"
      viewBox="0 0 32 32"
    >
      <path
        fill="currentColor"
        d="M31.288 7.107A8.83 8.83 0 0 0 24.893.712a55.9 55.9 0 0 0-17.786 0A8.83 8.83 0 0 0 .712 7.107a55.9 55.9 0 0 0 0 17.786 8.83 8.83 0 0 0 6.395 6.395c5.895.95 11.89.95 17.786 0a8.83 8.83 0 0 0 6.395-6.395c.95-5.895.95-11.89 0-17.786"
      />
      <path
        fill="#fff"
        d="m17.884 9.076 1.5-2.488 6.97 6.977-2.492 1.494zm-7.96 3.127 7.814-.909 3.91 3.66-.974 7.287-9.582 2.159a3.06 3.06 0 0 1-2.17-.329l5.244-4.897c.91.407 2.003.142 2.587-.626.584-.77.488-1.818-.226-2.484s-1.84-.755-2.664-.21c-.823.543-1.107 1.562-.67 2.412l-5.245 4.89a2.53 2.53 0 0 1-.339-2.017z"
      />
    </svg>
  ),
  hugeicons: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="128"
      height="128"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
    >
      <path d="M2 9.5H22" stroke="currentColor"></path>
      <path
        d="M20.5 9.5H3.5L4.23353 15.3682C4.59849 18.2879 4.78097 19.7477 5.77343 20.6239C6.76589 21.5 8.23708 21.5 11.1795 21.5H12.8205C15.7629 21.5 17.2341 21.5 18.2266 20.6239C19.219 19.7477 19.4015 18.2879 19.7665 15.3682L20.5 9.5Z"
        stroke="currentColor"
      ></path>
      <path
        d="M5 9C5 5.41015 8.13401 2.5 12 2.5C15.866 2.5 19 5.41015 19 9"
        stroke="currentColor"
      ></path>
    </svg>
  ),
  phosphor: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      width="32"
      height="32"
    >
      <path fill="none" d="M0 0h32v32H0z" />
      <path
        fill="none"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5h9v16H9zm9 16v9a9 9 0 0 1-9-9M9 5l9 16m0 0h1a8 8 0 0 0 0-16h-1"
      />
    </svg>
  ),
  remixicon: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="24"
      height="24"
      fill="currentColor"
    >
      <path d="M12 2C17.5228 2 22 6.47715 22 12C22 15.3137 19.3137 18 16 18C12.6863 18 10 15.3137 10 12C10 11.4477 9.55228 11 9 11C8.44772 11 8 11.4477 8 12C8 16.4183 11.5817 20 16 20C16.8708 20 17.7084 19.8588 18.4932 19.6016C16.7458 21.0956 14.4792 22 12 22C6.6689 22 2.3127 17.8283 2.0166 12.5713C2.23647 9.45772 4.83048 7 8 7C11.3137 7 14 9.68629 14 13C14 13.5523 14.4477 14 15 14C15.5523 14 16 13.5523 16 13C16 8.58172 12.4183 5 8 5C6.50513 5 5.1062 5.41032 3.90918 6.12402C5.72712 3.62515 8.67334 2 12 2Z" />
    </svg>
  ),
  solar: (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 1024 1024"
      fill="none"
    >
      <path
        fill="currentColor"
        d="M231.568 895.459s-.057-317.869 1.29-323.02c.774-2.96 2.46-.887 8.54 10.492 54.264 101.557 176.21 192.298 319.114 237.455 132.655 41.918 202.129-47.141 123.043-157.732-26.702-37.341-35.127-46.303-289.274-307.706-41.689-42.88-70.437-75.863-70.437-80.813 0-.553 8.418 3.215 18.707 8.374 22.415 11.238 124.572 57.31 187.508 84.563 154.71 66.994 174.327 77.802 214.908 118.411C880.826 621.436 813.984 849.03 626.64 888.38c-50.742 10.658-395.072 7.079-395.072 7.079zm422.915-169.18c-24.406-11.007-62.778-28.085-85.27-37.951-182.594-80.095-219.952-97.933-254.94-121.733-163.986-111.546-132.45-362.603 53.354-424.741 37.365-12.496 26.812-11.93 235.955-12.64 98.741-.335 189.132.512 189.132.512s-.104 73 .055 140.314c.184 77.805-.025 151.057.116 162.782.303 25.056.189 25.168-8.467 8.308-51.062-99.466-174.692-193.793-310.916-237.224-144.244-45.987-217.894 50.75-126.614 166.303 25.406 32.163 62.734 72.023 167.412 178.772 158.812 161.953 192.678 197.911 185.925 197.412-.752-.055-21.335-9.107-45.742-20.114z"
      />
    </svg>
  ),
}

export function IconLibraryPicker({
  isMobile,
  anchorRef,
}: {
  isMobile: boolean
  anchorRef: React.RefObject<HTMLDivElement | null>
}) {
  const [params, setParams] = useDesignSystemSearchParams()
  const { setOverride, clearOverride } = usePreviewOverride()

  const currentIconLibrary = React.useMemo(
    () => iconLibraries[params.iconLibrary as keyof typeof iconLibraries],
    [params.iconLibrary]
  )

  return (
    <div className="group/picker relative">
      <Picker
        onOpenChange={(open) => {
          if (!open) {
            clearOverride()
          }
        }}
      >
        <PickerTrigger>
          <div className="flex flex-col justify-start text-left">
            <div className="text-xs text-muted-foreground">Icon Library</div>
            <div className="text-sm font-medium text-foreground">
              {currentIconLibrary?.title}
            </div>
          </div>
          <div className="pointer-events-none absolute top-1/2 right-4 flex size-4 -translate-y-1/2 items-center justify-center text-base text-foreground select-none md:right-2.5 *:[svg]:text-foreground!">
            {logos[currentIconLibrary?.name as keyof typeof logos]}
          </div>
        </PickerTrigger>
        <PickerContent
          anchor={isMobile ? anchorRef : undefined}
          side={isMobile ? "top" : "right"}
          align={isMobile ? "center" : "start"}
          onMouseLeave={clearOverride}
        >
          <PickerRadioGroup
            value={currentIconLibrary?.name}
            onValueChange={(value) => {
              setParams({ iconLibrary: value as IconLibraryName })
            }}
            onItemPreview={
              isMobile
                ? undefined
                : (value) =>
                    setOverride({ iconLibrary: value as IconLibraryName })
            }
          >
            <PickerGroup>
              {Object.values(iconLibraries).map((iconLibrary) => (
                <PickerRadioItem
                  key={iconLibrary.name}
                  value={iconLibrary.name}
                  closeOnClick={isMobile}
                >
                  {iconLibrary.title}
                </PickerRadioItem>
              ))}
            </PickerGroup>
          </PickerRadioGroup>
        </PickerContent>
      </Picker>
      <LockButton
        param="iconLibrary"
        className="absolute top-1/2 right-8 -translate-y-1/2"
      />
    </div>
  )
}
