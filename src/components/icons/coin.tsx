import { cn } from "~/lib/utils";
import { IconProps } from "./icon";

export default function Coin({ className, ...props }: IconProps) {
  return (
    <div
      {...props}
      className={cn(
        "size-6 aspect-square bg-yellow-500 rounded-full",
        className,
      )}
    ></div>
  );
}
