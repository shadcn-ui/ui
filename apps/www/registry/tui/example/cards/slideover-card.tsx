"use client"
import { Button } from "@/registry/tui/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Dialog, DialogTrigger, SlideOverContent } from "@/registry/tui/ui/dialog"

export function SlideOverCard() {
  return (
    <>
      <Card>
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Slide Over Menu Variants</CardTitle>
          <CardDescription>
            List of possible variants of Slide Over
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <CardDescription>
            1. Empty Panel
          </CardDescription>
          <Dialog>
            <DialogTrigger>
              <Button>
                Open
              </Button>
            </DialogTrigger>
            <SlideOverContent panelWidth={'2xl'} iconName="chevron-right-solid">
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
            </SlideOverContent>
          </Dialog>
        </CardContent>
        <CardContent className="grid gap-4">
          <CardDescription>
            2. Wide Empty Panel
          </CardDescription>
          <Dialog>
            <DialogTrigger>
              <Button>
                Open
              </Button>
            </DialogTrigger>
            <SlideOverContent panelWidth={'7xl'}>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
            </SlideOverContent>
          </Dialog>
        </CardContent>
        <CardContent className="grid gap-4">
          <CardDescription>
            3. With Close button position
          </CardDescription>
          <Dialog>
            <DialogTrigger>
              <Button>
                Open
              </Button>
            </DialogTrigger>
            <SlideOverContent closeIconPosition="left">
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
            </SlideOverContent>
          </Dialog>
        </CardContent>
        <CardContent className="grid gap-4">
          <CardDescription>
            4. With Brand Header
          </CardDescription>
          <Dialog>
            <DialogTrigger>
              <Button>
                Open
              </Button>
            </DialogTrigger>
            <SlideOverContent brandHeader brandStyle="bg-indigo-700 text-white">
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
            </SlideOverContent>
          </Dialog>
        </CardContent>
        <CardContent className="grid gap-4">
          <CardDescription>
            5. With Fixed Header and Footer
          </CardDescription>
          <Dialog>
            <DialogTrigger>
              <Button>
                Open
              </Button>
            </DialogTrigger>
            <SlideOverContent fixedTitle fixedFooter footerContent={
              <div className="flex items-center justify-between space-x-2">
                <Button icon="floppy-disk-solid">
                  SAVE
                </Button>
                <Button icon="xmark-circle-solid" variant={'destructive'}>
                  CANCEL
                </Button>
              </div>
            }>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
              <div className="my-4 h-full">
                <div className="h-full rounded-xl border border-dashed border-gray-400 opacity-75">
                  <svg className="inset-0 h-full w-full stroke-gray-900/10" fill="none">
                    <defs>
                      <pattern id="pattern-b55d3ce5-d478-4029-95b9-44c415d04f63" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3"></path>
                      </pattern>
                    </defs>
                    <rect stroke="none" fill="url(#pattern-b55d3ce5-d478-4029-95b9-44c415d04f63)" width="100%" height="100%"></rect>
                  </svg>
                </div>
              </div>
            </SlideOverContent>
          </Dialog>
        </CardContent>
      </Card>
    </>
  )
}
