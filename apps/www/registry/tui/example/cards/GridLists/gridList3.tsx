"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Grid, GridItem } from "@/registry/tui/ui/grid"


export function GridList3() {
    return (
        <Card >
            <CardHeader className="pb-4">
                <CardTitle className="text-base text-primary">Simple cards</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2 bg-gray-100">
                <Grid colsMobile={1} colsTab={2} cols={4} gap={5}>
                    <GridItem>
                        <div className="flex rounded-md shadow-sm">
                            <div className="flex w-16 flex-shrink-0 items-center justify-center bg-pink-600 rounded-l-md text-sm font-medium text-white">GA</div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href="#" className="font-medium text-gray-900 hover:text-gray-600">Graph API</a>
                                    <p className="text-gray-500">16 Members</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="flex rounded-md shadow-sm">
                            <div className="flex w-16 flex-shrink-0 items-center justify-center bg-purple-600 rounded-l-md text-sm font-medium text-white">CD</div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href="#" className="font-medium text-gray-900 hover:text-gray-600">Component Design</a>
                                    <p className="text-gray-500">12 Members</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="flex rounded-md shadow-sm">
                            <div className="flex w-16 flex-shrink-0 items-center justify-center bg-yellow-500 rounded-l-md text-sm font-medium text-white">T</div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href="#" className="font-medium text-gray-900 hover:text-gray-600">Templates</a>
                                    <p className="text-gray-500">16 Members</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="flex rounded-md shadow-sm">
                            <div className="flex w-16 flex-shrink-0 items-center justify-center bg-green-500 rounded-l-md text-sm font-medium text-white">RC</div>
                            <div className="flex flex-1 items-center justify-between truncate rounded-r-md border-b border-r border-t border-gray-200 bg-white">
                                <div className="flex-1 truncate px-4 py-2 text-sm">
                                    <a href="#" className="font-medium text-gray-900 hover:text-gray-600">React Components</a>
                                    <p className="text-gray-500">8 Members</p>
                                </div>
                                <div className="flex-shrink-0 pr-2">
                                    <button type="button" className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-transparent bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2">
                                        <span className="sr-only">Open options</span>
                                        <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                            <path d="M10 3a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM10 8.5a1.5 1.5 0 110 3 1.5 1.5 0 010-3zM11.5 15.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </GridItem>
                </Grid>
            </CardContent>
        </Card>
    )
}
