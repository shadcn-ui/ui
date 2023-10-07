import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils"

//#region Grid component
const gridVariants = cva(
    "grid",
    {
        variants: {
            colsMobile: {
                none: "grid-cols-none",
                1: "grid-cols-1",
                2: "grid-cols-2",
                3: "grid-cols-3",
                4: "grid-cols-4",
                5: "grid-cols-5",
                6: "grid-cols-6",
                7: "grid-cols-7",
                8: "grid-cols-8",
                9: "grid-cols-9",
                10: "grid-cols-10",
                11: "grid-cols-11",
                12: "grid-cols-12"
            },
            colsTab: {
                none: "md:grid-cols-none",
                1: "md:grid-cols-1",
                2: "md:grid-cols-2",
                3: "md:grid-cols-3",
                4: "md:grid-cols-4",
                5: "md:grid-cols-5",
                6: "md:grid-cols-6",
                7: "md:grid-cols-7",
                8: "md:grid-cols-8",
                9: "md:grid-cols-9",
                10: "md:grid-cols-10",
                11: "md:grid-cols-11",
                12: "md:grid-cols-12"
            },
            cols: {
                none: "lg:grid-cols-none",
                1: "lg:grid-cols-1",
                2: "lg:grid-cols-2",
                3: "lg:grid-cols-3",
                4: "lg:grid-cols-4",
                5: "lg:grid-cols-5",
                6: "lg:grid-cols-6",
                7: "lg:grid-cols-7",
                8: "lg:grid-cols-8",
                9: "lg:grid-cols-9",
                10: "lg:grid-cols-10",
                11: "lg:grid-cols-11",
                12: "lg:grid-cols-12"
            },
            rowsMobile: {
                none: "grid-rows-none",
                1: "grid-rows-1 grid-flow-col",
                2: "grid-rows-2 grid-flow-col",
                3: "grid-rows-3 grid-flow-col",
                4: "grid-rows-4 grid-flow-col",
                5: "grid-rows-5 grid-flow-col",
                6: "grid-rows-6 grid-flow-col"
            },
            rowsTab: {
                none: "md:grid-rows-none",
                1: "md:grid-rows-1 grid-flow-col",
                2: "md:grid-rows-2 grid-flow-col",
                3: "md:grid-rows-3 grid-flow-col",
                4: "md:grid-rows-4 grid-flow-col",
                5: "md:grid-rows-5 grid-flow-col",
                6: "md:grid-rows-6 grid-flow-col"
            },
            rows: {
                none: "lg:grid-rows-none",
                1: "lg:grid-rows-1 grid-flow-col",
                2: "lg:grid-rows-2 grid-flow-col",
                3: "lg:grid-rows-3 grid-flow-col",
                4: "lg:grid-rows-4 grid-flow-col",
                5: "lg:grid-rows-5 grid-flow-col",
                6: "lg:grid-rows-6 grid-flow-col"
            },
            gapMobile: {
                px: "gap-px",
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
                px: "md:gap-px",
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
                px: "lg:gap-px",
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
            justifyItems: {
                "start": "justify-items-start",
                "end": "justify-items-end",
                "center": "justify-items-center",
                "stretch": "justify-items-stretch"
            },
            alignContent: {
                "normal": "content-normal",
                "center": "content-center",
                "start": "content-start",
                "end": "content-end",
                "between": "content-between",
                "around": "content-around",
                "evenly": "content-evenly",
                "baseline": "content-baseline",
                "stretch": "content-stretch"
            },
            placeContent: {
                "center": "place-content-center",
                "start": "place-content-start",
                "end": "place-content-end",
                "between": "place-content-between",
                "around": "place-content-around",
                "evenly": "place-content-evenly",
                "baseline": "place-content-baseline",
                "stretch": "place-content-stretch"
            },
            rounded: {
                sm: "rounded-sm",
                md: "rounded-md",
                lg: "rounded-lg",
                xl: "rounded-xl",
                none: "rounded-none",
                full: "rounded-full",
            }
        },
        defaultVariants: {
            gap: 4,
            gapMobile: 2,
            gapTab: 2,
            rounded: "md"
        },
    }
);

export interface GridProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridVariants> {
    asChild?: boolean;
}

const Grid = React.forwardRef<HTMLDivElement, GridProps>(
    ({ colsMobile, colsTab, cols, rowsMobile, rowsTab, rows, gapMobile, gapTab, gap, justifyItems, alignContent, placeContent, rounded, asChild, className, ...props }, ref) => {
        return (
            <div
                ref={ref}
                className={cn(gridVariants({ colsMobile, colsTab, cols, rowsMobile, rowsTab, rows, gapMobile, gapTab, gap, justifyItems, alignContent, placeContent, rounded }), className)}
                {...props}
            />
        );
    }
);
Grid.displayName = "Grid";
//#endregion


//#region GridItem component
const gridItemVariants = cva(
    "",
    {
        variants: {
            colSpanMobile: {
                auto: "col-auto",
                full: "col-span-full",
                1: "col-span-1",
                2: "col-span-2",
                3: "col-span-3",
                4: "col-span-4",
                5: "col-span-5",
                6: "col-span-6",
                7: "col-span-7",
                8: "col-span-8",
                9: "col-span-9",
                10: "col-span-10",
                11: "col-span-11",
                12: "col-span-12"
            },
            colSpanTab: {
                auto: "md:col-auto",
                full: "md:col-span-full",
                1: "md:col-span-1",
                2: "md:col-span-2",
                3: "md:col-span-3",
                4: "md:col-span-4",
                5: "md:col-span-5",
                6: "md:col-span-6",
                7: "md:col-span-7",
                8: "md:col-span-8",
                9: "md:col-span-9",
                10: "md:col-span-10",
                11: "md:col-span-11",
                12: "md:col-span-12"
            },
            colSpan: {
                auto: "lg:col-auto",
                full: "lg:col-span-full",
                1: "lg:col-span-1",
                2: "lg:col-span-2",
                3: "lg:col-span-3",
                4: "lg:col-span-4",
                5: "lg:col-span-5",
                6: "lg:col-span-6",
                7: "lg:col-span-7",
                8: "lg:col-span-8",
                9: "lg:col-span-9",
                10: "lg:col-span-10",
                11: "lg:col-span-11",
                12: "lg:col-span-12"
            },

            colStartMobile: {
                auto: "col-start-auto",
                1: "col-start-1",
                2: "col-start-2",
                3: "col-start-3",
                4: "col-start-4",
                5: "col-start-5",
                6: "col-start-6",
                7: "col-start-7",
                8: "col-start-8",
                9: "col-start-9",
                10: "col-start-10",
                11: "col-start-11",
                12: "col-start-12",
                13: "col-start-13"
            },
            colStartTab: {
                auto: "md:col-start-auto",
                1: "md:col-start-1",
                2: "md:col-start-2",
                3: "md:col-start-3",
                4: "md:col-start-4",
                5: "md:col-start-5",
                6: "md:col-start-6",
                7: "md:col-start-7",
                8: "md:col-start-8",
                9: "md:col-start-9",
                10: "md:col-start-10",
                11: "md:col-start-11",
                12: "md:col-start-12",
                13: "md:col-start-13"
            },
            colStart: {
                auto: "lg:col-start-auto",
                1: "lg:col-start-1",
                2: "lg:col-start-2",
                3: "lg:col-start-3",
                4: "lg:col-start-4",
                5: "lg:col-start-5",
                6: "lg:col-start-6",
                7: "lg:col-start-7",
                8: "lg:col-start-8",
                9: "lg:col-start-9",
                10: "lg:col-start-10",
                11: "lg:col-start-11",
                12: "lg:col-start-12",
                13: "lg:col-start-13"
            },

            colEndMobile: {
                auto: "col-end-auto",
                1: "col-end-1",
                2: "col-end-2",
                3: "col-end-3",
                4: "col-end-4",
                5: "col-end-5",
                6: "col-end-6",
                7: "col-end-7",
                8: "col-end-8",
                9: "col-end-9",
                10: "col-end-10",
                11: "col-end-11",
                12: "col-end-12",
                13: "col-end-13"
            },
            colEndTab: {
                auto: "md:col-end-auto",
                1: "md:col-end-1",
                2: "md:col-end-2",
                3: "md:col-end-3",
                4: "md:col-end-4",
                5: "md:col-end-5",
                6: "md:col-end-6",
                7: "md:col-end-7",
                8: "md:col-end-8",
                9: "md:col-end-9",
                10: "md:col-end-10",
                11: "md:col-end-11",
                12: "md:col-end-12",
                13: "md:col-end-13"
            },
            colEnd: {
                auto: "lg:col-end-auto",
                1: "lg:col-end-1",
                2: "lg:col-end-2",
                3: "lg:col-end-3",
                4: "lg:col-end-4",
                5: "lg:col-end-5",
                6: "lg:col-end-6",
                7: "lg:col-end-7",
                8: "lg:col-end-8",
                9: "lg:col-end-9",
                10: "lg:col-end-10",
                11: "lg:col-end-11",
                12: "lg:col-end-12",
                13: "lg:col-end-13"
            },

            rowSpanMobile: {
                auto: "row-auto",
                full: "row-span-full",
                1: "row-span-1",
                2: "row-span-2",
                3: "row-span-3",
                4: "row-span-4",
                5: "row-span-5",
                6: "row-span-6"
            },
            rowSpanTab: {
                auto: "md:row-auto",
                full: "md:row-span-full",
                1: "md:row-span-1",
                2: "md:row-span-2",
                3: "md:row-span-3",
                4: "md:row-span-4",
                5: "md:row-span-5",
                6: "md:row-span-6"
            },
            rowSpan: {
                auto: "lg:row-auto",
                full: "lg:row-span-full",
                1: "lg:row-span-1",
                2: "lg:row-span-2",
                3: "lg:row-span-3",
                4: "lg:row-span-4",
                5: "lg:row-span-5",
                6: "lg:row-span-6"
            },

            rowStartMobile: {
                auto: "row-start-auto",
                1: "row-start-1",
                2: "row-start-2",
                3: "row-start-3",
                4: "row-start-4",
                5: "row-start-5",
                6: "row-start-6",
                7: "row-start-7"
            },
            rowStartTab: {
                auto: "md:row-start-auto",
                1: "md:row-start-1",
                2: "md:row-start-2",
                3: "md:row-start-3",
                4: "md:row-start-4",
                5: "md:row-start-5",
                6: "md:row-start-6",
                7: "md:row-start-7"
            },
            rowStart: {
                auto: "lg:row-start-auto",
                1: "lg:row-start-1",
                2: "lg:row-start-2",
                3: "lg:row-start-3",
                4: "lg:row-start-4",
                5: "lg:row-start-5",
                6: "lg:row-start-6",
                7: "lg:row-start-7"
            },

            rowEndMobile: {
                auto: "row-end-auto",
                1: "row-end-1",
                2: "row-end-2",
                3: "row-end-3",
                4: "row-end-4",
                5: "row-end-5",
                6: "row-end-6",
                7: "row-end-7"
            },
            rowEndTab: {
                auto: "md:row-end-auto",
                1: "md:row-end-1",
                2: "md:row-end-2",
                3: "md:row-end-3",
                4: "md:row-end-4",
                5: "md:row-end-5",
                6: "md:row-end-6",
                7: "md:row-end-7"
            },
            rowEnd: {
                auto: "lg:row-end-auto",
                1: "lg:row-end-1",
                2: "lg:row-end-2",
                3: "lg:row-end-3",
                4: "lg:row-end-4",
                5: "lg:row-end-5",
                6: "lg:row-end-6",
                7: "lg:row-end-7"
            },

            justifySelf: {
                "auto": "justify-self-auto",
                "start": "justify-self-start",
                "end": "justify-self-end",
                "center": "justify-self-center",
                "stretch": "justify-self-stretch"
            },
            placeSelf: {
                "auto": "place-self-auto",
                "start": "place-self-start",
                "end": "place-self-end",
                "center": "place-self-center",
                "stretch": "place-self-stretch"
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
);

export interface GridItemProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof gridItemVariants> {
    asChild?: boolean;
}

const GridItem = React.forwardRef<HTMLDivElement, GridItemProps>(({
    colSpanMobile, colSpanTab, colSpan,
    rowSpanMobile, rowSpanTab, rowSpan,
    colStartMobile, colStartTab, colStart,
    rowStartMobile, rowStartTab, rowStart,
    colEndMobile, colEndTab, colEnd,
    rowEndMobile, rowEndTab, rowEnd,
    justifySelf, placeSelf, rounded, className, ...props }, ref) => {
    return (
        <div
            ref={ref}
            className={cn(gridItemVariants(
                {
                    colSpanMobile, colSpanTab, colSpan,
                    rowSpanMobile, rowSpanTab, rowSpan,
                    colStartMobile, colStartTab, colStart,
                    rowStartMobile, rowStartTab, rowStart,
                    colEndMobile, colEndTab, colEnd,
                    rowEndMobile, rowEndTab, rowEnd,
                    justifySelf, placeSelf, rounded,
                }), className)}
            {...props}
        />
    );
});

GridItem.displayName = "GridItem"
//#endregion

export { Grid, gridVariants, GridItem, gridItemVariants }
