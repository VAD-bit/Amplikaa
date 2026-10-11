import * as React from "react";
import { cn } from "@/lib/utils";

export function Select({ className, children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      className={cn(
        "w-full appearance-none rounded-lg border border-white/10 bg-white/5 bg-[right_1rem_center] bg-no-repeat px-4 py-3 pr-10 text-sm text-white transition-all focus:border-elec focus:shadow-[0_0_0_3px_rgba(0,240,255,0.15)] focus:outline-none aria-invalid:border-red-400",
        className
      )}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' fill='none'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%239ca3af' stroke-width='1.5'/%3E%3C/svg%3E\")",
      }}
      {...props}
    >
      {children}
    </select>
  );
}
