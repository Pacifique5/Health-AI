import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-900/90 dark:hover:bg-slate-100/90 focus-visible:ring-slate-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
        destructive:
          "bg-red-500 text-white hover:bg-red-500/90 focus-visible:ring-red-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
        outline:
          "border border-slate-200 dark:border-slate-700 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 focus-visible:ring-slate-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
        secondary:
          "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-100/80 dark:hover:bg-slate-800/80 focus-visible:ring-slate-400 focus-visible:ring-offset-white dark:focus-visible:ring-offset-slate-900",
        ghost: "hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100",
        link: "text-slate-900 dark:text-slate-100 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };

