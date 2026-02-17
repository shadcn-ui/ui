type componentInfo = {
  title: string,
  href: string,
  description: string,
}

let components: array<componentInfo> = [
  {
    title: "Alert Dialog",
    href: "/docs/primitives/alert-dialog",
    description:
      "A modal dialog that interrupts the user with important content and expects a response.",
  },
  {
    title: "Hover Card",
    href: "/docs/primitives/hover-card",
    description: "For sighted users to preview content available behind a link.",
  },
  {
    title: "Progress",
    href: "/docs/primitives/progress",
    description:
      "Displays an indicator showing the completion progress of a task, typically displayed as a progress bar.",
  },
  {
    title: "Scroll-area",
    href: "/docs/primitives/scroll-area",
    description: "Visually or semantically separates content.",
  },
  {
    title: "Tabs",
    href: "/docs/primitives/tabs",
    description:
      "A set of layered sections of content-known as tab panels-that are displayed one at a time.",
  },
  {
    title: "Tooltip",
    href: "/docs/primitives/tooltip",
    description:
      "A popup that displays information related to an element when the element receives keyboard focus or the mouse hovers over it.",
  },
]

module ListItem = {
  @react.component
  let make = (~title: string, ~href: string, ~description: string) =>
    <li>
      <NavigationMenu.Link render={<a href />}>
        <div className="flex flex-col gap-1 text-sm">
          <div className="leading-none font-medium">{title->React.string}</div>
          <div className="text-muted-foreground line-clamp-2">{description->React.string}</div>
        </div>
      </NavigationMenu.Link>
    </li>
}

@react.component
let make = () =>
  <NavigationMenu>
    <NavigationMenu.List>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>{"Getting started"->React.string}</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <ul className="w-96">
            <ListItem
              title="Introduction"
              href="/docs"
              description="Re-usable components built with Tailwind CSS."
            />
            <ListItem
              title="Installation"
              href="/docs/installation"
              description="How to install dependencies and structure your app."
            />
            <ListItem
              title="Typography"
              href="/docs/primitives/typography"
              description="Styles for headings, paragraphs, lists...etc"
            />
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item className="hidden md:flex">
        <NavigationMenu.Trigger>{"Components"->React.string}</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <ul className="grid w-[400px] gap-2 md:w-[500px] md:grid-cols-2 lg:w-[600px]">
            {components
            ->Belt.Array.map(component =>
              <ListItem
                key={component.title}
                title={component.title}
                href={component.href}
                description={component.description}
              />
            )
            ->React.array}
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Trigger>{"With Icon"->React.string}</NavigationMenu.Trigger>
        <NavigationMenu.Content>
          <ul className="grid w-[200px]">
            <li>
              <NavigationMenu.Link render={<a href="#" className="flex-row items-center gap-2" />}>
                <Icons.CircleAlert />
                {"Backlog"->React.string}
              </NavigationMenu.Link>
              <NavigationMenu.Link render={<a href="#" className="flex-row items-center gap-2" />}>
                <Icons.CircleDashed />
                {"To Do"->React.string}
              </NavigationMenu.Link>
              <NavigationMenu.Link render={<a href="#" className="flex-row items-center gap-2" />}>
                <Icons.CircleCheck />
                {"Done"->React.string}
              </NavigationMenu.Link>
            </li>
          </ul>
        </NavigationMenu.Content>
      </NavigationMenu.Item>
      <NavigationMenu.Item>
        <NavigationMenu.Link
          render={<a href="/docs" />}
          className={NavigationMenu.navigationMenuTriggerStyle()}
        >
          {"Docs"->React.string}
        </NavigationMenu.Link>
      </NavigationMenu.Item>
    </NavigationMenu.List>
  </NavigationMenu>
