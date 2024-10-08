"use client";

import { TooltipProvider } from "@/components/ui/tooltip";
import React, { PropsWithChildren } from "react";
import { RecoilRoot } from "recoil";

export default function Provider({ children }: PropsWithChildren) {
  return (
    <RecoilRoot>
      <TooltipProvider>{children}</TooltipProvider>
    </RecoilRoot>
  );
}
