import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineIcon,
  TimelineItem,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineHorizontal() {
  return (
    <Timeline orientation="horizontal" className="w-full">
      <TimelineItem orientation="horizontal">
        <TimelineConnector orientation="horizontal" />
        <TimelineIcon size="sm" />
        <TimelineContent className="ms-0 items-center text-center">
          <TimelineTitle>Step 1</TimelineTitle>
          <TimelineDescription>Create account</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem orientation="horizontal">
        <TimelineConnector orientation="horizontal" />
        <TimelineIcon size="sm" />
        <TimelineContent className="ms-0 items-center text-center">
          <TimelineTitle>Step 2</TimelineTitle>
          <TimelineDescription>Verify email</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem orientation="horizontal">
        <TimelineConnector orientation="horizontal" />
        <TimelineIcon size="sm" />
        <TimelineContent className="ms-0 items-center text-center">
          <TimelineTitle>Step 3</TimelineTitle>
          <TimelineDescription>Complete profile</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem orientation="horizontal">
        <TimelineIcon size="sm" />
        <TimelineContent className="ms-0 items-center text-center">
          <TimelineTitle>Step 4</TimelineTitle>
          <TimelineDescription>Get started</TimelineDescription>
        </TimelineContent>
      </TimelineItem>
    </Timeline>
  )
}
