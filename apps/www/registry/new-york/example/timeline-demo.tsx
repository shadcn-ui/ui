import React from 'react';
import {
  Timeline,
  TimelineItem,
} from '@/registry/new-york/ui/timeline';

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItem className="text-black text-sm font-medium">
        Think
      </TimelineItem>
      <TimelineItem className="text-black text-sm font-medium">
        Design
      </TimelineItem>
      <TimelineItem className="text-black text-sm font-medium">
        Code
      </TimelineItem>
      <TimelineItem className="text-black text-sm font-medium">
        Deploy
      </TimelineItem>
    </Timeline>
  );
}