'use client'

import { useEffect, useRef, useState } from "react";

import { ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface ScrollButtonsProps {
    listRef: React.RefObject<HTMLDivElement>;
    className?: string;
}

export function ScrollButtons({ listRef, className }: ScrollButtonsProps) {
    const [isAtTop, setIsAtTop] = useState<boolean>(true);
    const [isAtBottom, setIsAtBottom] = useState<boolean>(false);
    const scrollDownIntervalRef = useRef<NodeJS.Timeout>();
    const scrollUpIntervalRef = useRef<NodeJS.Timeout>();

    const checkScrollPosition = () => {
        if (listRef.current) {
            const { scrollTop, scrollHeight, clientHeight } = listRef.current;
            if (Math.abs(scrollHeight - clientHeight - scrollTop) < 1) {
                setIsAtBottom(true);
                stopScroll();
            }
            else {
                setIsAtBottom(false);
            }
            if (scrollTop === 0) {
                setIsAtTop(true);
                stopScroll();
            }
            else {
                setIsAtTop(false);
            }
        }
    };

    useEffect(() => {
        const listElement = listRef.current;
        if (listElement?.clientHeight! > 200) {
            setIsAtBottom(false);
        }
        if (listElement) {
            listElement.addEventListener('scroll', checkScrollPosition);
        }
        return () => {
            if (listElement) {
                listElement.removeEventListener('scroll', checkScrollPosition);
            }
        };
    }, []);

    const handleScrollDown = () => {
        if (listRef.current) {
            scrollDownIntervalRef.current = setInterval(() => {
                if (listRef.current) {
                    listRef.current.scrollTop += 20;
                }
            }, 150);
        }
    };

    const handleScrollUp = () => {
        if (listRef.current) {
            scrollUpIntervalRef.current = setInterval(() => {
                if (listRef.current) {
                    listRef.current.scrollTop -= 20;
                }
            }, 150);
        }
    };

    const stopScroll = () => {
        if (scrollDownIntervalRef.current) {
            clearInterval(scrollDownIntervalRef.current);
        }
        if (scrollUpIntervalRef.current) {
            clearInterval(scrollUpIntervalRef.current);
        }
    };

    return (
        <>
            {!isAtTop && (
                <Button
                    variant={'ghost'}
                    className={cn("absolute top-0 left-0 w-full h-7 bg-white border border-b-0 rounded-none rounded-t-lg hover:bg-white pt-2", className)}
                    onMouseEnter={handleScrollUp}
                    onMouseLeave={stopScroll}
                >
                    <ChevronUp />
                </Button>
            )}
            {!isAtBottom && (
                <Button
                    variant={'ghost'}
                    className={cn("absolute bottom-0 left-0 w-full bg-white h-7 border border-t-0 rounded-none rounded-b-lg hover:bg-white pb-2", className)}
                    onMouseEnter={handleScrollDown}
                    onMouseLeave={stopScroll}
                >
                    <ChevronDown />
                </Button>
            )}
        </>
    );
}