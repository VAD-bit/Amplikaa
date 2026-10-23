import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-none text-sm font-semibold transition-all duration-200 cursor-pointer disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        elec: "bg-elec text-ink border border-ink/20 hover:bg-sky",
        viol: "bg-viol text-ink border border-ink/20 hover:bg-mint",
        ink: "bg-sky text-ink border border-ink/20 hover:bg-elec",
        white: "bg-paper-3 text-ink border border-ink/30 hover:bg-mark",
        outline: "border border-ink/40 text-ink hover:bg-sky",
        ghost: "text-ink hover:bg-mark",
      },
      size: {
        default: "px-7 py-4 text-base",
        sm: "px-4 py-2.5 text-sm",
        lg: "px-8 py-4 text-base",
        icon: "h-11 w-11",
      },
    },
    defaultVariants: { variant: "elec", size: "default" },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
