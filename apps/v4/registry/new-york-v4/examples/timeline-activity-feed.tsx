import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/registry/new-york-v4/ui/avatar"
import {
  Timeline,
  TimelineConnector,
  TimelineContent,
  TimelineDescription,
  TimelineHeader,
  TimelineIcon,
  TimelineItem,
  TimelineTime,
  TimelineTitle,
} from "@/registry/new-york-v4/ui/timeline"

export default function TimelineActivityFeed() {
  return (
    <Timeline>
      <TimelineItem>
        <TimelineConnector />
        <TimelineHeader>
          <TimelineIcon className="overflow-hidden p-0">
            <Avatar className="size-full">
              <AvatarImage src="/avatars/01.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </TimelineIcon>
          <div className="flex flex-col gap-0.5">
            <TimelineTitle>
              <span className="font-semibold">Sarah Chen</span>{" "}
              <span className="text-muted-foreground font-normal">
                commented on
              </span>{" "}
              <span className="font-semibold">Issue #42</span>
            </TimelineTitle>
            <TimelineTime>5 minutes ago</TimelineTime>
          </div>
        </TimelineHeader>
        <TimelineContent>
          <TimelineDescription className="bg-muted/50 rounded-md border p-3">
            I think we should consider using a different approach for the
            authentication flow. Let me know your thoughts.
          </TimelineDescription>
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineConnector />
        <TimelineHeader>
          <TimelineIcon className="overflow-hidden p-0">
            <Avatar className="size-full">
              <AvatarImage src="/avatars/02.png" alt="@user" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
          </TimelineIcon>
          <div className="flex flex-col gap-0.5">
            <TimelineTitle>
              <span className="font-semibold">John Doe</span>{" "}
              <span className="text-muted-foreground font-normal">
                merged pull request
              </span>{" "}
              <span className="font-semibold">#123</span>
            </TimelineTitle>
            <TimelineTime>2 hours ago</TimelineTime>
          </div>
        </TimelineHeader>
      </TimelineItem>
    </Timeline>
  )
}
