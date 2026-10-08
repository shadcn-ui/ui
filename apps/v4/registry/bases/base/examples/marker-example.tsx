"use client"

import { toast } from "sonner"

import {
  Example,
  ExampleWrapper,
} from "@/registry/bases/base/components/example"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/registry/bases/base/ui/accordion"
import { Button } from "@/registry/bases/base/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/registry/bases/base/ui/drawer"
import {
  Marker,
  MarkerContent,
  MarkerIcon,
} from "@/registry/bases/base/ui/marker"
import { Spinner } from "@/registry/bases/base/ui/spinner"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"

export default function MarkerExamples() {
  return (
    <ExampleWrapper>
      <MarkerExample />
      <MarkerBorder />
      <MarkerSeparator />
      <MarkerAccordion />
      <MarkerDrawer />
    </ExampleWrapper>
  )
}

function MarkerExample() {
  return (
    <Example title="Markers" className="gap-8">
      <Marker>
        <MarkerContent>A default marker</MarkerContent>
      </Marker>
      <Marker>
        <MarkerIcon>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileDescription"
            hugeicons="File01Icon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </MarkerIcon>
        <MarkerContent>Marker with icon</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Marker with a spinner</MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent className="shimmer">
          Marker with shimmer effect
        </MarkerContent>
      </Marker>
      <Marker role="status">
        <MarkerContent className="shimmer">Thinking...</MarkerContent>
      </Marker>
      <Marker render={<a href="#" />}>
        <MarkerIcon>
          <IconPlaceholder
            lucide="GitBranchIcon"
            tabler="IconGitBranch"
            hugeicons="GitBranchIcon"
            phosphor="GitBranchIcon"
            remixicon="RiGitBranchLine"
          />
        </MarkerIcon>
        <MarkerContent>Marker as a link</MarkerContent>
      </Marker>
      <Marker
        render={
          <button
            onClick={() => toast("You clicked the button")}
            className="transition-colors hover:text-foreground"
          />
        }
      >
        <MarkerIcon>
          <IconPlaceholder
            lucide="ClockIcon"
            tabler="IconClock"
            hugeicons="Clock01Icon"
            phosphor="ClockIcon"
            remixicon="RiTimeLine"
          />
        </MarkerIcon>
        <MarkerContent className="flex-1">
          <div>Marker as a button</div>
        </MarkerContent>
        <MarkerIcon>
          <IconPlaceholder
            lucide="ChevronRightIcon"
            tabler="IconChevronRight"
            hugeicons="ArrowRight01Icon"
            phosphor="CaretRightIcon"
            remixicon="RiArrowRightSLine"
          />
        </MarkerIcon>
      </Marker>
      <Marker>
        <MarkerIcon>
          <IconPlaceholder
            lucide="CircleUserIcon"
            tabler="IconUserCircle"
            hugeicons="UserCircleIcon"
            phosphor="UserCircleIcon"
            remixicon="RiUserSmileLine"
          />
        </MarkerIcon>
        <MarkerContent>Rhea joined the chat</MarkerContent>
      </Marker>
      <Marker className="justify-center">
        <MarkerContent>
          <strong className="font-medium">Olivia Rose</strong> left the chat
        </MarkerContent>
      </Marker>
      <Marker className="flex-col">
        <MarkerIcon>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileDescription"
            hugeicons="File01Icon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </MarkerIcon>
        <MarkerContent>Marker with icon at the top</MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerBorder() {
  return (
    <Example title="Border" className="gap-3">
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="GitBranchIcon"
            tabler="IconGitBranch"
            hugeicons="GitBranchIcon"
            phosphor="GitBranchIcon"
            remixicon="RiGitBranchLine"
          />
        </MarkerIcon>
        <MarkerContent>Switched to release-candidate</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="SearchIcon"
            tabler="IconSearch"
            hugeicons="Search01Icon"
            phosphor="MagnifyingGlassIcon"
            remixicon="RiSearchLine"
          />
        </MarkerIcon>
        <MarkerContent>Reviewed 8 related files</MarkerContent>
      </Marker>
      <Marker variant="border">
        <MarkerIcon>
          <IconPlaceholder
            lucide="FileTextIcon"
            tabler="IconFileDescription"
            hugeicons="File01Icon"
            phosphor="FileTextIcon"
            remixicon="RiFileTextLine"
          />
        </MarkerIcon>
        <MarkerContent>Opened implementation notes</MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerSeparator() {
  return (
    <Example title="Separator" className="gap-8">
      <Marker variant="separator">
        <MarkerContent>Worked for 42s</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerIcon>
          <Spinner />
        </MarkerIcon>
        <MarkerContent>Compacting conversation</MarkerContent>
      </Marker>
      <Marker variant="separator" role="status">
        <MarkerContent className="shimmer">Reading 4 files</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerIcon>
          <IconPlaceholder
            lucide="CheckIcon"
            tabler="IconCheck"
            hugeicons="Tick02Icon"
            phosphor="CheckIcon"
            remixicon="RiCheckLine"
          />
        </MarkerIcon>
        <MarkerContent>Conversation compacted</MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>
          With a <a href="#">link to learn more</a>
        </MarkerContent>
      </Marker>
      <Marker variant="separator">
        <MarkerContent>
          <Button variant="outline">
            <IconPlaceholder
              lucide="GitBranchIcon"
              tabler="IconGitBranch"
              hugeicons="GitBranchIcon"
              phosphor="GitBranchIcon"
              remixicon="RiGitBranchLine"
            />
            Button
          </Button>
        </MarkerContent>
      </Marker>
    </Example>
  )
}

function MarkerAccordion() {
  return (
    <Example title="Accordion" containerClassName="min-h-72">
      <Accordion>
        <AccordionItem value="1">
          <AccordionTrigger>
            <Marker>
              <MarkerIcon>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="Clock01Icon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                />
              </MarkerIcon>
              <MarkerContent>Worked for 42s</MarkerContent>
            </Marker>
          </AccordionTrigger>
          <AccordionContent>
            <p className="text-sm text-muted-foreground">
              The user asked for a list of all the files in the current
              directory. The assistant responded with a list of all the files in
              the current directory.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Example>
  )
}

function MarkerDrawer() {
  return (
    <Example title="Drawer">
      <Drawer swipeDirection="right">
        <Marker variant="separator">
          <DrawerTrigger render={<Button variant="outline" />}>
            <IconPlaceholder
              lucide="SearchIcon"
              tabler="IconSearch"
              hugeicons="SearchIcon"
              phosphor="MagnifyingGlassIcon"
              remixicon="RiSearchLine"
              data-icon="inline-start"
            />
            Explored 4 files
          </DrawerTrigger>
        </Marker>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>File Activity</DrawerTitle>
            <DrawerDescription>
              Files read while preparing the response.
            </DrawerDescription>
          </DrawerHeader>
          <div className="grid gap-3 px-4 text-sm">
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">app/chat/page.tsx</span>
              <span className="text-muted-foreground">read</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">components/message.tsx</span>
              <span className="text-muted-foreground">read</span>
            </div>
            <div className="flex items-center justify-between gap-4 rounded-md border px-3 py-2">
              <span className="truncate">lib/ai.ts</span>
              <span className="text-muted-foreground">read</span>
            </div>
          </div>
          <DrawerFooter>
            <DrawerClose render={<Button variant="outline" />}>
              Close
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Example>
  )
}
