import * as React from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, max, ...props }, ref) => {
    return (
      <>
        {type === "file" ? (
          <label
            className={cn(
              "flex w-full flex-col gap-2 lg:flex-row lg:items-center ",
              className,
              props.disabled
                ? "animate-pulse cursor-not-allowed"
                : "cursor-pointer"
            )}
          >
            <input
              type="file"
              className="hidden"
              {...props}
            />
            <Button
              disabled={props.disabled}
              type="button"
              className="pointer-events-none w-fit px-8"
            >
              Загрузить
            </Button>
            <p className="text-xs md:text-sm">
              В формате{" "}
              {props.accept
                ?.split(",")
                .map(ext => ext.split("/")[1]?.toUpperCase())
                .join(", ")}
              <br />
              Максимальный размер {max}MB
            </p>
          </label>
        ) : (
          <input
            type={type}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-secondary px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              className
            )}
            ref={ref}
            {...props}
          />
        )}
      </>
    );
  }
);
Input.displayName = "Input";

export { Input };
