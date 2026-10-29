---
title: File Tree
description: The files the agent changed, as a folder tree.
base: aria
component: true
---

<ComponentPreview
  styleName="aria-rhea"
  name="file-tree-demo"
  previewClassName="h-auto"
/>

File Tree is the files the agent changed, shown as folders you can open. A folder is a [Collapsible](/docs/components/aria/collapsible). A file is a [Button](/docs/components/aria/button). For a single file the agent read or edited, use a [Tool](/docs/ai-elements/aria/tool) line instead.

## Installation

File Tree is built with the [Collapsible](/docs/components/aria/collapsible) and [Button](/docs/components/aria/button) components.

<CodeTabs>

<TabsList>
  <TabsTrigger value="cli">Command</TabsTrigger>
  <TabsTrigger value="manual">Manual</TabsTrigger>
</TabsList>
<TabsContent value="cli">

```bash
npx shadcn@latest add collapsible button
```

</TabsContent>

<TabsContent value="manual">

<Steps className="mb-0 pt-2">

<Step>Install the required shadcn/ui dependencies:</Step>

```bash
npx shadcn@latest add collapsible button
```

<Step>Copy and paste the following code into your project.</Step>

<ComponentSource
  name="collapsible"
  title="components/ui/collapsible.tsx"
  styleName="aria-rhea"
/>

<Step>Update the import paths to match your project setup.</Step>

</Steps>

</TabsContent>

</CodeTabs>

## Usage

Render nodes recursively. Nest each folder's children in its `CollapsibleContent`.

```tsx showLineNumbers
if (node.type === "folder") {
  return (
    <Collapsible defaultExpanded className="group/folder">
      <Button
        slot="trigger"
        variant="ghost"
        size="sm"
        className="w-full justify-start"
      >
        <ChevronRightIcon className="transition-transform group-data-expanded/folder:rotate-90" />
        <FolderIcon />
        {node.name}
      </Button>
      <CollapsibleContent>
        <div className="ml-4 flex flex-col">
          {node.children.map((child) => (
            <FileTreeNode key={child.path} node={child} />
          ))}
        </div>
      </CollapsibleContent>
    </Collapsible>
  )
}
```

```tsx showLineNumbers
<Button
  variant="ghost"
  size="sm"
  className="w-full justify-start"
  onPress={() => onSelect(node.path)}
>
  <FileIcon />
  {node.name}
</Button>
```

See [Collapsible](/docs/components/aria/collapsible#file-tree).

## Migrating from AI SDK Elements

If you added File Tree from [AI SDK Elements](https://elements.ai-sdk.dev), your project has a `components/ai-elements/file-tree.tsx` wrapper. Paste this prompt into your coding agent to rebuild it on Collapsible and Button. Every export keeps its name and props, so the code that uses it keeps working.

```txt title="Prompt" prompt
Migrate components/ai-elements/file-tree.tsx from AI SDK Elements to the shadcn/ui Collapsible and Button components.

Keep every export, with the same name and props, so the code that imports it keeps working. Only change how each part renders.

1. Install the components: npx shadcn@latest add collapsible button
2. Read https://ui.shadcn.com/docs/ai-elements/aria/file-tree.md and build File Tree the same way.
3. Rebuild each part:
   - FileTreeFolder renders a Collapsible. Its trigger is a Button with slot="trigger", variant="ghost", size="sm" and className="w-full justify-start", and its children go in a CollapsibleContent.
   - FileTreeFile renders a Button with variant="ghost" and size="sm" that calls onSelect with its path. If a file has FileTreeActions, render them next to the Button, not inside it.
   - Keep FileTree with its expanded and selection state, and keep FileTreeIcon, FileTreeName and FileTreeActions as they are.
4. Remove the imports the file no longer uses.
5. Run the type checker and fix any errors.
```
