import { Button } from "@/registry/default/ui/button"
import { Icons } from "@/components/icons"

export default function IndexPage() {
  return (
    <div className="container relative">
      <section className="flex h-full w-full flex-col items-center justify-center space-y-12  py-12 md:py-32">
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-7xl lg:leading-[1.1]">
          The elixir for your apps
        </h1>
        <div className="flex w-full flex-col items-center justify-center space-y-4">
          <Button>Get free components 🎉</Button>
          <p className="text-lg font-medium leading-none text-muted-foreground">
            Login and get your first ✨ magic components ✨ for free.
          </p>
        </div>
      </section>
      <section className="flex h-full w-full flex-col items-center justify-center space-y-4 py-12">
        <div className="flex w-full  items-center justify-center">
          <Icons.logo className="h-40 w-40 dark:fill-white" />
        </div>
        <h1 className="text-3xl font-bold leading-tight tracking-tighter md:text-4xl lg:leading-[1.1]">
          Magic components for your apps
        </h1>
      </section>
    </div>
  )
}
