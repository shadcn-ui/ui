# @shadcn/react

## 0.2.1

### Patch Changes

- [#11106](https://github.com/shadcn-ui/ui/pull/11106) [`f6a26478547c7057aeda82516666dc3473dc39bd`](https://github.com/shadcn-ui/ui/commit/f6a26478547c7057aeda82516666dc3473dc39bd) Thanks [@shadcn](https://github.com/shadcn)! - Fix MessageScroller autoScroll around anchored turns: the anchor hold now hands off to follow-output once the streamed reply fills the viewport, content growth outrunning the frame-coalesced resize handler no longer releases follow-output, and the scroll button no longer flickers while follow-output closes the gap a streamed chunk just opened.

- [#11100](https://github.com/shadcn-ui/ui/pull/11100) [`dd6ce77cf1606eee2839368a97cc35417f763232`](https://github.com/shadcn-ui/ui/commit/dd6ce77cf1606eee2839368a97cc35417f763232) Thanks [@shadcn](https://github.com/shadcn)! - Fix MessageScroller abandoning a newly appended scrollAnchor placement when autoScroll is enabled, so the anchored turn holds at the reading line while the reply streams.

- [#11085](https://github.com/shadcn-ui/ui/pull/11085) [`628e427231ca4bb7f586a69f99fe7809749a53e2`](https://github.com/shadcn-ui/ui/commit/628e427231ca4bb7f586a69f99fe7809749a53e2) Thanks [@devnomic](https://github.com/devnomic)! - Fix MessageScroller firing "ResizeObserver loop completed with undelivered notifications" during streamed content growth by coalescing ResizeObserver callbacks into requestAnimationFrame.

## 0.2.0

### Minor Changes

- [#11022](https://github.com/shadcn-ui/ui/pull/11022) [`18fcf0f766857a7249cc0daac3c1609610edd158`](https://github.com/shadcn-ui/ui/commit/18fcf0f766857a7249cc0daac3c1609610edd158) Thanks [@shadcn](https://github.com/shadcn)! - initial release of @shadcn/react
