import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-y border border-ink/30 bg-paper-3/80 px-4 py-3 text-sm text-ink placeholder:text-ink/70 transition-all focus:border-elec focus:shadow-[0_0_0_3px_rgba(11,10,8,0.18)] focus:outline-none aria-invalid:border-red-600",
        className
      )}
      {...props}
    />
  );
}
