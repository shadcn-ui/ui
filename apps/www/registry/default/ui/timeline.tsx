import React, { ReactNode } from 'react';
import { cn } from "@/lib/utils";

type TimelineContentProps = {
  children: ReactNode;
};

const TimelineContent: React.FC<TimelineContentProps> = ({ children }) => (
  <div className={cn("ml-4")}>{children}</div>
);
TimelineContent.displayName = "TimelineContent";

const TimelineDot: React.FC = () => <div className={cn("h-3 w-3 bg-gray-700 rounded-full")}></div>;
TimelineDot.displayName = "TimelineDot";

type TimelineItemProps = {
  children: React.ReactNode;
  className?: string;
};

const TimelineItem: React.FC<TimelineItemProps> = ({ children, className }) => (
  <div className={cn("flex items-center", className)}>
    <TimelineDot />
    <TimelineContent>{children}</TimelineContent>
  </div>
);
TimelineItem.displayName = "TimelineItem";

type TimelineProps = {
  children: React.ReactNode;
};

const Timeline: React.FC<TimelineProps> = ({ children }) => {
  const timelineItems = React.Children.toArray(children);

  return (
    <div className={cn("flex flex-col items-start")}>
      {timelineItems.map((child, index) => (
        <React.Fragment key={index}>
          {index > 0 && <div className={cn("h-16 w-[3px] bg-gray-400 self-stretch ml-[4px]")}></div>}
          {child}
        </React.Fragment>
      ))}
    </div>
  );
};
Timeline.displayName = "Timeline";

export { Timeline, TimelineItem };
