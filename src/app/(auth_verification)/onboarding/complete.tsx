"use client";

import { useRouter } from "next/navigation";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";
import { api } from "~/trpc/react";

export default function CompleteOnboarding() {
  const router = useRouter();
  const { toast } = useToast();

  const completeOnboardingMutation = api.user.completeOnboarding.useMutation({
    onSuccess() {
      router.push("/");
    },
    onError(err) {
      toast({
        title: "Ошибка",
        description: err.message,
        variant: "destructive"
      });
    }
  });

  return (
    <Button
      onClick={() => completeOnboardingMutation.mutate()}
      disabled={completeOnboardingMutation.isPending}
    >
      Завершить
    </Button>
  );
}
