"use client";

import { Session } from "next-auth";
import { GithubIcon } from "lucide-react";
import { signIn } from "next-auth/react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { useToast } from "~/components/ui/use-toast";

const className =
  "flex gap-3 items-center h-18 w-full bg-secondary p-6 rounded-xl border-background/50 border-2 font-bold transition-colors hover:bg-background" as const;

export default function GithubConnect({
  session,
}: {
  session: Session;
}) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const onClick = async () => {
    try {
      setLoading(true);
      await signIn("github", {
        callbackUrl: "/profile/settings",
        redirect: true,
      });
    } catch (_err) {
      toast({
        title: "Ошибка",
        description: "Не удалось подключиться к GitHub",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full rounded-2xl bg-secondary">
      <div className="w-full border-b-2 px-6 py-4 text-lg font-bold text-muted-foreground">
        GitHub
      </div>
      <div className="w-full p-6">
        {session?.user?.githubUsername ? (
          <a
            href={`https://github.com/${session.user.githubUsername}`}
            className={className}
          >
            <GithubIcon className="size-10" />
            Вошли как {session.user.githubUsername}
          </a>
        ) : (
          <Button
            disabled={loading}
            onClick={onClick}
            className={className}
            variant="outline"
          >
            <GithubIcon className="size-10" />
            Войти через GitHub
          </Button>
        )}
      </div>
    </div>
  );
}
