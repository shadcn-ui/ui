import { Button } from "../../ui/button"
import { Card, CardDescription, CardHeader, CardTitle } from "../../ui/card"
import { HeaderAction, HeaderBranding, HeaderMenu } from "../../ui/header"
import { Icon, IconType } from "../../ui/icon"
import { Popover, PopoverContent, PopoverTrigger } from "../../ui/popover"
import { Tabs, TabsList, TabsTrigger } from "../../ui/tabs"

interface DataWithDesc {
  name: string;
  description: string;
  href: string;
  icon?: IconType
}

interface Data {
  name: string;
  href: string;
  icon: IconType
}


export const HeaderCard = () => {
  const navigation = [
    { name: 'Dashboard', href: '#', value: 'dashboard', isFlyout: false },
    { name: 'Team', href: '#', value: 'team', isFlyout: true },
    { name: 'Projects', href: '#', value: 'projects', isFlyout: false },
    { name: 'Calendar', href: '#', value: 'calender', isFlyout: false },
  ]

  const solutions: DataWithDesc[] = [
    { name: 'Analytics', description: 'Get a better understanding of your traffic', href: '#', icon: "pie-chart-duotone" },
    { name: 'Engagement', description: 'Speak directly to your customers', href: '#', icon: "i-cursor-duotone" },
    { name: 'Security', description: "Your customers' data will be safe and secure", href: '#', icon: "fingerprint-solid" },
    { name: 'Integrations', description: 'Connect with third-party tools', href: '#', icon: "plus-square-solid" },
    { name: 'Automations', description: 'Build strategic funnels that will convert', href: '#', icon: "refresh-solid" },
  ]

  const callsToAction: Data[] = [
    { name: 'Watch demo', href: '#', icon: "play-circle-solid" },
    { name: 'Contact sales', href: '#', icon: "phone-alt-solid" },
  ]

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Header Variants</CardTitle>
        <CardDescription>
          List of possible variants of Header
        </CardDescription>
      </CardHeader>
      <CardHeader className="space-y-1">
        <CardDescription>
          1. Full Width
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <HeaderBranding>
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={100}
                height={100}
              />
            </div>
          </HeaderBranding>
          <HeaderMenu>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Tabs defaultValue="team">
                  <TabsList variant={"underline"} className={"w-full"}>
                    {navigation.map((item, idx) => (
                      <TabsTrigger
                        variant={"underline"}
                        value={item.value}
                        className="data-[state=active]"
                        key={idx}
                      >
                        {item.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </HeaderMenu>
          <HeaderAction >
            <Button variant={"soft"} icon="arrow-right-solid" alignIcon="right">
              Log in
            </Button>
          </HeaderAction>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <CardDescription>
          2. With Call to Action
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <HeaderBranding>
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={100}
                height={100}
              />
            </div>
          </HeaderBranding>
          <HeaderMenu>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Tabs defaultValue="dashboard">
                  <TabsList variant={"underline"} className={"w-full"}>
                    {navigation.map((item, idx) => (
                      <TabsTrigger
                        variant={"underline"}
                        value={item.value}
                        className="data-[state=active]"
                        key={idx}
                      >
                        {item.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </HeaderMenu>
          <HeaderAction >
            <Button variant={"soft"}>
              Log in
            </Button>
            <Button >
              Sign Up
            </Button>
          </HeaderAction>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <CardDescription>
          3. With Left Aligned Nav
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex items-center gap-x-12">
            <HeaderBranding>
              <div className="flex shrink-0 items-center">
                <img
                  className="h-8 w-auto"
                  src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                  alt="Your Company"
                  width={100}
                  height={100}
                />
              </div>
            </HeaderBranding>
            <HeaderMenu>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Tabs defaultValue="dashboard">
                    <TabsList variant={"underline"} className={"w-full"}>
                      {navigation.map((item, idx) => (
                        <TabsTrigger
                          variant={"underline"}
                          value={item.value}
                          className="data-[state=active]"
                          key={idx}
                        >
                          {item.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </HeaderMenu>
          </div>
          <HeaderAction >
            <Button variant={"soft"} icon="arrow-right-solid" alignIcon="right">
              Log in
            </Button>
          </HeaderAction>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <CardDescription>
          4. With Right Aligned Nav
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <HeaderBranding>
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={100}
                height={100}
              />
            </div>
          </HeaderBranding>
          <div className="flex items-center gap-x-12">
            <HeaderMenu>
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Tabs defaultValue="dashboard">
                    <TabsList variant={"underline"} className={"w-full"}>
                      {navigation.map((item, idx) => (
                        <TabsTrigger
                          variant={"underline"}
                          value={item.value}
                          className="data-[state=active]"
                          key={idx}
                        >
                          {item.name}
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>
              </div>
            </HeaderMenu>
            <HeaderAction >
              <Button variant={"soft"} icon="arrow-right-solid" alignIcon="right">
                Log in
              </Button>
            </HeaderAction>
          </div>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <CardDescription>
          5. With Centered Logo
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <HeaderMenu>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Tabs defaultValue="dashboard">
                  <TabsList variant={"underline"} className={"w-full"}>
                    {navigation.map((item, idx) => (
                      <TabsTrigger
                        variant={"underline"}
                        value={item.value}
                        className="data-[state=active]"
                        key={idx}
                      >
                        {item.name}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
            </div>
          </HeaderMenu>
          <HeaderBranding>
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={100}
                height={100}
              />
            </div>
          </HeaderBranding>
          <HeaderAction >
            <Button variant={"soft"} icon="arrow-right-solid" alignIcon="right">
              Log in
            </Button>
          </HeaderAction>
        </div>
      </div>
      <CardHeader className="space-y-1">
        <CardDescription>
          6. With Flyout Menus
        </CardDescription>
      </CardHeader>
      <div className="mx-auto w-full border px-2 sm:px-4">
        <div className="relative flex h-16 items-center justify-between">
          <HeaderBranding>
            <div className="flex shrink-0 items-center">
              <img
                className="h-8 w-auto"
                src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=500"
                alt="Your Company"
                width={100}
                height={100}
              />
            </div>
          </HeaderBranding>
          <HeaderMenu>
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                <Tabs defaultValue="dashboard">
                  <TabsList variant={"underline"} className={"w-full"}>
                    {navigation.map((item, idx) => (
                      <>
                        <TabsTrigger
                          variant={"underline"}
                          value={item.value}
                          className="data-[state=active]"
                          key={idx}
                        >
                          {item?.isFlyout ?
                            <Popover>
                              <PopoverTrigger asChild>
                                <div className='flex w-full justify-center'>
                                  <Button variant="ghost" className='w-fit shadow-none' icon="chevron-down-regular" alignIcon='right'>
                                    {item.name}
                                  </Button>
                                </div>
                              </PopoverTrigger>
                              <PopoverContent className="z-10 flex w-screen max-w-max border-none px-4 shadow-none">
                                <div className="w-screen max-w-md flex-auto overflow-hidden rounded-3xl bg-white text-sm leading-6 shadow-lg ring-1 ring-gray-900/5">
                                  <div className="p-4">
                                    {solutions.map((item: DataWithDesc, idx) => (
                                      <div key={idx} className="group relative flex gap-x-6 rounded-lg p-4 hover:bg-gray-50">
                                        <div className="mt-1 flex h-11 w-11 flex-none items-center justify-center rounded-lg bg-gray-50 group-hover:bg-white">
                                          <Icon name={item?.icon || "check-circle-solid"} className="h-6 w-6 text-gray-600 group-hover:text-indigo-600" aria-hidden="true" />
                                        </div>
                                        <div>
                                          <a href={item.href} className="font-semibold text-gray-900">
                                            {item.name}
                                            <span className="absolute inset-0" />
                                          </a>
                                          <p className="mt-1 text-gray-600">{item.description}</p>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                  <div className="bottom-0 grid w-full grid-cols-2 divide-x divide-gray-900/5 bg-gray-50 p-0">
                                    {callsToAction.map((item: Data) => (
                                      <a
                                        key={item.name}
                                        href={item.href}
                                        className="flex items-center justify-center gap-x-2.5 p-3 font-semibold text-gray-900 hover:bg-gray-100"
                                      >
                                        <Icon name={item?.icon} className="h-5 w-5 flex-none text-gray-400" aria-hidden="true" />
                                        {item.name}
                                      </a>
                                    ))}
                                  </div>
                                </div>
                              </PopoverContent>
                            </Popover>
                            :
                            item.name
                          }
                        </TabsTrigger>
                      </>
                    ))}
                  </TabsList>
                </Tabs>

              </div>
            </div>
          </HeaderMenu>
          <HeaderAction >
            <Button variant={"soft"} icon="arrow-right-solid" alignIcon="right">
              Log in
            </Button>
          </HeaderAction>
        </div>
      </div>

    </Card>
  )
}
