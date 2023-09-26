import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Button } from '../../ui/button'
import { cn } from '@/lib/utils'
import { Banner } from '../../ui/banner'


export const PrivacyNoticeBanner = ({ description, align, secondary }: any) => {
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <div className={cn('relative h-full pt-28 mt-24 w-full', secondary && "pt-0")}>
                    <Banner
                        align={align}
                        variant={secondary ? "notice-secondary" : "notice"}
                        body={<p className="text-sm leading-6 text-gray-900">
                            This website uses cookies to supplement a balanced diet and provide a much deserved reward to the senses after
                            consuming bland but nutritious meals. Accepting our cookies is optional but recommended, as they are
                            delicious. See our{' '}
                            <a href="#" className="font-semibold text-indigo-600">
                                cookie policy
                            </a>
                            .
                        </p>}
                        actionItems={
                            <div className="mt-4 flex items-center gap-x-2 whitespace-nowrap">
                                <Button
                                    type="button"
                                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Accept all
                                </Button>
                                <Button variant="outline" type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                    Reject all
                                </Button>
                            </div>
                        }
                    />
                </div>
            </CardContent>
        </>
    )
}

const DenverText = ({ dark }: { dark?: boolean }) => {
    return (
        <p className={`text-sm leading-6 ${dark ? "text-gray-900" : "text-white"} `}>
            <a href="#">
                <strong className="font-semibold">GeneriCon 2023</strong>
                <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                    <circle cx={1} cy={1} r={1} />
                </svg>
                Join us in Denver from June 7 – 9 to see what’s coming next&nbsp;<span aria-hidden="true">&rarr;</span>
            </a>
        </p>
    )
}

export const SimpleBanner = ({ description, align }: any) => {
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='relative h-full pt-20 w-full'>
                    <Banner
                        body={<DenverText />}
                        showDismissButton
                        variant="secondary"
                        align={align}
                    />
                </div>
            </CardContent>
        </>)
}

export const GeneralBanner = ({ description, dark, onBrands }:
    { description: string, dark?: boolean, onBrands?: boolean }) => {
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <Banner
                    body={<DenverText />}
                    showDismissButton
                    variant="primary"
                    dark={dark}
                    onBrands={onBrands}
                />
            </CardContent>
        </>
    )
}


const BannerCards = () => {
    return (
        <Card className='p-0 w-full col-span-2'>
            <CardHeader>
                <CardTitle>
                    Banners
                </CardTitle>
                <CardDescription>
                    With button
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0 w-full'>
                {/* 1 */}
                <div className="relative isolate flex items-center gap-x-6 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-70 overflow-hidden bg-gray-50 px-6 sm:px-3.5 sm:before:flex-1">
                    <Banner
                        body={
                            <>
                                <DenverText dark />
                                <Button
                                    className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Register now <span aria-hidden="true">&rarr;</span>
                                </Button>
                            </>
                        }
                        variant="primary"
                        dismissButtonStyle='text-gray-900'
                        showDismissButton
                    />
                </div>

                <GeneralBanner description='On dark' dark />
                <GeneralBanner description='On brand' onBrands />
                {/* 4 */}
                <CardHeader>
                    <CardDescription>
                        With background glow
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="relative isolate flex items-center gap-x-6 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-70 overflow-hidden bg-gray-50 px-6 sm:px-3.5 sm:before:flex-1">
                        <Banner
                            body={<DenverText dark />}
                            showDismissButton
                            dismissButtonStyle='text-gray-900'
                            variant="primary"
                        />
                    </div>
                </CardContent>

                <CardHeader>
                    <CardDescription>
                        With link
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="relative isolate bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-70 flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 sm:px-3.5 sm:before:flex-1">
                        <Banner
                            body={
                                <>
                                    <DenverText dark />
                                    <a href="#" className="whitespace-nowrap -ml-5 text-sm hover:underline font-semibold">
                                        Get your ticket&nbsp;
                                    </a>
                                </>
                            }
                            showDismissButton
                            dismissButtonStyle='text-gray-900'
                            variant="primary"
                        />
                    </div>
                </CardContent>
                <CardHeader>
                    <CardDescription>
                        Left-aligned
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <Banner
                        body={<DenverText />}
                        align="left"
                        showDismissButton
                        variant="secondary"
                    />
                </CardContent>

                <CardHeader>
                    <CardDescription>
                        Bottom aligned
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className='relative bg-gray-100 h-10'>
                        {/* make it fixed and remove the outer div for screen */}
                        <Banner
                            body={
                                <DenverText dark />
                            }
                            showDismissButton
                            dismissButtonStyle='text-gray-900'
                            variant="primary"
                            align="bottom"
                        />
                    </div>
                </CardContent>
            </CardContent>

            <SimpleBanner description="Floating at bottom" align="floating-bottom" />
            <SimpleBanner description="Floating at bottom centered" align="floating-bottom-center" />
            <PrivacyNoticeBanner description="Privacy notice right-aligned" align="right" />
            <PrivacyNoticeBanner description="Privacy notice centered" align="center" />
            <PrivacyNoticeBanner description="Privacy notice left-aligned" align="left" />
            <PrivacyNoticeBanner description="Privacy notice full-width" align="bottom" secondary />
        </Card>
    )
}

export default BannerCards
