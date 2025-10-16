import { Metadata } from "next"
import { notFound } from "next/navigation"

import { componentRegistry } from "@/app/(internal)/sink/component-registry"

export const dynamic = "force-static"
export const revalidate = false

export async function generateStaticParams() {
  return Object.keys(componentRegistry).map((name) => ({
    name,
  }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ name: string }>
}): Promise<Metadata> {
  const { name } = await params
  const component = componentRegistry[name as keyof typeof componentRegistry]

  if (!component) {
    return {
      title: "Component Not Found",
    }
  }

  return {
    title: `${component.name} - Kitchen Sink`,
    description: `Demo page for ${component.name} component`,
  }
}

export default async function ComponentPage({
  params,
}: {
  params: Promise<{ name: string }>
}) {
  const { name } = await params
  const component = componentRegistry[name as keyof typeof componentRegistry]

  if (!component) {
    notFound()
  }

  const Component = component.component

  return (
    <div className="p-6">
      <Component />
    </div>
  )
}
