import Component from '@glimmer/component';

import { Button } from '@/ember-ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/ember-ui/card';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/ember-ui/collapsible';
import { Tabs, TabsList, TabsTrigger } from '@/ember-ui/tabs';

import ChevronRightIcon from '~icons/ms/chevron_right';
import FileIcon from '~icons/ms/draft';
import FolderIcon from '~icons/ms/folder';

type FileTreeItem = { name: string } | { name: string; items: FileTreeItem[] };

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
];

function isFolder(item: FileTreeItem): item is { name: string; items: FileTreeItem[] } {
  return 'items' in item;
}

export default class CollapsibleFileTree extends Component {
  fileTree = fileTree;
  isFolder = isFolder;

  <template>
    <Card @size="sm" class="mx-auto w-full max-w-[16rem] gap-2">
      <CardHeader>
        <Tabs @defaultValue="explorer">
          <TabsList class="w-full">
            <TabsTrigger @value="explorer">Explorer</TabsTrigger>
            <TabsTrigger @value="settings">Outline</TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div class="flex flex-col gap-1">
          {{#each this.fileTree as |item|}}
            {{#if (this.isFolder item)}}
              <Collapsible>
                <CollapsibleTrigger
                  class="group inline-flex w-full items-center justify-start gap-1 rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground transition-none"
                >
                  <ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
                  <FolderIcon />
                  {{item.name}}
                </CollapsibleTrigger>
                <CollapsibleContent class="mt-1 ml-5">
                  <div class="flex flex-col gap-1">
                    {{#each item.items as |child|}}
                      {{#if (this.isFolder child)}}
                        <Collapsible>
                          <CollapsibleTrigger
                            class="group inline-flex w-full items-center justify-start gap-1 rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-accent-foreground transition-none"
                          >
                            <ChevronRightIcon class="transition-transform group-data-[state=open]:rotate-90" />
                            <FolderIcon />
                            {{child.name}}
                          </CollapsibleTrigger>
                          <CollapsibleContent class="mt-1 ml-5">
                            <div class="flex flex-col gap-1">
                              {{#each child.items as |grandchild|}}
                                <Button
                                  @variant="link"
                                  @size="sm"
                                  class="w-full justify-start gap-2 text-foreground"
                                >
                                  <FileIcon />
                                  <span>{{grandchild.name}}</span>
                                </Button>
                              {{/each}}
                            </div>
                          </CollapsibleContent>
                        </Collapsible>
                      {{else}}
                        <Button
                          @variant="link"
                          @size="sm"
                          class="w-full justify-start gap-2 text-foreground"
                        >
                          <FileIcon />
                          <span>{{child.name}}</span>
                        </Button>
                      {{/if}}
                    {{/each}}
                  </div>
                </CollapsibleContent>
              </Collapsible>
            {{else}}
              <Button
                @variant="link"
                @size="sm"
                class="w-full justify-start gap-2 text-foreground"
              >
                <FileIcon />
                <span>{{item.name}}</span>
              </Button>
            {{/if}}
          {{/each}}
        </div>
      </CardContent>
    </Card>
  </template>
}
