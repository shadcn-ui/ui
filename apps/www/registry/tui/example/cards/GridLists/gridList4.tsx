"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Grid, GridItem } from "@/registry/tui/ui/grid"


export function GridList4() {
    return (
        <Card >
            <CardHeader className="pb-4">
                <CardTitle className="text-base text-primary">Horizontal link cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2 bg-gray-100">
                <Grid colsMobile={1} colsTab={2} cols={2} gap={4} gapMobile={4} gapTab={4}>
                    <GridItem>
                        <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    <p className="text-sm font-medium text-gray-900">Leslie Alexander</p>
                                    <p className="truncate text-sm text-gray-500">Co-Founder / CEO</p>
                                </a>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    <p className="text-sm font-medium text-gray-900">Leslie Alexander</p>
                                    <p className="truncate text-sm text-gray-500">Co-Founder / CEO</p>
                                </a>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    <p className="text-sm font-medium text-gray-900">Leslie Alexander</p>
                                    <p className="truncate text-sm text-gray-500">Co-Founder / CEO</p>
                                </a>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400">
                            <div className="flex-shrink-0">
                                <img className="h-10 w-10 rounded-full" src="https://images.unsplash.com/photo-1517841905240-472988babdf9?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <a href="#" className="focus:outline-none">
                                    <span className="absolute inset-0" aria-hidden="true"></span>
                                    <p className="text-sm font-medium text-gray-900">Leslie Alexander</p>
                                    <p className="truncate text-sm text-gray-500">Co-Founder / CEO</p>
                                </a>
                            </div>
                        </div>
                    </GridItem>
                </Grid>
            </CardContent>
        </Card>
    )
}
