import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/registry/new-york/ui/avatar";

const avatarStackVariants = cva(
  "flex",
  {
    variants: {
      orientation: {
        vertical: "flex-row",
        horizontal: "flex-col",
      },
      spacing: {
            sm: "-space-x-5 -space-y-5",
            md:"-space-x-4 -space-y-4",
            lg: "-space-x-3 -space-y-3",
            xl: "-space-x-2 -space-y-2",
      },
    },
    defaultVariants: {
      orientation: "vertical",
      spacing: "md"
    },
  }
);

export interface AvatarStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof avatarStackVariants> {
  avatars: string[];
  avatarsOffset?: number;
  maxAvatarsAmount?: number;
}

function AvatarStack({ className, orientation, avatars, spacing,avatarsOffset = 2, maxAvatarsAmount = 4, ...props }: AvatarStackProps) {
  const limitedAvatars = avatars.slice(0, maxAvatarsAmount);


  return (
    <div
      className={cn(
        avatarStackVariants({ orientation, spacing }),
        className,
        orientation === "horizontal" ? "-space-x-0" : "-space-y-0"
      )}
      {...props}
    >
      {limitedAvatars.map((avatarUrl, index) => (
        <Avatar key={index} className={avatarStackVariants()}>
          <AvatarImage src={avatarUrl} />
          <AvatarFallback>?</AvatarFallback>
        </Avatar>
      ))}

      {limitedAvatars.length < avatars.length ? <Avatar key={"Excesive avatars"}>
          <AvatarFallback>+{avatars.length - limitedAvatars.length }</AvatarFallback>
        </Avatar>:null}
    </div>
  );
}

export { AvatarStack, avatarStackVariants };
