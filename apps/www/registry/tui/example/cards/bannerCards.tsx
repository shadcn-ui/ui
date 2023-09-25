import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card'
import { Icon } from '../../ui/icon'

export const PrivacyNoticeBanner = ({ description, align }: any) => {
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='relative h-full pt-28 mt-24 w-full'>
                    <div className="pointer-events-none absolute inset-x-0 bottom-0 px-6 pb-6">
                        <div className={`pointer-events-auto ${align === "center" ? "mx-auto" : align === "left" ? "mr-auto" : "ml-auto"} max-w-xl rounded-xl bg-white p-6 shadow-lg ring-1 ring-gray-900/10`}>
                            <p className="text-sm leading-6 text-gray-900">
                                This website uses cookies to supplement a balanced diet and provide a much deserved reward to the senses after
                                consuming bland but nutritious meals. Accepting our cookies is optional but recommended, as they are
                                delicious. See our{' '}
                                <a href="#" className="font-semibold text-indigo-600">
                                    cookie policy
                                </a>
                                .
                            </p>
                            <div className="mt-4 flex items-center gap-x-5">
                                <button
                                    type="button"
                                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                                >
                                    Accept all
                                </button>
                                <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                                    Reject all
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </CardContent>

        </>
    )
}

export const DismissButton = ({ dark }: { dark?: boolean }) => {
    return (
        <button type="button" className="-m-3 p-3 focus-visible:outline-offset-[-4px]">
            <span className="sr-only">Dismiss</span>
            <Icon name="xmark-solid" className={`h-5 w-5 ${dark ? "text-gray-900" : "text-white"}`} aria-hidden="true" />
        </button>
    )
}

export const GlowBackground = () => {
    return (
        <>
            <div
                className="absolute left-[max(-7rem,calc(50%-52rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                />
            </div>
            <div
                className="absolute left-[max(45rem,calc(50%+8rem))] top-1/2 -z-10 -translate-y-1/2 transform-gpu blur-2xl"
                aria-hidden="true"
            >
                <div
                    className="aspect-[577/310] w-[36.0625rem] bg-gradient-to-r from-[#ff80b5] to-[#9089fc] opacity-30"
                    style={{
                        clipPath:
                            'polygon(74.8% 41.9%, 97.2% 73.2%, 100% 34.9%, 92.5% 0.4%, 87.5% 0%, 75% 28.6%, 58.5% 54.6%, 50.1% 56.8%, 46.9% 44%, 48.3% 17.4%, 24.7% 53.9%, 0% 27.9%, 11.9% 74.2%, 24.9% 54.1%, 68.6% 100%, 74.8% 41.9%)',
                    }}
                />
            </div>
        </>
    )
}

export const SimpleBanner = ({ description, align }: any) => {
    const mainClass = align === "floating bottom" ? "pointer-events-none absolute inset-x-0 bottom-0 sm:px-6 sm:pb-5 lg:px-8"
        : "pointer-events-none absolute inset-x-0 bottom-0 sm:flex sm:justify-center sm:px-6 sm:pb-5 lg:px-8"
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <div className='relative h-full pt-20 w-full'>
                    <div className={mainClass}>
                        <div className="pointer-events-auto flex items-center justify-between gap-x-6 bg-gray-900 px-6 py-2.5 sm:rounded-xl sm:py-3 sm:pl-4 sm:pr-3.5">
                            <p className="text-sm leading-6 text-white">
                                <a href="#">
                                    <strong className="font-semibold">GeneriCon 2023</strong>
                                    <svg viewBox="0 0 2 2" className="mx-2 inline h-0.5 w-0.5 fill-current" aria-hidden="true">
                                        <circle cx={1} cy={1} r={1} />
                                    </svg>
                                    Join us in Denver from June 7 – 9 to see what’s coming next&nbsp;<span aria-hidden="true">&rarr;</span>
                                </a>
                            </p>
                            <DismissButton />
                        </div>
                    </div>
                </div>
            </CardContent>
        </>)
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

export const GeneralBanner = ({ description, dark, onBrands }: { description: string, dark?: boolean, onBrands?: boolean }) => {
    return (
        <>
            <CardHeader>
                <CardDescription>
                    {description}
                </CardDescription>
            </CardHeader>
            <CardContent className='p-0'>
                <div className={`flex items-center gap-x-6 ${dark && "bg-gray-900"} ${onBrands && "bg-primary"} px-6 py-2.5 sm:px-3.5 sm:before:flex-1`}>
                    <DenverText />
                    <div className="flex flex-1 justify-end">
                        <DismissButton />
                    </div>
                </div>
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
                <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                    <GlowBackground />
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                        <DenverText dark />
                        <a
                            href="#"
                            className="flex-none rounded-full bg-gray-900 px-3.5 py-1 text-sm font-semibold text-white shadow-sm hover:bg-gray-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-900"
                        >
                            Register now <span aria-hidden="true">&rarr;</span>
                        </a>
                    </div>
                    <div className="flex flex-1 justify-end">
                        <DismissButton dark />
                    </div>
                </div>

                <GeneralBanner description='On dark' dark />
                <GeneralBanner description='On brand' onBrands />

                <CardHeader>
                    <CardDescription>
                        With background glow
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                        <GlowBackground />
                        <DenverText dark />
                        <div className="flex flex-1 justify-end">
                            <DismissButton dark />
                        </div>
                    </div>
                </CardContent>

                <CardHeader>
                    <CardDescription>
                        With link
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="relative isolate flex items-center gap-x-6 overflow-hidden bg-gray-50 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                        <GlowBackground />
                        <DenverText dark />
                        <div className="flex flex-1 justify-end">
                            <DismissButton dark />
                        </div>
                    </div>
                </CardContent>
                <CardHeader>
                    <CardDescription>
                        Left-aligned
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className="flex items-center justify-between gap-x-6 bg-gray-900 px-6 py-2.5 sm:pr-3.5 lg:pl-8">
                        <DenverText />
                        <DismissButton />
                    </div>
                </CardContent>

                <CardHeader>
                    <CardDescription>
                        Bottom aligned
                    </CardDescription>
                </CardHeader>
                <CardContent className='p-0'>
                    <div className='relative h-full pt-20'>
                        {/* make it fixed and remove the outer div for screen */}
                        <div className="absolute inset-x-0 bottom-0">
                            <div className="flex items-center gap-x-6 bg-gray-900 px-6 py-2.5 sm:px-3.5 sm:before:flex-1">
                                <DenverText />
                                <div className="flex flex-1 justify-end">
                                    <DismissButton />
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </CardContent>

            <SimpleBanner description="Floating at bottom" align="floating bottom" />
            <SimpleBanner description="Floating at bottom centered" align="bottom center" />
            <PrivacyNoticeBanner description="Privacy notice right-aligned" align="right" />
            <PrivacyNoticeBanner description="Privacy notice centered" align="center" />
            <PrivacyNoticeBanner description="Privacy notice left-aligned" align="left" />

        </Card>
    )
}

export default BannerCards
