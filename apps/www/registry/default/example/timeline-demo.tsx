import React from 'react';
import {
  Timeline,
  TimelineItem,
} from '@/registry/default/ui/timeline';

export default function TimelineDemo() {
  return (
    <Timeline>
      <TimelineItem className="text-black text-medium font-medium">
        Think
      </TimelineItem>
      <TimelineItem className="text-black text-medium font-medium">
        Design
      </TimelineItem>
      <TimelineItem className="text-black text-medium font-medium">
        Code
      </TimelineItem>
      <TimelineItem className="text-black text-medium font-medium">
        Deploy
      </TimelineItem>
    </Timeline>
  );
}
