import React from "react";

const aligns = {
  start: "start",
  center: "center",
  end: "end",
} as const;

export interface ContentOptions {
  align: keyof typeof aligns;
  contentWidth: number[];
}

const alignFns: Record<
  keyof typeof aligns,
  (computedWidth: number, contentWidth: number, buttonWidth: number) => number
> = {
  start: (computedWidth, contentWidth, _) => {
    return computedWidth - contentWidth * 0;
  },
  center: (computedWidth, contentWidth, buttonWidth) => {
    return computedWidth - contentWidth / 2 + buttonWidth / 2;
  },
  end: (computedWidth, contentWidth, buttonWidth) => {
    return computedWidth - contentWidth + buttonWidth;
  },
};

const useContentPosition = (options?: ContentOptions) => {
  const ref = React.useRef<HTMLLIElement | null>(null);
  const [position, setPosition] = React.useState<{
    x: number;
  }>({ x: 0 });

  React.useLayoutEffect(() => {
    const container = ref.current;
    if (!container || !options) return;

    const handleMouseEnter = (ev: MouseEvent) => {
      const { clientX, clientY } = ev;
      const element = document.elementFromPoint(clientX, clientY);
      if (!(element instanceof HTMLButtonElement)) {
        return;
      }
      container.childNodes.forEach((_, idx) => {
        const _elem = container.childNodes[idx].firstChild
        if (_elem === element) {
          const containerCoords = container.getBoundingClientRect();
          const elemCoords = element.getBoundingClientRect();
          const computedWidth = elemCoords.left - containerCoords.left;
          const X = alignFns[options.align](
            computedWidth,
            options.contentWidth[idx],
            elemCoords.width
          );
          setPosition({
            x: X,
          });
        }
      });
    };

    container.addEventListener("mousemove", handleMouseEnter);
    return () => {
      if (container) {
        container.removeEventListener("mousemove", handleMouseEnter);
      }
    };
  }, []);

  return [position, ref] as const;
};

export default useContentPosition;
