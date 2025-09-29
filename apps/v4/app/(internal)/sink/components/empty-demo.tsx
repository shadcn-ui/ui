import { IconArrowUpRight, IconFolderCode } from "@tabler/icons-react"
import { PlusIcon, SearchIcon } from "lucide-react"

import { Button } from "@/registry/new-york-v4/ui/button"
import { Card, CardContent } from "@/registry/new-york-v4/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/registry/new-york-v4/ui/dialog"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/registry/new-york-v4/ui/empty"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/registry/new-york-v4/ui/input-group"
import { Kbd } from "@/registry/new-york-v4/ui/kbd"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/registry/new-york-v4/ui/popover"

export function EmptyDemo() {
  return (
    <div className="grid w-full gap-8">
      <Empty className="min-h-[80svh]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <IconFolderCode />
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
              Learn more <IconArrowUpRight />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className="bg-muted min-h-[80svh]">
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
              Learn more <IconArrowUpRight />
            </a>
          </Button>
        </EmptyContent>
      </Empty>
      <Empty className="min-h-[80svh] border">
        <EmptyHeader>
          <EmptyTitle>404 - Not Found</EmptyTitle>
          <EmptyDescription>
            The page you&apos;re looking for doesn&apos;t exist. Try searching
            for what you need below.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <InputGroup className="w-3/4">
            <InputGroupInput placeholder="Try searching for pages..." />
            <InputGroupAddon>
              <SearchIcon />
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
      <Empty className="min-h-[80svh]">
        <EmptyHeader>
          <EmptyTitle>Nothing to see here</EmptyTitle>
          <EmptyDescription>
            No posts have been created yet. Get started by{" "}
            <a href="#">creating your first post</a> to share with the
            community.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button variant="outline">
            <PlusIcon />
            New Post
          </Button>
        </EmptyContent>
      </Empty>
      <div className="bg-muted flex min-h-[800px] items-center justify-center rounded-lg p-20">
        <Card className="max-w-sm">
          <CardContent>
            <Empty className="p-4">
              <EmptyHeader>
                <EmptyTitle>404 - Not Found</EmptyTitle>
                <EmptyDescription>
                  The page you&apos;re looking for doesn&apos;t exist. Try
                  searching for what you need below.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <InputGroup className="w-3/4">
                  <InputGroupInput placeholder="Try searching for pages..." />
                  <InputGroupAddon>
                    <SearchIcon />
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
          </CardContent>
        </Card>
      </div>
      <div className="bg-muted flex min-h-[800px] items-center justify-center rounded-lg p-20">
        <Card className="max-w-sm">
          <CardContent>
            <Empty className="p-4">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <IconFolderCode />
                </EmptyMedia>
                <EmptyTitle>No projects yet</EmptyTitle>
                <EmptyDescription>
                  You haven&apos;t created any projects yet. Get started by
                  creating your first project.
                </EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <div className="flex gap-2">
                  <Button asChild>
                    <a href="#">Create project</a>
                  </Button>
                  <Button variant="outline">Import project</Button>
                </div>
                <Button
                  variant="link"
                  asChild
                  className="text-muted-foreground"
                >
                  <a href="#">
                    Learn more <IconArrowUpRight />
                  </a>
                </Button>
              </EmptyContent>
            </Empty>
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-3 gap-6">
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button>Open Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader className="sr-only">
                <DialogTitle>Dialog Title</DialogTitle>
                <DialogDescription>Dialog Description</DialogDescription>
              </DialogHeader>
              <Empty className="p-4">
                <EmptyHeader>
                  <EmptyMedia variant="icon">
                    <IconFolderCode />
                  </EmptyMedia>
                  <EmptyTitle>No projects yet</EmptyTitle>
                  <EmptyDescription>
                    You haven&apos;t created any projects yet. Get started by
                    creating your first project.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <div className="flex gap-2">
                    <Button asChild>
                      <a href="#">Create project</a>
                    </Button>
                    <Button variant="outline">Import project</Button>
                  </div>
                  <Button
                    variant="link"
                    asChild
                    className="text-muted-foreground"
                  >
                    <a href="#">
                      Learn more <IconArrowUpRight />
                    </a>
                  </Button>
                </EmptyContent>
              </Empty>
            </DialogContent>
          </Dialog>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline">Open Popover</Button>
            </PopoverTrigger>
            <PopoverContent className="rounded-2xl p-2">
              <Empty className="rounded-sm p-6">
                <EmptyHeader>
                  <EmptyTitle>Nothing to see here</EmptyTitle>
                  <EmptyDescription>
                    No posts have been created yet.{" "}
                    <a href="#">Create your first post</a> to share with the
                    community.
                  </EmptyDescription>
                </EmptyHeader>
                <EmptyContent>
                  <Button variant="outline">
                    <PlusIcon />
                    New Post
                  </Button>
                </EmptyContent>
              </Empty>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  )
}
