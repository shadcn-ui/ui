import React, { useState } from "react";
import { Star } from "lucide-react";
import clsx from "clsx";

type RatingProps = {
  value: number;
  onChange: (value: number) => void;
  precision?: number;
  size?: "sm" | "md" | "lg";
  hoverFeedback?: boolean;
  feedbackLabels?: string[];
  max?: number;
};

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  precision = 1,
  size = "md",
  hoverFeedback = false,
  feedbackLabels = ["Terrible", "Bad", "Okay", "Good", "Great"],
  max = 5,
}) => {
  const [hoverValue, setHoverValue] = useState<number | null>(null);

  const getSizeClass = () => {
    switch (size) {
      case "sm":
        return "w-4 h-4";
      case "lg":
        return "w-8 h-8";
      default:
        return "w-6 h-6";
    }
  };

  const displayValue = hoverValue ?? value;

  const getLabel = () => {
    if (!hoverFeedback || !feedbackLabels.length) return null;
    const index = Math.round(displayValue - 1);
    return feedbackLabels[index] || "";
  };

  const handleClick = (index: number, event: React.MouseEvent) => {
    const rect = (event.target as HTMLElement).getBoundingClientRect();
    const x = event.clientX - rect.left;
    const percent = x / rect.width;
    const decimal = precision < 1 ? Math.ceil(percent / precision) * precision : 1;
    onChange(Math.min(index + decimal, max));
  };

  return (
    <div className="inline-flex flex-col items-start">
      <div className="flex space-x-1">
        {Array.from({ length: max }).map((_, i) => {
          const currentValue = i + 1;
          const isFilled = displayValue >= currentValue;
          const isHalf = !isFilled && displayValue >= currentValue - 0.5;

          return (
            <div
              key={i}
              onMouseMove={(e) => {
                const rect = (e.target as HTMLElement).getBoundingClientRect();
                const x = e.clientX - rect.left;
                const percent = x / rect.width;
                const hoverVal =
                  precision < 1
                    ? Math.round((i + percent) / precision) * precision
                    : currentValue;
                setHoverValue(hoverVal);
              }}
              onMouseLeave={() => setHoverValue(null)}
              onClick={(e) => handleClick(i, e)}
              className="cursor-pointer"
            >
              <Star
                className={clsx(
                  getSizeClass(),
                  isFilled || isHalf
                    ? "fill-yellow-400 stroke-yellow-400"
                    : "stroke-gray-300"
                )}
              />
            </div>
          );
        })}
      </div>
      {hoverFeedback && (
        <span className="mt-1 text-sm text-gray-500 font-medium">{getLabel()}</span>
      )}
    </div>
  );
};
