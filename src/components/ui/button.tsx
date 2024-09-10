import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import { ChevronDown, Loader } from "lucide-react";
import * as React from "react";

import { cn } from "~/lib/utils";

const buttonVariants = cva(
  "select-none inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-secondary hover:bg-background hover:text-accent-foreground",
        secondary: "bg-muted text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-muted",
        table_selector: "hover:bg-muted hover:px-4 px-0",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        table_selector: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
        link: "p-0",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  chevron?: boolean;
  loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      chevron,
      loading,
      disabled,
      variant,
      size,
      asChild = false,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(
          buttonVariants({ size, className, variant }),
          chevron && "justify-between gap-2",
        )}
        ref={ref}
        {...props}
        disabled={disabled || loading}
      >
        {loading && <Loader />}
        {props.children}
        {chevron && !loading && <ChevronDown className="mr-2 size-4" />}
      </Comp>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
