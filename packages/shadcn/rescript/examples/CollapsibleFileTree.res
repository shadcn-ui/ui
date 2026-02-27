type rec fileTreeItem =
  | File({name: string})
  | Folder({name: string, items: array<fileTreeItem>})

let fileTree: array<fileTreeItem> = [
  Folder({
    name: "components",
    items: [
      Folder({
        name: "ui",
        items: [
          File({name: "button.tsx"}),
          File({name: "card.tsx"}),
          File({name: "dialog.tsx"}),
          File({name: "input.tsx"}),
          File({name: "select.tsx"}),
          File({name: "table.tsx"}),
        ],
      }),
      File({name: "login-form.tsx"}),
      File({name: "register-form.tsx"}),
    ],
  }),
  Folder({
    name: "lib",
    items: [
      File({name: "utils.ts"}),
      File({name: "cn.ts"}),
      File({name: "api.ts"}),
    ],
  }),
  Folder({
    name: "hooks",
    items: [
      File({name: "use-media-query.ts"}),
      File({name: "use-debounce.ts"}),
      File({name: "use-local-storage.ts"}),
    ],
  }),
  Folder({
    name: "types",
    items: [
      File({name: "index.d.ts"}),
      File({name: "api.d.ts"}),
    ],
  }),
  Folder({
    name: "public",
    items: [
      File({name: "favicon.ico"}),
      File({name: "logo.svg"}),
      File({name: "images"}),
    ],
  }),
  File({name: "app.tsx"}),
  File({name: "layout.tsx"}),
  File({name: "globals.css"}),
  File({name: "package.json"}),
  File({name: "tsconfig.json"}),
  File({name: "README.md"}),
  File({name: ".gitignore"}),
]

let rec renderItem = (fileItem: fileTreeItem) =>
  switch fileItem {
  | Folder({name, items}) =>
    <Collapsible key=name>
      <Collapsible.Trigger
        render={<button
          className={Button.twMerge(
            `${Button.buttonVariants(
              ~variant=Button.Variant.Ghost,
              ~size=Button.Size.Sm,
            )} group hover:bg-accent hover:text-accent-foreground w-full justify-start transition-none`,
          )}
          type_="button"
        />}
      >
        <Icons.ChevronRight className="transition-transform group-data-[state=open]:rotate-90" />
        <Icons.Folder />
        {name->React.string}
      </Collapsible.Trigger>
      <Collapsible.Content className="style-lyra:ml-4 mt-1 ml-5">
        <div className="flex flex-col gap-1">
          {items->Array.map(renderItem)->React.array}
        </div>
      </Collapsible.Content>
    </Collapsible>
  | File({name}) =>
    <Button
      key=name
      variant=Button.Variant.Link
      size=Button.Size.Sm
      className="text-foreground w-full justify-start gap-2"
    >
      <Icons.File />
      <span> {name->React.string} </span>
    </Button>
  }

@react.component
let make = () =>
  <Card className="mx-auto w-full max-w-[16rem] gap-2" dataSize=Card.Size.Sm>
    <Card.Header>
      <Tabs defaultValue="explorer">
        <Tabs.List className="w-full">
          <Tabs.Trigger value="explorer"> {"Explorer"->React.string} </Tabs.Trigger>
          <Tabs.Trigger value="settings"> {"Outline"->React.string} </Tabs.Trigger>
        </Tabs.List>
      </Tabs>
    </Card.Header>
    <Card.Content>
      <div className="flex flex-col gap-1">
        {fileTree->Array.map(item => renderItem(item))->React.array}
      </div>
    </Card.Content>
  </Card>
