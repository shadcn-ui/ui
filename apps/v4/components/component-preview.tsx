import * as React from "react"
import Image from "next/image"

import { getRegistryComponent, getDemoComponent } from "@/lib/registry"
import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"

// Note: ReScript demo components are not loaded dynamically due to Next.js
// static analysis requirements. We show ReScript source code via ComponentSource
// but use TypeScript demos as visual placeholders for base UI components.

export async function ComponentPreview({
  name,
  type,
  className,
  previewClassName,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  styleName = "new-york-v4",
  direction = "ltr",
  caption,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  styleName?: string
  align?: "center" | "start" | "end"
  description?: string
  hideCode?: boolean
  type?: "block" | "component" | "example"
  chromeLessOnMobile?: boolean
  previewClassName?: string
  direction?: "ltr" | "rtl"
  caption?: string
}) {
  if (type === "block") {
    const content = (
      <div className="relative mt-6 aspect-[4/2.5] w-full overflow-hidden rounded-xl border md:-mx-1">
        <Image
          src={`/r/styles/new-york-v4/${name}-light.png`}
          alt={name}
          width={1440}
          height={900}
          className="bg-background absolute top-0 left-0 z-20 w-[970px] max-w-none sm:w-[1280px] md:hidden dark:hidden md:dark:hidden"
        />
        <Image
          src={`/r/styles/new-york-v4/${name}-dark.png`}
          alt={name}
          width={1440}
          height={900}
          className="bg-background absolute top-0 left-0 z-20 hidden w-[970px] max-w-none sm:w-[1280px] md:hidden dark:block md:dark:hidden"
        />
        <div className="bg-background absolute inset-0 hidden w-[1600px] md:block">
          <iframe src={`/view/${styleName}/${name}`} className="size-full" />
        </div>
      </div>
    )

    if (caption) {
      return (
        <figure className="flex flex-col gap-4">
          {content}
          <figcaption className="text-muted-foreground text-center text-sm">
            {caption}
          </figcaption>
        </figure>
      )
    }

    return content
  }

  // For base UI, we only show ReScript components
  // Since dynamic imports with template literals don't work in Next.js,
  // we'll use TypeScript demos as placeholders but show ReScript source code
  const base = styleName?.split("-")[0]
  let Component: React.ComponentType | React.LazyExoticComponent<React.ComponentType> | undefined

  if (base === "base") {
    // For base UI, use TypeScript demo as placeholder
    // The ReScript source code will be shown in ComponentSource
    Component = getDemoComponent(name, styleName)
    
    // If no demo found, try registry component
    if (!Component) {
      Component = getRegistryComponent(name, styleName)
    }
  } else {
    // For other bases, use TypeScript demo
    Component = getDemoComponent(name, styleName)
    
    // Fallback to registry component if no demo found
    if (!Component) {
      Component = getRegistryComponent(name, styleName)
    }
  }

  if (!Component) {
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        Component{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>{" "}
        not found in registry.
      </p>
    )
  }

  // Render component - handle both regular and lazy components
  // For server components, lazy components resolve synchronously during SSR
  // We use React.createElement to ensure proper rendering
  let componentElement: React.ReactNode
  try {
    componentElement = React.createElement(Component)
  } catch (error) {
    console.error(`Error rendering component ${name}:`, error)
    return (
      <p className="text-muted-foreground mt-6 text-sm">
        Error rendering component{" "}
        <code className="bg-muted relative rounded px-[0.3rem] py-[0.2rem] font-mono text-sm">
          {name}
        </code>
        .
      </p>
    )
  }

  // Extract component name from demo names (e.g., "accordion-demo" -> "accordion")
  // ComponentSource needs the base component name, not the demo name
  // For demo names, extract the base component name by taking everything before the last hyphen
  // For simple component names like "accordion", use as-is
  const componentNameForSource = name.includes("-")
    ? name.split("-").slice(0, -1).join("-") || name
    : name

  // Await ComponentSource to ensure it's fully resolved before passing to client component
  // This prevents hydration mismatches
  // If ComponentSource returns null, use null directly (React handles null gracefully)
  const source = await ComponentSource({
    name: componentNameForSource,
    collapsible: false,
    styleName,
  })
  
  const sourcePreview = await ComponentSource({
    name: componentNameForSource,
    collapsible: false,
    styleName,
    maxLines: 3,
  })

  const content = (
    <ComponentPreviewTabs
      className={className}
      previewClassName={previewClassName}
      align={align}
      hideCode={hideCode}
      component={componentElement}
      source={source}
      sourcePreview={sourcePreview}
      chromeLessOnMobile={chromeLessOnMobile}
      direction={direction}
      styleName={styleName}
      {...props}
    />
  )

  if (caption) {
    return (
      <figure
        data-hide-code={hideCode}
        className="flex flex-col data-[hide-code=true]:gap-4"
      >
        {content}
        <figcaption className="text-muted-foreground -mt-8 text-center text-sm data-[hide-code=true]:mt-0">
          {caption}
        </figcaption>
      </figure>
    )
  }

  return content
}
