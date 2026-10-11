import * as React from "react";
import { cn } from "@/lib/utils";

export function Textarea({ className, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full rounded-lg border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-gray-600 transition-all focus:border-elec focus:shadow-[0_0_0_3px_rgba(0,240,255,0.15)] focus:outline-none aria-invalid:border-red-400 resize-y",
        className
      )}
      {...props}
    />
  );
}
