"use client";

import { LiquidText } from "@/registry/new-york-v4/ui/liquid-text";

export default function LiquidTextDemo() {
  return (
    <div className="flex h-[400px] w-full items-center justify-center p-4">
      <LiquidText text="shadcn/ui" fontSize={300} />
    </div>
  );
}
