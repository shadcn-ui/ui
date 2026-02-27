@@directive("'use client'")

type browserWindow
type mediaQueryList

@val external browserWindow: browserWindow = "window"
@send external windowMatchMedia: (browserWindow, string) => mediaQueryList = "matchMedia"
@get external mediaQueryMatches: mediaQueryList => bool = "matches"
@send
external addMediaQueryListener: (mediaQueryList, string, unit => unit) => unit = "addEventListener"
@send
external removeMediaQueryListener: (mediaQueryList, string, unit => unit) => unit =
  "removeEventListener"

let useMediaQuery = (query: string) => {
  let (matches, setMatches) = React.useState(() => false)

  React.useEffect(() => {
    let mediaQuery = browserWindow->windowMatchMedia(query)
    let onChange = () => setMatches(_ => mediaQuery->mediaQueryMatches)

    mediaQuery->addMediaQueryListener("change", onChange)
    onChange()

    Some(() => mediaQuery->removeMediaQueryListener("change", onChange))
  }, [query])

  matches
}

module ProfileForm = {
  @react.component
  let make = (~className="") => {
    let resolvedClassName = Button.twMerge(`grid items-start gap-6 ${className}`)

    <form className=resolvedClassName>
      <div className="grid gap-3">
        <Label htmlFor="email"> {"Email"->React.string} </Label>
        <Input type_="email" id="email" defaultValue="shadcn@example.com" />
      </div>
      <div className="grid gap-3">
        <Label htmlFor="username"> {"Username"->React.string} </Label>
        <Input id="username" defaultValue="@shadcn" />
      </div>
      <Button type_="submit"> {"Save changes"->React.string} </Button>
    </form>
  }
}

@react.component
let make = () => {
  let (open_, setOpen) = React.useState(() => false)
  let isDesktop = useMediaQuery("(min-width: 768px)")

  if isDesktop {
    <Dialog open_ onOpenChange={(nextOpen, _) => setOpen(_ => nextOpen)}>
      <Dialog.Trigger render={<Button variant=Button.Variant.Outline />}>
        {"Edit Profile"->React.string}
      </Dialog.Trigger>
      <Dialog.Content className="sm:max-w-[425px]">
        <Dialog.Header>
          <Dialog.Title> {"Edit profile"->React.string} </Dialog.Title>
          <Dialog.Description>
            {"Make changes to your profile here. Click save when you're done."->React.string}
          </Dialog.Description>
        </Dialog.Header>
        <ProfileForm />
      </Dialog.Content>
    </Dialog>
  } else {
    <Drawer open_ onOpenChange={(nextOpen, _) => setOpen(_ => nextOpen)}>
      <Drawer.Trigger asChild={true}>
        <Button variant=Button.Variant.Outline> {"Edit Profile"->React.string} </Button>
      </Drawer.Trigger>
      <Drawer.Content>
        <Drawer.Header className="text-left">
          <Drawer.Title> {"Edit profile"->React.string} </Drawer.Title>
          <Drawer.Description>
            {"Make changes to your profile here. Click save when you're done."->React.string}
          </Drawer.Description>
        </Drawer.Header>
        <ProfileForm className="px-4" />
        <Drawer.Footer className="pt-2">
          <Drawer.Close asChild={true}>
            <Button variant=Button.Variant.Outline> {"Cancel"->React.string} </Button>
          </Drawer.Close>
        </Drawer.Footer>
      </Drawer.Content>
    </Drawer>
  }
}
