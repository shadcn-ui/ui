import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"


//#region Flex component
const flexVariants = cva(
    "flex w-full",
    {
        variants: {
            directionMobile: {
                row: "flex-row",
                col: "flex-col",
                "row-reverse": "flex-row-reverse",
                "col-reverse": "flex-col-reverse"
            },
            directionTab: {
                row: "md:flex-row",
                col: "md:flex-col",
                "row-reverse": "md:flex-row-reverse",
                "col-reverse": "md:flex-col-reverse"
            },
            direction: {
                row: "lg:flex-row",
                col: "lg:flex-col",
                "row-reverse": "lg:flex-row-reverse",
                "col-reverse": "lg:flex-col-reverse"
            },
            wrap: {
                wrap: "flex-wrap",
                nowrap: "flex-nowrap",
                "wrap-reverse": "flex-nowrap"
            },
            gapMobile: {
                0: "gap-0",
                1: "gap-1",
                2: "gap-2",
                3: "gap-3",
                4: "gap-4",
                5: "gap-5",
                6: "gap-6",
                7: "gap-7",
                8: "gap-8",
                9: "gap-9",
                10: "gap-10",
                11: "gap-11",
                12: "gap-12",
                14: "gap-14",
                16: "gap-16",
                20: "gap-20",
                24: "gap-24",
                28: "gap-28",
                32: "gap-32",
                36: "gap-36",
                40: "gap-40",
                44: "gap-44",
                48: "gap-48",
                52: "gap-52",
                56: "gap-56",
                60: "gap-60",
                64: "gap-64",
                72: "gap-72",
                80: "gap-80",
                96: "gap-96"
            },
            gapTab: {
                0: "md:gap-0",
                1: "md:gap-1",
                2: "md:gap-2",
                3: "md:gap-3",
                4: "md:gap-4",
                5: "md:gap-5",
                6: "md:gap-6",
                7: "md:gap-7",
                8: "md:gap-8",
                9: "md:gap-9",
                10: "md:gap-10",
                11: "md:gap-11",
                12: "md:gap-12",
                14: "md:gap-14",
                16: "md:gap-16",
                20: "md:gap-20",
                24: "md:gap-24",
                28: "md:gap-28",
                32: "md:gap-32",
                36: "md:gap-36",
                40: "md:gap-40",
                44: "md:gap-44",
                48: "md:gap-48",
                52: "md:gap-52",
                56: "md:gap-56",
                60: "md:gap-60",
                64: "md:gap-64",
                72: "md:gap-72",
                80: "md:gap-80",
                96: "md:gap-96"
            },
            gap: {
                0: "lg:gap-0",
                1: "lg:gap-1",
                2: "lg:gap-2",
                3: "lg:gap-3",
                4: "lg:gap-4",
                5: "lg:gap-5",
                6: "lg:gap-6",
                7: "lg:gap-7",
                8: "lg:gap-8",
                9: "lg:gap-9",
                10: "lg:gap-10",
                11: "lg:gap-11",
                12: "lg:gap-12",
                14: "lg:gap-14",
                16: "lg:gap-16",
                20: "lg:gap-20",
                24: "lg:gap-24",
                28: "lg:gap-28",
                32: "lg:gap-32",
                36: "lg:gap-36",
                40: "lg:gap-40",
                44: "lg:gap-44",
                48: "lg:gap-48",
                52: "lg:gap-52",
                56: "lg:gap-56",
                60: "lg:gap-60",
                64: "lg:gap-64",
                72: "lg:gap-72",
                80: "lg:gap-80",
                96: "lg:gap-96"
            },

            justifyContent: {
                normal: "justify-normal",
                start: "justify-start",
                end: "justify-end",
                center: "justify-center",
                between: "justify-between",
                around: "justify-around",
                evenly: "justify-evenly",
                stretch: "justify-stretch"
            },
            alignItems: {
                start: "items-start",
                end: "items-end",
                center: "items-center",
                baseline: "items-baseline",
                stretch: "items-stretch"
            },
            rounded: {
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                none: "rounded-none",
                full: "rounded-full",
            }
        }
    }
)

export interface FlexProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexVariants> {
    asChild?: boolean;
}

const Flex = React.forwardRef<HTMLDivElement, FlexProps>(
    ({ directionMobile, directionTab, direction, wrap, gapMobile, gapTab, gap, justifyContent, alignItems, rounded, asChild, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(flexVariants({ directionMobile, directionTab, direction, wrap, gapMobile, gapTab, gap, justifyContent, alignItems, rounded }), className)}
                {...props}
            />
        );
    }
);
Flex.displayName = "Flex";

//#endregion



//#region FlexItem component
const flexItemVariants = cva(
    "",
    {
        variants: {
            flexMobile: {
                initial: "flex-initial",
                none: "flex-none",
                auto: "flex-auto",
                1: "flex-1"
            },
            flexTab: {
                initial: "md:flex-initial",
                none: "md:flex-none",
                auto: "md:flex-auto",
                1: "md:flex-1"
            },
            flex: {
                initial: "lg:flex-initial",
                none: "lg:flex-none",
                auto: "lg:flex-auto",
                1: "lg:flex-1"
            },

            basisMobile: {
                auto: "basis-auto",
                px: "basis-px",
                full: "basis-full",
                1: "basis-1",
                2: "basis-2",
                3: "basis-3",
                4: "basis-4",
                5: "basis-5",
                6: "basis-6",
                7: "basis-7",
                8: "basis-8",
                9: "basis-9",
                10: "basis-10",
                11: "basis-11",
                12: "basis-12",
                13: "basis-13",
                14: "basis-14",
                16: "basis-16",
                20: "basis-20",
                24: "basis-24",
                28: "basis-28",
                32: "basis-32",
                36: "basis-36",
                40: "basis-40",
                44: "basis-44",
                48: "basis-48",
                52: "basis-52",
                56: "basis-56",
                60: "basis-60",
                64: "basis-64",
                72: "basis-72",
                80: "basis-80",
                96: "basis-96",
                0.5: "basis-0.5",
                1.5: "basis-1.5",
                2.5: "basis-2.5",
                3.5: "basis-3.5",
                "1/2": "basis-1/2",
                "1/3": "basis-1/3",
                "2/3": "basis-2/3",
                "1/4": "basis-1/4",
                "2/4": "basis-2/4",
                "3/4": "basis-3/4",
                "1/5": "basis-1/5",
                "2/5": "basis-2/5",
                "3/5": "basis-3/5",
                "4/5": "basis-4/5",
                "1/6": "basis-1/6",
                "2/6": "basis-2/6",
                "3/6": "basis-3/6",
                "4/6": "basis-4/6",
                "5/6": "basis-5/6",
                "1/12": "basis-1/12",
                "2/12": "basis-2/12",
                "3/12": "basis-3/12",
                "4/12": "basis-4/12",
                "5/12": "basis-5/12",
                "6/12": "basis-6/12",
                "7/12": "basis-7/12",
                "8/12": "basis-8/12",
                "9/12": "basis-9/12",
                "10/12": "basis-10/12",
                "11/12": "basis-11/12"
            },

            basisTab: {
                auto: "md:basis-auto",
                px: "md:basis-px",
                full: "md:basis-full",
                1: "md:basis-1",
                2: "md:basis-2",
                3: "md:basis-3",
                4: "md:basis-4",
                5: "md:basis-5",
                6: "md:basis-6",
                7: "md:basis-7",
                8: "md:basis-8",
                9: "md:basis-9",
                10: "md:basis-10",
                11: "md:basis-11",
                12: "md:basis-12",
                13: "md:basis-13",
                14: "md:basis-14",
                16: "md:basis-16",
                20: "md:basis-20",
                24: "md:basis-24",
                28: "md:basis-28",
                32: "md:basis-32",
                36: "md:basis-36",
                40: "md:basis-40",
                44: "md:basis-44",
                48: "md:basis-48",
                52: "md:basis-52",
                56: "md:basis-56",
                60: "md:basis-60",
                64: "md:basis-64",
                72: "md:basis-72",
                80: "md:basis-80",
                96: "md:basis-96",
                0.5: "md:basis-0.5",
                1.5: "md:basis-1.5",
                2.5: "md:basis-2.5",
                3.5: "md:basis-3.5",
                "1/2": "md:basis-1/2",
                "1/3": "md:basis-1/3",
                "2/3": "md:basis-2/3",
                "1/4": "md:basis-1/4",
                "2/4": "md:basis-2/4",
                "3/4": "md:basis-3/4",
                "1/5": "md:basis-1/5",
                "2/5": "md:basis-2/5",
                "3/5": "md:basis-3/5",
                "4/5": "md:basis-4/5",
                "1/6": "md:basis-1/6",
                "2/6": "md:basis-2/6",
                "3/6": "md:basis-3/6",
                "4/6": "md:basis-4/6",
                "5/6": "md:basis-5/6",
                "1/12": "md:basis-1/12",
                "2/12": "md:basis-2/12",
                "3/12": "md:basis-3/12",
                "4/12": "md:basis-4/12",
                "5/12": "md:basis-5/12",
                "6/12": "md:basis-6/12",
                "7/12": "md:basis-7/12",
                "8/12": "md:basis-8/12",
                "9/12": "md:basis-9/12",
                "10/12": "md:basis-10/12",
                "11/12": "md:basis-11/12"
            },

            basis: {
                auto: "lg:basis-auto",
                px: "lg:basis-px",
                full: "lg:basis-full",
                1: "lg:basis-1",
                2: "lg:basis-2",
                3: "lg:basis-3",
                4: "lg:basis-4",
                5: "lg:basis-5",
                6: "lg:basis-6",
                7: "lg:basis-7",
                8: "lg:basis-8",
                9: "lg:basis-9",
                10: "lg:basis-10",
                11: "lg:basis-11",
                12: "lg:basis-12",
                13: "lg:basis-13",
                14: "lg:basis-14",
                16: "lg:basis-16",
                20: "lg:basis-20",
                24: "lg:basis-24",
                28: "lg:basis-28",
                32: "lg:basis-32",
                36: "lg:basis-36",
                40: "lg:basis-40",
                44: "lg:basis-44",
                48: "lg:basis-48",
                52: "lg:basis-52",
                56: "lg:basis-56",
                60: "lg:basis-60",
                64: "lg:basis-64",
                72: "lg:basis-72",
                80: "lg:basis-80",
                96: "lg:basis-96",
                0.5: "lg:basis-0.5",
                1.5: "lg:basis-1.5",
                2.5: "lg:basis-2.5",
                3.5: "lg:basis-3.5",
                "1/2": "lg:basis-1/2",
                "1/3": "lg:basis-1/3",
                "2/3": "lg:basis-2/3",
                "1/4": "lg:basis-1/4",
                "2/4": "lg:basis-2/4",
                "3/4": "lg:basis-3/4",
                "1/5": "lg:basis-1/5",
                "2/5": "lg:basis-2/5",
                "3/5": "lg:basis-3/5",
                "4/5": "lg:basis-4/5",
                "1/6": "lg:basis-1/6",
                "2/6": "lg:basis-2/6",
                "3/6": "lg:basis-3/6",
                "4/6": "lg:basis-4/6",
                "5/6": "lg:basis-5/6",
                "1/12": "lg:basis-1/12",
                "2/12": "lg:basis-2/12",
                "3/12": "lg:basis-3/12",
                "4/12": "lg:basis-4/12",
                "5/12": "lg:basis-5/12",
                "6/12": "lg:basis-6/12",
                "7/12": "lg:basis-7/12",
                "8/12": "lg:basis-8/12",
                "9/12": "lg:basis-9/12",
                "10/12": "lg:basis-10/12",
                "11/12": "lg:basis-11/12"
            },

            growMobile: {
                0: "grow-0",
                1: "grow"
            },
            growTab: {
                0: "md:grow-0",
                1: "md:grow"
            },
            grow: {
                0: "lg:grow-0",
                1: "lg:grow"
            },

            shrinkMobile: {
                0: "shrink-0",
                1: "shrink"
            },
            shrinkTab: {
                0: "md:shrink-0",
                1: "md:shrink"
            },
            shrink: {
                0: "lg:shrink-0",
                1: "lg:shrink"
            },

            orderMobile: {
                none: "order-none",
                first: "order-first",
                last: "order-last",
                1: "order-1",
                2: "order-2",
                3: "order-3",
                4: "order-4",
                5: "order-5",
                6: "order-6",
                7: "order-7",
                8: "order-8",
                9: "order-9",
                10: "order-10",
                11: "order-11",
                12: "order-12"
            },
            orderTab: {
                none: "md:order-none",
                first: "md:order-first",
                last: "md:order-last",
                1: "md:order-1",
                2: "md:order-2",
                3: "md:order-3",
                4: "md:order-4",
                5: "md:order-5",
                6: "md:order-6",
                7: "md:order-7",
                8: "md:order-8",
                9: "md:order-9",
                10: "md:order-10",
                11: "md:order-11",
                12: "md:order-12"
            },
            order: {
                none: "md:order-none",
                first: "md:order-first",
                last: "md:order-last",
                1: "md:order-1",
                2: "md:order-2",
                3: "md:order-3",
                4: "md:order-4",
                5: "md:order-5",
                6: "md:order-6",
                7: "md:order-7",
                8: "md:order-8",
                9: "md:order-9",
                10: "md:order-10",
                11: "md:order-11",
                12: "md:order-12"
            },

            alignSelf: {
                auto: "self-auto",
                start: "self-start",
                end: "self-end",
                center: "self-center",
                stretch: "self-stretch",
                baseline: "self-baseline"
            },

            rounded: {
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                none: "rounded-none",
                full: "rounded-full",
            }
        }
    }
)

export interface FlexItemProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof flexItemVariants> {
    asChild?: boolean;
}

const FlexItem = React.forwardRef<HTMLDivElement, FlexItemProps>(({
    flexMobile, flexTab, flex,
    basisMobile, basisTab, basis,
    growMobile, growTab, grow,
    shrinkMobile, shrinkTab, shrink,
    orderMobile, orderTab, order,
    alignSelf, rounded, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(flexItemVariants(
                {
                    flexMobile, flexTab, flex,
                    basisMobile, basisTab, basis,
                    growMobile, growTab, grow,
                    shrinkMobile, shrinkTab, shrink,
                    orderMobile, orderTab, order,
                    alignSelf, rounded,
                }), className)}
            {...props}
        />
    );
});

FlexItem.displayName = "FlexItem"
//#endregion


export { Flex, flexVariants, FlexItem, flexItemVariants }
