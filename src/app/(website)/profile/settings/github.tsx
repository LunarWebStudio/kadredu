"use client";

import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

export default function GithubConnect() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await signIn("github", {
        callbackUrl: "/profile/settings",
        redirect: true
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Ошибка",
        description: "Не удалось подключиться к GitHub",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-secondary">
      <div className="w-full border-b-2 px-6 py-4 text-lg font-bold text-muted-foreground">
        GitHub
      </div>
      <div className="w-full p-6">
        <Button
          disabled={loading}
          onClick={onClick}
          className="h-18 w-full gap-4 bg-secondary font-bold transition-colors duration-300 ease-in-out hover:bg-background"
          variant="outline"
        >
          <GithubIcon className="size-10" />
          Войти через GitHub
        </Button>
      </div>
    </div>
  );
}

