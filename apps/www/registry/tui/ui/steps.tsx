import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { Icon, IconType } from "./icon"
import { colors } from "./helper/types"

const stepsVariants = cva(
    " block ",
    {
        variants: {
            anchorSize: {
                default: "h-2.5 w-2.5 rounded-full",
                xl: "h-full w-full rounded-full",
            },
        },
        defaultVariants: {
            anchorSize: "default"
        }
    }
)

const stepsSpanVariants = cva(
    "",
    {
        variants: {
            fontSize: {
                default: "text-sm font-medium"
            },
            spanSize: {
                m: "h-4 w-4 rounded-full",
                default: "h-5 w-5"
            }
        },
        defaultVariants: {
            fontSize: "default"
        }
    }
)


const stepsDivVariants = cva(
    "mt-0.5 ",
    {
        variants: {
            divSize: {
                m: "h-full w-0.5",
                default: "h-0.5 w-full",
                l: "h-2 w-2 rounded-full",
                xl: "h-full w-5"
            }
        },
        defaultVariants: {
            divSize: "default"
        }
    }
)

const stepsCircleVariants = cva(
    " relative flex  items-center justify-center ",
    {
        variants: {
            circleSize: {
                default: "h-8 w-8 rounded-full "
            }
        },
        defaultVariants: {
            circleSize: "default"
        }
    }
)

const stepsPanelVariants = cva(
    " flex flex-shrink-0 items-center justify-center ",
    {
        variants: {
            panelSize: {
                default: "h-10 w-10 rounded-full "
            }
        },
        defaultVariants: {
            panelSize: "default"
        }
    }
)


export interface StepsProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof stepsVariants> {
    simple?: boolean;
    panels?: boolean;
    icon?: IconType;
    bullets?: boolean;
    circle?: boolean;
    bulletText?: boolean;
    circleText?: boolean;
    progressBar?: boolean;
    iconStyle?: string;
    steps?: any;
    bulletStepText?: string;
    bulletOfText?: string;
    backgroundColor?: colors;
    textColor?: colors;
    borderColor?:colors;
    anchorSize?: "default" | "xl";
    spanSize?: "default" | "m";
    divSize?: "default" | "l" | "m" | "xl";

}
const classNames = (...classes: string[])=>{
    return classes.filter(Boolean).join(' ')
}

const Steps = ({ children, className, iconStyle, backgroundColor,borderColor, textColor, spanSize, divSize, steps, simple, anchorSize, bulletOfText, bulletStepText, panels, bullets, circle, bulletText, progressBar, icon, circleText, ...props }: StepsProps) => {

    const bgColor = (backgroundColor?: colors) => {
        return `bg-${backgroundColor}-600 `
    }

    const fontColor = (textColor?: colors) => {
        return `text-${textColor}-600 `
    }

    const bordersColor = (borderColor?: colors) => {
        return `border-${borderColor}-600 `
    }

    return (
            <nav>
                {simple ?
                    <ol className={cn("space-y-4 md:flex md:space-x-8 md:space-y-0", className)}>
                        {steps.map((step: any, index: number) => (
                            <li key={index} className={cn("md:flex-1", className)}>
                                {step.status === 'complete' ? (
                                    <a href="#" className={cn(`flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4 ${step.borderClass}`, className)}>
                                        <span className={cn(`${step.textClass}`, stepsSpanVariants({}), className)}>{step.id}</span>
                                        <span className={cn(stepsSpanVariants({}), className)}>{step.name}</span>
                                    </a>
                                ) : step.status === 'current' ? (
                                    <a
                                        href={step.href}
                                        className={cn("flex flex-col border-l-4 py-2 pl-4 md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4",bordersColor(borderColor),className)}
                                        aria-current="step"
                                    >
                                        <span className={cn("text-sm font-medium",fontColor(textColor),className)}>{step.id}</span>
                                        <span className="text-sm font-medium">{step.name}</span>
                                    </a>
                                ) : 
                                (
                                    <a
                                      href={step.href}
                                      className="group flex flex-col border-l-4 border-accent py-2 pl-4 hover:border-acccent md:border-l-0 md:border-t-4 md:pb-0 md:pl-0 md:pt-4"
                                    >
                                      <span className="text-sm font-medium">{step.id}</span>
                                      <span className="text-sm font-medium">{step.name}</span>
                                    </a>
                                  )
                                }
                            </li>
                        ))}
                    </ol> : null
                }
                {bullets ?
                    <>
                        <p className={cn(stepsSpanVariants({}), className)}>
                            {bulletStepText} {steps.findIndex((step: any) => step.status === 'current') + 1} {bulletOfText} {steps.length}
                        </p>
                        <ol role="list" className={cn("ml-8 flex items-center space-x-5", className)}>
                            {steps.map((step: any) => (
                                <li key={step.name}>
                                    {step.status === 'complete' ? (
                                        <a href={step.href} className={cn(" hover:bg-indigo-900", bgColor(backgroundColor), stepsVariants({}), className)}>
                                        </a>
                                    ) : step.status === 'current' ? (
                                        <a href={step.href} className={cn("relative flex items-center justify-center", className)}>
                                            <span className={cn("absolute flex p-px", stepsSpanVariants({ spanSize }), className)} aria-hidden="true">
                                                <span className={cn("bg-accent", stepsVariants({ anchorSize }), className)} />
                                            </span>
                                            <span className={cn("relative", bgColor(backgroundColor), stepsVariants({}), className)} aria-hidden="true" />

                                        </a>
                                    ) : (
                                        <a href={step.href} className={cn(" bg-primary/50", stepsVariants({}), className)}>
                                        </a>
                                    )}
                                </li>
                            ))}
                        </ol>

                    </>

                    : circle ?
                        <ol role="list" className={cn("flex items-center", className)}>
                            {steps.map((step: any, stepIdx: number) => (
                                <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : '', 'relative')}>
                                    {step.status === 'complete' ? (
                                        <>
                                            <div className={cn("absolute inset-0 flex items-center", className)} aria-hidden="true">
                                                <div className={cn(stepsDivVariants({}), bgColor(backgroundColor), className)} />
                                            </div>
                                            <a
                                                href="#"
                                                className={cn("hover:bg-indigo-900", stepsCircleVariants({}), bgColor(backgroundColor), className)}>
                                                {icon && <Icon name={icon} />}
                                            </a>
                                        </>
                                    ) : step.status === 'current' ? (
                                        <>
                                            <div className={cn("absolute inset-0 flex items-center", className)} aria-hidden="true">
                                                <div className={cn("bg-accent", stepsDivVariants({}), className)} />
                                            </div>
                                            <a
                                                href="#"
                                                className={cn("border-2",bordersColor(borderColor), stepsCircleVariants({}), className)} aria-current="step">
                                                <span className={cn(bgColor(backgroundColor), stepsVariants({}), className)} aria-hidden="true" />
                                            </a>
                                        </>
                                    ) : (
                                        <>
                                            <div className={cn("absolute inset-0 flex items-center", className)} aria-hidden="true">
                                                <div className={cn(" bg-primary/20", stepsDivVariants({}), className)} />
                                            </div>
                                            <a
                                                href="#"
                                                className={cn("border-2 border-primary/20 bg-white ", stepsCircleVariants({}), className)}>
                                                <span className={cn(" bg-transparent ", stepsVariants({}), className)} aria-hidden="true" />
                                            </a>
                                        </>
                                    )}
                                </li>
                            ))}
                        </ol> : bulletText ?
                            <div className={cn("px-4 sm:px-6 lg:px-8", className)}>
                                <nav className={cn("flex justify-center", className)} aria-label="Progress">
                                    <ol role="list" className={cn("space-y-6", className)}>
                                        {steps.map((step: any) => (
                                            <li key={step.name}>
                                                {step.status === 'complete' ? (
                                                    <a href={step.href} className="group">
                                                        <span className={cn("flex items-start", className)}>
                                                            <span className={cn("relative flex flex-shrink-0 items-center justify-center", stepsSpanVariants({ spanSize }), className)}>
                                                                {icon && <Icon name={icon} className={cn(" group-hover:text-indigo-800",fontColor(textColor), `${iconStyle}`, className)} />}
                                                            </span>
                                                            <span className={cn("ml-3 text-gray-500", stepsSpanVariants({}), className)}>
                                                                {step.name}
                                                            </span>
                                                        </span>
                                                    </a>
                                                ) : step.status === 'current' ? (
                                                    <a href={step.href} className={cn("flex items-start", className)} aria-current="step">
                                                        <span className={cn("relative flex flex-shrink-0 items-center justify-center", stepsSpanVariants({ spanSize }), className)} aria-hidden="true">
                                                            <span className={cn("absolute bg-indigo-200", stepsSpanVariants({ spanSize }), className)} />
                                                            <span className={cn("relative", bgColor(backgroundColor), stepsVariants({}), className)} />
                                                        </span>
                                                        <span className={cn("ml-3",fontColor(textColor), stepsSpanVariants({}), className)}>{step.name}</span>
                                                    </a>
                                                ) : (
                                                    <a href={step.href} className="group">
                                                        <div className={cn("flex items-start", className)}>
                                                            <div className={cn("relative flex flex-shrink-0 items-center justify-center", stepsSpanVariants({ spanSize }), className)} aria-hidden="true">
                                                                <div className={cn("bg-gray-300 group-hover:bg-gray-400", stepsDivVariants({ divSize }), className)} />
                                                            </div>
                                                            <p className={cn("ml-3 text-gray-500 group-hover:text-gray-900", stepsSpanVariants({}), className)}>{step.name}</p>
                                                        </div>
                                                    </a>
                                                )}
                                            </li>
                                        ))}
                                    </ol>
                                </nav>
                            </div> : circleText ?

                                <ol role="list" className="overflow-hidden">
                                    {steps.map((step: any, stepIdx: number) => (
                                        <li key={step.name} className={classNames(stepIdx !== steps.length - 1 ? 'pb-10' : '', 'relative')}>
                                            {step.status === 'complete' ? (
                                                <>
                                                    {stepIdx !== steps.length - 1 ? (
                                                        <div className={cn("absolute left-4 top-4 -ml-px ", stepsDivVariants({ divSize }), bgColor(backgroundColor), className)} aria-hidden="true" />
                                                    ) : null}
                                                    <a href={step.href} className={cn("group relative flex items-start", className)}>
                                                        <span className={cn("flex items-center", className)}>
                                                            <span className={cn("z-10 group-hover:bg-indigo-800", stepsCircleVariants({}), bgColor(backgroundColor), className)}>
                                                                {icon && <Icon name={icon} className={cn(`${iconStyle}`, className)} />}
                                                            </span>
                                                        </span>
                                                        <span className={cn("ml-4 flex min-w-0 flex-col", className)}>
                                                            <span className={cn(stepsSpanVariants({}), className)}>{step.name}</span>
                                                            <span className={cn("text-primary/60", stepsSpanVariants({}), className)}>{step.description}</span>
                                                        </span>
                                                    </a>
                                                </>
                                            ) : step.status === 'current' ? (
                                                <>
                                                    {stepIdx !== steps.length - 1 ? (
                                                        <div className={cn("absolute left-4 top-4 -ml-px  bg-primary/20", stepsDivVariants({ divSize }), className)} aria-hidden="true" />
                                                    ) : null}
                                                    <a href={step.href} className={cn("group relative flex items-start", className)} aria-current="step">
                                                        <span className={cn("flex items-center", className)} aria-hidden="true">
                                                            <span className={cn("z-10 border-2 bg-white",bordersColor(borderColor), stepsCircleVariants({}), className)}>
                                                                <span className={cn(bgColor(backgroundColor), stepsVariants({}), className)} />
                                                            </span>
                                                        </span>
                                                        <span className={cn("ml-4 flex min-w-0 flex-col", className)}>
                                                            <span className={cn(fontColor(textColor), stepsSpanVariants({}), className)}>{step.name}</span>
                                                            <span className={cn("text-primary", stepsSpanVariants({}), className)}>{step.description}</span>
                                                        </span>
                                                    </a>
                                                </>
                                            ) : (
                                                <>
                                                    {stepIdx !== steps.length - 1 ? (
                                                        <div className={cn("absolute left-4 top-4 -ml-px  bg-primary/20  ", stepsDivVariants({ divSize }), className)} aria-hidden="true" />
                                                    ) : null}
                                                    <a href={step.href} className={cn("group relative flex items-start", className)}>
                                                        <span className={cn("flex items-center", className)} aria-hidden="true">
                                                            <span className={cn("z-10 border-2 border-primary/20 bg-white group-hover:border-gray-400", stepsCircleVariants({}), className)}>
                                                                <span className={cn(" bg-transparent ", stepsVariants({}), className)} />
                                                            </span>
                                                        </span>
                                                        <span className={cn("ml-4 flex min-w-0 flex-col", className)}>
                                                            <span className={cn("text-primary", stepsSpanVariants({}), className)}>{step.name}</span>
                                                            <span className={cn("text-primary", stepsSpanVariants({}), className)}>{step.description}</span>
                                                        </span>
                                                    </a>
                                                </>
                                            )}
                                        </li>
                                    ))}
                                </ol> : progressBar ?
                                    <div>
                                        <p className={cn( stepsSpanVariants({}), className)}>Migrating MySQL database...</p>
                                        <div className={cn("mt-6", className)} aria-hidden="true">
                                            <div className={cn("overflow-hidden rounded-full bg-accent", className)}>
                                                <div className={cn(stepsDivVariants({ divSize }), bgColor(backgroundColor), stepsSpanVariants({}), className)} style={{ width: '37.5%' }} />
                                            </div>
                                            <div className={cn("mt-6 hidden grid-cols-4 text-primary sm:grid", className)}>
                                                {steps.map((step: any, index: number) => (
                                                    <div
                                                        key={index}
                                                        className={`text-${step.color || "black"} ${step.align === "left"
                                                            ? "text-left"
                                                            : step.align === "center"
                                                                ? "text-center"
                                                                : "text-right"
                                                            }`}
                                                    >
                                                        {step.text}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div> : panels ?
                                        <ol role="list" className={cn("divide-y divide-primary rounded-md border border-primary/20 md:flex md:divide-y-0", className)}>
                                            {steps.map((step: any, stepIdx: number) => (
                                                <li key={step.name} className={cn("relative md:flex md:flex-1", className)}>
                                                    {step.status === 'complete' ? (
                                                        <a href={step.href} className={cn("group flex w-full items-center", className)}>
                                                            <span className={cn("flex items-center px-6 py-4 ", stepsSpanVariants({}), className)}>
                                                                <span className={cn( stepsPanelVariants({}), bgColor(backgroundColor), className)}>
                                                                    {icon && <Icon name={icon} className={cn(`${iconStyle}`, className)} />}
                                                                </span>
                                                                <span className={cn("ml-4", stepsSpanVariants({}), className)}>{step.name}</span>
                                                            </span>
                                                        </a>
                                                    ) : step.status === 'current' ? (
                                                        <a href={step.href} className={cn("flex items-center px-6 py-4 ", stepsSpanVariants({}), className)} aria-current="step">
                                                            <span className={cn("border-2",bordersColor(borderColor), stepsPanelVariants({}), className)}>
                                                                <span className={cn(fontColor(textColor))}>{step.id}</span>
                                                            </span>
                                                            <span className={cn("ml-4",fontColor(textColor), stepsSpanVariants({}), className)}>{step.name}</span>
                                                        </a>
                                                    ) : (
                                                        <a href={step.href} className={cn("group flex items-center", stepsSpanVariants({}), className)}>
                                                            <span className={cn("flex items-center px-6 py-4 ", className)}>
                                                                <span className={cn("border-2 border-gray-300 group-hover:border-gray-400", stepsPanelVariants({}), className)}>
                                                                    <span className={cn("text-primary", className)}>{step.id}</span>
                                                                </span>
                                                                <span className={cn("ml-4 text-primary", stepsSpanVariants({}), className)}>{step.name}</span>
                                                            </span>
                                                        </a>
                                                    )}

                                                    {stepIdx !== steps.length - 1 ? (
                                                        <>
                                                            <div className={cn("absolute right-0 top-0 hidden  md:block", stepsDivVariants({ divSize }), className)} aria-hidden="true">
                                                                <svg
                                                                    className={cn(" text-primary/20", className)}
                                                                    viewBox="0 0 22 80"
                                                                    fill="none"
                                                                    preserveAspectRatio="none"
                                                                >
                                                                    <path
                                                                        d="M0 -2L20 40L0 82"
                                                                        vectorEffect="non-scaling-stroke"
                                                                        stroke="currentcolor"
                                                                        strokeLinejoin="round"
                                                                    />
                                                                </svg>
                                                            </div>
                                                        </>
                                                    ) : null}
                                                </li>
                                            ))}
                                        </ol> : null
                }
            </nav>
    )
}

export { Steps, stepsVariants }
