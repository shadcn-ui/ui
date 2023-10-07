"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Grid, GridItem } from "@/registry/tui/ui/grid"


export function GridList7() {
    return (
        <Card >
            <CardHeader className="pb-4">
                <CardTitle className="text-base text-primary">Logos cards with description list</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2 bg-gray-100">
                <Grid colsMobile={1} colsTab={1} cols={3} gap={5}>
                    <GridItem>
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                <img src="https://tailwindui.com/img/logos/48x48/tuple.svg" alt="Tuple" className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10" />
                                <div className="text-sm font-medium leading-6 text-gray-900">Tuple</div>
                                <div className="relative ml-auto">
                                    <button type="button" className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500" id="options-menu-0-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                        </svg>
                                    </button>

                                    <div className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-0-button" tabIndex={-1}>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-0-item-0">View<span className="sr-only">, Tuple</span></a>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-0-item-1">Edit<span className="sr-only">, Tuple</span></a>
                                    </div>
                                </div>
                            </div>
                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Last invoice</dt>
                                    <dd className="text-gray-700"><time dateTime="2022-12-13">December 13, 2022</time></dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Amount</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="font-medium text-gray-900">$2,000.00</div>
                                        <div className="rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset text-red-700 bg-red-50 ring-red-600/10">Overdue</div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                <img src="https://tailwindui.com/img/logos/48x48/savvycal.svg" alt="SavvyCal" className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10" />
                                <div className="text-sm font-medium leading-6 text-gray-900">SavvyCal</div>
                                <div className="relative ml-auto">
                                    <button type="button" className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500" id="options-menu-1-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                        </svg>
                                    </button>

                                    <div className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-1-button" tabIndex={-1}>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-1-item-0">View<span className="sr-only">, SavvyCal</span></a>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-1-item-1">Edit<span className="sr-only">, SavvyCal</span></a>
                                    </div>
                                </div>
                            </div>
                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Last invoice</dt>
                                    <dd className="text-gray-700"><time dateTime="2023-01-22">January 22, 2023</time></dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Amount</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="font-medium text-gray-900">$14,000.00</div>
                                        <div className="rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20">Paid</div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="overflow-hidden rounded-xl border border-gray-200">
                            <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">
                                <img src="https://tailwindui.com/img/logos/48x48/reform.svg" alt="Reform" className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10" />
                                <div className="text-sm font-medium leading-6 text-gray-900">Reform</div>
                                <div className="relative ml-auto">
                                    <button type="button" className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500" id="options-menu-2-button" aria-expanded="false" aria-haspopup="true">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M3 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM8.5 10a1.5 1.5 0 113 0 1.5 1.5 0 01-3 0zM15.5 8.5a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" />
                                        </svg>
                                    </button>

                                    <div className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none hidden" role="menu" aria-orientation="vertical" aria-labelledby="options-menu-2-button" tabIndex={-1}>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-2-item-0">View<span className="sr-only">, Reform</span></a>
                                        <a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900" role="menuitem" tabIndex={-1} id="options-menu-2-item-1">Edit<span className="sr-only">, Reform</span></a>
                                    </div>
                                </div>
                            </div>
                            <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm leading-6">
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Last invoice</dt>
                                    <dd className="text-gray-700"><time dateTime="2023-01-23">January 23, 2023</time></dd>
                                </div>
                                <div className="flex justify-between gap-x-4 py-3">
                                    <dt className="text-gray-500">Amount</dt>
                                    <dd className="flex items-start gap-x-2">
                                        <div className="font-medium text-gray-900">$7,600.00</div>
                                        <div className="rounded-md py-1 px-2 text-xs font-medium ring-1 ring-inset text-green-700 bg-green-50 ring-green-600/20">Paid</div>
                                    </dd>
                                </div>
                            </dl>
                        </div>
                    </GridItem>
                </Grid>
            </CardContent>
        </Card>
    )
}
