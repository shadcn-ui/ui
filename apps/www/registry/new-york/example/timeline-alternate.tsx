import React from "react"

import {
  Timeline,
  TimelineContent,
  TimelineDot,
  TimelineHeading,
  TimelineItem,
  TimelineLine,
} from "@/registry/new-york/ui/timeline"

export default function TimelineAlternate() {
  return (
    <Timeline positions="center">
      <TimelineItem status="done">
        <TimelineHeading side="left">Plan!</TimelineHeading>
        <TimelineDot status="done" />
        <TimelineLine done />
        <TimelineContent side="left">
          Before diving into coding, it is crucial to plan your software project
          thoroughly. This involves defining the project scope, setting clear
          objectives, and identifying the target audience. Additionally,
          creating a timeline and allocating resources appropriately will
          contribute to a successful development process.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineHeading side="right" className="text-destructive">
          Design
        </TimelineHeading>
        <TimelineDot status="error" />
        <TimelineLine done />
        <TimelineContent>
          Designing your software involves creating a blueprint that outlines
          the structure, user interface, and functionality of your application.
          Consider user experience (UX) principles, wireframing, and prototyping
          to ensure an intuitive and visually appealing design.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem status="done">
        <TimelineHeading side="left">Code</TimelineHeading>
        <TimelineDot status="current" />
        <TimelineLine />
        <TimelineContent side="left">
          The coding phase involves translating your design into actual code.
          Choose a programming language and framework that aligns with your
          project requirements. Follow best practices, such as modular and
          reusable code, to enhance maintainability and scalability. Regularly
          test your code to identify and fix any bugs or errors.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading>Test</TimelineHeading>
        <TimelineDot />
        <TimelineLine />
        <TimelineContent>
          Thorough testing is essential to ensure the quality and reliability of
          your software. Implement different testing methodologies, including
          unit testing, integration testing, and user acceptance testing. This
          helps identify and rectify any issues before deploying the software.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineHeading side="left">Deploy</TimelineHeading>
        <TimelineDot />
        <TimelineLine />
        <TimelineContent side="left">
          Once your software has passed rigorous testing, it's time to deploy
          it. Consider the deployment environment, whether it's on-premises or
          in the cloud. Ensure proper documentation and provide clear
          instructions for installation and configuration.
        </TimelineContent>
      </TimelineItem>
      <TimelineItem>
        <TimelineDot />
        <TimelineHeading>Done!</TimelineHeading>
      </TimelineItem>
    </Timeline>
  )
}
