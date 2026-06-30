<script setup lang="ts">
import ChevronRightIcon from "@material-symbols/svg-400/rounded/chevron_right.svg?component"
import FileIcon from "@material-symbols/svg-400/rounded/draft.svg?component"
import FolderIcon from "@material-symbols/svg-400/rounded/folder.svg?component"
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader } from '@/ui/card'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ui/collapsible'
import { Tabs, TabsList, TabsTrigger } from '@/ui/tabs'

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] }

const fileTree: FileTreeItem[] = [
  {
    name: 'components',
    items: [
      {
        name: 'ui',
        items: [
          { name: 'button.tsx' },
          { name: 'card.tsx' },
          { name: 'dialog.tsx' },
          { name: 'input.tsx' },
          { name: 'select.tsx' },
          { name: 'table.tsx' },
        ],
      },
      { name: 'login-form.tsx' },
      { name: 'register-form.tsx' },
    ],
  },
  {
    name: 'lib',
    items: [{ name: 'utils.ts' }, { name: 'cn.ts' }, { name: 'api.ts' }],
  },
  {
    name: 'hooks',
    items: [
      { name: 'use-media-query.ts' },
      { name: 'use-debounce.ts' },
      { name: 'use-local-storage.ts' },
    ],
  },
  {
    name: 'types',
    items: [{ name: 'index.d.ts' }, { name: 'api.d.ts' }],
  },
  {
    name: 'public',
    items: [
      { name: 'favicon.ico' },
      { name: 'logo.svg' },
      { name: 'images' },
    ],
  },
  { name: 'app.tsx' },
  { name: 'layout.tsx' },
  { name: 'globals.css' },
  { name: 'package.json' },
  { name: 'tsconfig.json' },
  { name: 'README.md' },
  { name: '.gitignore' },
]

function isFolder(item: FileTreeItem): item is { name: string; items: FileTreeItem[] } {
  return 'items' in item
}
</script>

<template>
  <Card class="mx-auto w-full max-w-[16rem] gap-2" size="sm">
    <CardHeader>
      <Tabs default-value="explorer">
        <TabsList class="w-full">
          <TabsTrigger value="explorer">Explorer</TabsTrigger>
          <TabsTrigger value="settings">Outline</TabsTrigger>
        </TabsList>
      </Tabs>
    </CardHeader>
    <CardContent>
      <div class="flex flex-col gap-1">
        <template v-for="item in fileTree" :key="item.name">
          <Collapsible v-if="isFolder(item)">
            <CollapsibleTrigger as-child>
              <Button
                variant="ghost"
                size="sm"
                class="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
              >
                <ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
                <FolderIcon />
                {{ item.name }}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent class="mt-1 ml-5">
              <div class="flex flex-col gap-1">
                <template v-for="child in (item as { name: string; items: FileTreeItem[] }).items" :key="child.name">
                  <Collapsible v-if="isFolder(child)">
                    <CollapsibleTrigger as-child>
                      <Button
                        variant="ghost"
                        size="sm"
                        class="group w-full justify-start transition-none hover:bg-accent hover:text-accent-foreground"
                      >
                        <ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
                        <FolderIcon />
                        {{ child.name }}
                      </Button>
                    </CollapsibleTrigger>
                    <CollapsibleContent class="mt-1 ml-5">
                      <div class="flex flex-col gap-1">
                        <Button
                          v-for="grandchild in (child as { name: string; items: FileTreeItem[] }).items"
                          :key="grandchild.name"
                          variant="link"
                          size="sm"
                          class="w-full justify-start gap-2 text-foreground"
                        >
                          <FileIcon />
                          <span>{{ grandchild.name }}</span>
                        </Button>
                      </div>
                    </CollapsibleContent>
                  </Collapsible>
                  <Button
                    v-else
                    variant="link"
                    size="sm"
                    class="w-full justify-start gap-2 text-foreground"
                  >
                    <FileIcon />
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
            class="w-full justify-start gap-2 text-foreground"
          >
            <FileIcon />
            <span>{{ item.name }}</span>
          </Button>
        </template>
      </div>
    </CardContent>
  </Card>
</template>
