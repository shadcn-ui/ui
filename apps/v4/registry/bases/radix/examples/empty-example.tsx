import { Button } from "@/registry/bases/radix/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/registry/bases/radix/ui/card"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/bases/radix/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/bases/radix/ui/input-group"
import { Kbd } from "@/registry/bases/radix/ui/kbd"
import { IconPlaceholder } from "@/app/(design)/design/components/icon-placeholder"

export default function EmptyDemo() {
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="grid w-full max-w-screen-xl grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        <EmptyExample2 />
        <EmptyExample1 />
        <EmptyExample3 />
        <EmptyExample4 />
        <EmptyExample5 />
        <EmptyExample6 />
      </div>
    </div>
  )
}

function EmptyExample1() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconPlaceholder
            lucide="FolderIcon"
            tabler="IconFolder"
            hugeicons="Folder01Icon"
          />
        </EmptyMedia>
        <EmptyTitle>No projects yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any projects yet. Get started by creating
          your first project.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div className="flex gap-2">
          <Button asChild>
            <a href="#">Create project</a>
          </Button>
          <Button variant="outline">Import project</Button>
        </div>
        <Button variant="link" asChild className="text-muted-foreground">
          <a href="#">
            Learn more{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
            />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function EmptyExample2() {
  return (
    <Empty className="bg-muted">
      <EmptyHeader>
        <EmptyTitle>No results found</EmptyTitle>
        <EmptyDescription>
          No results found for your search. Try adjusting your search terms.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button>Try again</Button>
        <Button variant="link" asChild className="text-muted-foreground">
          <a href="#">
            Learn more{" "}
            <IconPlaceholder
              lucide="ArrowUpRightIcon"
              tabler="IconArrowUpRight"
              hugeicons="ArrowUpRight01Icon"
            />
          </a>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function EmptyExample3() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help? <a href="#">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

function EmptyExample4() {
  return (
    <Empty className="border">
      <EmptyHeader>
        <EmptyTitle>Nothing to see here</EmptyTitle>
        <EmptyDescription>
          No posts have been created yet. Get started by{" "}
          <a href="#">creating your first post</a>.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button variant="outline">
          <IconPlaceholder
            lucide="PlusIcon"
            tabler="IconPlus"
            hugeicons="PlusSignIcon"
            data-slot="icon-inline-start"
          />
          New Post
        </Button>
      </EmptyContent>
    </Empty>
  )
}

function EmptyExample5() {
  return (
    <Empty className="bg-muted/50">
      <EmptyHeader>
        <EmptyTitle>404 - Not Found</EmptyTitle>
        <EmptyDescription>
          The page you&apos;re looking for doesn&apos;t exist. Try searching for
          what you need below.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <InputGroup className="w-3/4">
          <InputGroupInput placeholder="Try searching for pages..." />
          <InputGroupAddon>
            <IconPlaceholder
              lucide="CircleDashedIcon"
              tabler="IconCircleDashed"
              hugeicons="DashedLineCircleIcon"
            />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <EmptyDescription>
          Need help? <a href="#">Contact support</a>
        </EmptyDescription>
      </EmptyContent>
    </Empty>
  )
}

function EmptyExample6() {
  return (
    <Card>
      <CardHeader className="border-b">
        <CardTitle>Your Projects</CardTitle>
        <CardDescription>Here&apos;s a list of your projects.</CardDescription>
      </CardHeader>
      <CardContent>
        <Empty>
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <IconPlaceholder
                lucide="FolderIcon"
                tabler="IconFolder"
                hugeicons="Folder01Icon"
              />
            </EmptyMedia>
            <EmptyTitle>No projects yet</EmptyTitle>
            <EmptyDescription>
              You haven&apos;t created any projects yet. Get started by creating
              your first project.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <div className="flex gap-2">
              <Button asChild>
                <a href="#">Create project</a>
              </Button>
              <Button variant="outline">Import project</Button>
            </div>
            <Button variant="link" asChild className="text-muted-foreground">
              <a href="#">
                Learn more{" "}
                <IconPlaceholder
                  lucide="ArrowUpRightIcon"
                  tabler="IconArrowUpRight"
                  hugeicons="ArrowUpRight01Icon"
                />
              </a>
            </Button>
          </EmptyContent>
        </Empty>
      </CardContent>
    </Card>
  )
}
