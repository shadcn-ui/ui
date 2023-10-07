"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/registry/tui/ui/card"
import { Grid, GridItem } from "@/registry/tui/ui/grid"


export function GridList6() {
    return (
        <Card >
            <CardHeader className="pb-4">
                <CardTitle className="text-base text-primary">Images with details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-1 p-2 bg-gray-100">
                <Grid colsMobile={1} colsTab={2} cols={4} gap={5}>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1582053433976-25c00369fc93?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_5214.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_5214.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">4 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1614926857083-7be149266cda?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_4985.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_4985.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">3.9 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1614705827065-62c3dc488f40?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_3851.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_3851.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">3.8 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_4278.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_4278.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">4.1 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1586348943529-beaae6c28db9?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_6842.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_6842.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">4 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?ixlib=rb-1.2.1&ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_3284.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_3284.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">3.9 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1547036967-23d11aacaee0?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_4841.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_4841.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">3.8 MB</p>
                        </div>
                    </GridItem>
                    <GridItem>
                        <div className="relative">
                            <div className="group aspect-h-7 aspect-w-10 block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                                <img src="https://images.unsplash.com/photo-1492724724894-7464c27d0ceb?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=512&q=80" alt="" className="pointer-events-none object-cover group-hover:opacity-75" />
                                <button type="button" className="absolute inset-0 focus:outline-none">
                                    <span className="sr-only">View details for IMG_5644.HEIC</span>
                                </button>
                            </div>
                            <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">IMG_5644.HEIC</p>
                            <p className="pointer-events-none block text-sm font-medium text-gray-500">4 MB</p>
                        </div>
                    </GridItem>
                </Grid>
            </CardContent>
        </Card>
    )
}
