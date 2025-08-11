import { Button } from "@workspace/ui"

export default function TestUIPage() {
  return (
    <div className="bg-background min-h-screen p-8">
      <div className="mx-auto max-w-4xl space-y-8">
        <div className="space-y-4">
          <h1 className="text-foreground text-4xl font-bold">
            ShadCN UI with Tailwind v4 Test
          </h1>
          <p className="text-muted-foreground">
            This page demonstrates that ShadCN UI components are working
            properly with Tailwind CSS v4 in the Nx monorepo setup.
          </p>
        </div>

        <div className="space-y-6">
          <section className="space-y-4">
            <h2 className="text-foreground text-2xl font-semibold">
              Button Variants
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button>Default Button</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="link">Link</Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-foreground text-2xl font-semibold">
              Button Sizes
            </h2>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="default">Default</Button>
              <Button size="lg">Large</Button>
              <Button size="icon">🔍</Button>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-foreground text-2xl font-semibold">
              Disabled States
            </h2>
            <div className="flex flex-wrap gap-4">
              <Button disabled>Disabled Default</Button>
              <Button disabled variant="outline">
                Disabled Outline
              </Button>
              <Button disabled variant="secondary">
                Disabled Secondary
              </Button>
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
