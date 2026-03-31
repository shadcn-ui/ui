<script setup lang="ts">
import IconPlaceholder from "@/components/IconPlaceholder.vue"
import { Button } from "@/ui/button"
import { Card, CardContent, CardHeader } from "@/ui/card"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/ui/collapsible"
import { Tabs, TabsList, TabsTrigger } from "@/ui/tabs"
import { Example } from "@/components"

type FileTreeItem = { name: string } | { name: string, items: FileTreeItem[] }

const fileTree: FileTreeItem[] = [
  {
    name: "components",
    items: [
      {
        name: "ui",
        items: [
          { name: "button.tsx" },
          { name: "card.tsx" },
          { name: "dialog.tsx" },
          { name: "input.tsx" },
          { name: "select.tsx" },
          { name: "table.tsx" },
        ],
      },
      { name: "login-form.tsx" },
      { name: "register-form.tsx" },
    ],
  },
  {
    name: "lib",
    items: [{ name: "utils.ts" }, { name: "cn.ts" }, { name: "api.ts" }],
  },
  {
    name: "hooks",
    items: [
      { name: "use-media-query.ts" },
      { name: "use-debounce.ts" },
      { name: "use-local-storage.ts" },
    ],
  },
  {
    name: "types",
    items: [{ name: "index.d.ts" }, { name: "api.d.ts" }],
  },
  {
    name: "public",
    items: [
      { name: "favicon.ico" },
      { name: "logo.svg" },
      { name: "images" },
    ],
  },
  { name: "app.tsx" },
  { name: "layout.tsx" },
  { name: "globals.css" },
  { name: "package.json" },
  { name: "tsconfig.json" },
  { name: "README.md" },
  { name: ".gitignore" },
]

function renderItem(fileItem: FileTreeItem) {
  if ("items" in fileItem) {
    return {
      type: "folder",
      name: fileItem.name,
      items: fileItem.items,
    }
  }
  return {
    type: "file",
    name: fileItem.name,
  }
}
</script>

<template>
  <Example title="File Tree" class="items-center">
    <Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
      <CardHeader>
        <Tabs default-value="explorer">
          <TabsList class="w-full">
            <TabsTrigger value="explorer">
              Explorer
            </TabsTrigger>
            <TabsTrigger value="settings">
              Outline
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-1">
          <template v-for="item in fileTree" :key="item.name">
            <Collapsible v-if="'items' in item">
              <CollapsibleTrigger :as-child="true">
                <Button
                  variant="ghost"
                  size="sm"
                  class="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
                >
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                    class="transition-transform group-data-[state=open]:rotate-90"
                  />
                  <IconPlaceholder
                    lucide="FolderIcon"
                    tabler="IconFolder"
                    hugeicons="Folder01Icon"
                    phosphor="FolderIcon"
                    remixicon="RiFolderLine"
                  />
                  {{ item.name }}
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent class="style-lyra:ml-4 mt-1 ml-5">
                <div class="flex flex-col gap-1">
                  <template v-for="child in item.items" :key="child.name">
                    <Collapsible v-if="'items' in child">
                      <CollapsibleTrigger :as-child="true">
                        <Button
                          variant="ghost"
                          size="sm"
                          class="group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none"
                        >
                          <IconPlaceholder
                            lucide="ChevronRightIcon"
                            tabler="IconChevronRight"
                            hugeicons="ArrowRight01Icon"
                            phosphor="CaretRightIcon"
                            remixicon="RiArrowRightSLine"
                            class="transition-transform group-data-[state=open]:rotate-90"
                          />
                          <IconPlaceholder
                            lucide="FolderIcon"
                            tabler="IconFolder"
                            hugeicons="Folder01Icon"
                            phosphor="FolderIcon"
                            remixicon="RiFolderLine"
                          />
                          {{ child.name }}
                        </Button>
                      </CollapsibleTrigger>
                      <CollapsibleContent class="style-lyra:ml-4 mt-1 ml-5">
                        <div class="flex flex-col gap-1">
                          <Button
                            v-for="file in child.items"
                            :key="file.name"
                            variant="link"
                            size="sm"
                            class="text-foreground w-full justify-start gap-2"
                          >
                            <IconPlaceholder
                              lucide="FileIcon"
                              tabler="IconFile"
                              hugeicons="File01Icon"
                              phosphor="FileIcon"
                              remixicon="RiFileLine"
                            />
                            <span>{{ file.name }}</span>
                          </Button>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                    <Button
                      v-else
                      variant="link"
                      size="sm"
                      class="text-foreground w-full justify-start gap-2"
                    >
                      <IconPlaceholder
                        lucide="FileIcon"
                        tabler="IconFile"
                        hugeicons="File01Icon"
                        phosphor="FileIcon"
                        remixicon="RiFileLine"
                      />
                      <span>{{ child.name }}</span>
                    </Button>
                  </template>
                </div>
              </CollapsibleContent>
            </Collapsible>
            <Button
              v-else
              variant="link"
              size="sm"
              class="text-foreground w-full justify-start gap-2"
            >
              <IconPlaceholder
                lucide="FileIcon"
                tabler="IconFile"
                hugeicons="File01Icon"
                phosphor="FileIcon"
                remixicon="RiFileLine"
              />
              <span>{{ item.name }}</span>
            </Button>
          </template>
        </div>
      </CardContent>
    </Card>
  </Example>
</template>
