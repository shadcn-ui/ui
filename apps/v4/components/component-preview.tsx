import Image from "next/image"

import { ComponentPreviewTabs } from "@/components/component-preview-tabs"
import { ComponentSource } from "@/components/component-source"
import { Index } from "@/registry/__index__"

export function ComponentPreview({
  name,
  type,
  className,
  align = "center",
  hideCode = false,
  chromeLessOnMobile = false,
  ...props
}: React.ComponentProps<"div"> & {
  name: string
  align?: "center" | "start" | "end"
  description?: string
  hideCode?: boolean
  type?: "block" | "component" | "example"
  chromeLessOnMobile?: boolean
}) {
  const Component = Index[name]?.component

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

  if (type === "block") {
    return (
      <div className="relative aspect-[4/2.5] w-full overflow-hidden rounded-md border md:-mx-1">
        {/* Client-only logic for mobile fallback separated to avoid fs bundling issues. */}
        <BlockPreviewClient name={name} />
        <div className="bg-background absolute inset-0 hidden w-[1600px] md:block">
          <iframe src={`/view/${name}`} className="size-full" />
        </div>
      </div>
    )
  }

  return (
    <ComponentPreviewTabs
      className={className}
      align={align}
      hideCode={hideCode}
      component={<Component />}
      source={<ComponentSource name={name} collapsible={false} />}
      chromeLessOnMobile={chromeLessOnMobile}
      {...props}
    />
  )
}

// Client wrapper moved out to prevent promoting entire file to client (which causes fs usage issues downstream).
// This file stays a server component; only this sub-component is client.
// It handles mobile (<md) screenshot error fallback.
// We keep it here for locality but it could be split into its own file if desired.
// eslint-disable-next-line react/display-name
const BlockPreviewClient = (({ name }: { name: string }) => {
  return (
    <>
      {/* Wrapper rendered only on mobile with Tailwind hidden classes controlling visibility. */}
      <BlockPreviewClientInner name={name} />
    </>
  )
}) as unknown as React.FC<{ name: string }>

// Separate client component actually using state.
// Placed below to avoid confusion and preserve server component above.
// eslint-disable-next-line
function BlockPreviewClientInner({ name }: { name: string }) {
  return <ClientFallback name={name} />
}

// Actual client logic extracted.
// eslint-disable-next-line
function ClientFallback({ name }: { name: string }) {
  return (
    <>
      <noscript>
        <Image
          src={`/r/styles/new-york-v4/${name}-light.png`}
          alt={name}
          width={1440}
          height={900}
          className="bg-background absolute top-0 left-0 z-20 w-[970px] max-w-none sm:w-[1280px] md:hidden dark:hidden md:dark:hidden"
        />
      </noscript>
      {/* Dynamic client part */}
      <script
        dangerouslySetInnerHTML={{
          __html: `
          (function(){
            var light = document.createElement('img');
            light.src = '/r/styles/new-york-v4/${name}-light.png';
            light.alt = '${name}';
            light.width = 1440; light.height = 900;
            light.className = 'bg-background absolute top-0 left-0 z-20 w-[970px] max-w-none sm:w-[1280px] md:hidden dark:hidden md:dark:hidden';
            light.onerror = fallback;
            var dark = document.createElement('img');
            dark.src = '/r/styles/new-york-v4/${name}-dark.png';
            dark.alt = '${name}';
            dark.width = 1440; dark.height = 900;
            dark.className = 'bg-background absolute top-0 left-0 z-20 hidden w-[970px] max-w-none sm:w-[1280px] md:hidden dark:block md:dark:hidden';
            dark.onerror = fallback;
            function fallback(){
              if(window.__shadcnBlockFallbackApplied) return; 
              window.__shadcnBlockFallbackApplied = true;
              var container = light.parentElement || document.currentScript.parentElement;
              if(!container) return;
              // Remove images (if partially loaded) and insert iframe.
              [light,dark].forEach(function(el){if(el && el.parentElement) el.parentElement.removeChild(el);});
              var iframeWrapper = document.createElement('div');
              iframeWrapper.className = 'absolute inset-0 md:hidden';
              var iframe = document.createElement('iframe');
              iframe.src = '/view/${name}';
              iframe.className = 'size-full';
              iframeWrapper.appendChild(iframe);
              container.appendChild(iframeWrapper);
            }
            var root = document.currentScript.parentElement;
            root.appendChild(light); root.appendChild(dark);
          })();
        `}}
      />
    </>
  )
}
