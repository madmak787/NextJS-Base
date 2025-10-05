import React from "react";
import { FormLabel } from "./ui/form";
import { cn } from "@/lib/utils";

export const RequiredLabel = ({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) => (
  <FormLabel className="flex items-start gap-0 font-semibold text-base">
    <div className={cn(`flex flex-col items-start gap-0`, className)}>
      {children}
    </div>
    <span className="text-red-500">*</span>
  </FormLabel>
);
