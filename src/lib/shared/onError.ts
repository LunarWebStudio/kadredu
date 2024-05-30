import type { FieldErrors } from "react-hook-form";
import type { useToast } from "~/components/ui/use-toast";

export function OnError(toast: ReturnType<typeof useToast>["toast"]) {
  return (errors: FieldErrors) => {
    for (const key in errors) {
      if (errors[key]) {
        toast({ title: errors[key]!.message as string, variant: "destructive" });
        break;
      }
    }
  }
}
