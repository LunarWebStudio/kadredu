import { File, Folder } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import LikeProject from "~/app/(website)/project/[id]/like";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import LanguageToColor from "~/lib/shared/languages";
import type { OnePortfolioProject } from "~/lib/shared/types";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { api } from "~/trpc/server";
export default async function Project({
  params,
}: {
  params: {
    id?: string;
  };
}) {
  let project: OnePortfolioProject | null = null;

  try {
    project = await api.portfolio.getOne({
      id: params.id ?? "",
    });
  } catch (_error) {
    notFound();
  }

  const session = await getServerAuthSession();

  return (
    <div className="container space-y-6 py-20">
      <div className="flex items-center justify-between rounded-xl bg-secondary p-6">
        <h3>
          {project.emoji} {project.name}
        </h3>
        <div className="flex gap-4">
          <Link
            href={project.url}
            className="flex items-center gap-1 transition-all duration-300 ease-in-out hover:text-primary hover:underline"
          >
            <Folder className="size-4" />
            Github
          </Link>
          <LikeProject
            projectId={project.id}
            isLiked={project.likes.some((l) => l.userId === session?.user.id)}
          />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div className="col-span-2 rounded-xl bg-secondary">
          <p className="w-full border-b p-6 text-lg font-bold text-muted-foreground">
            Файлы
          </p>
          <div className="p-6">
            {project.tree.map((file) => (
              // TODO: Сделать ссылки на файлы
              <Link
                href={file.url ?? "#"}
                key={file.path}
              >
                <Button
                  variant="ghost"
                  className="flex items-center gap-2"
                >
                  {file.type === "tree" ? (
                    <Folder className="size-5" />
                  ) : (
                    <File className="size-5" />
                  )}
                  {file.path}
                </Button>
              </Link>
            ))}
          </div>
        </div>
        <div className="col-span-1 rounded-xl bg-secondary">
          <p className="w-full border-b p-6 text-lg font-bold text-muted-foreground">
            Информация
          </p>
          <div className="space-y-4 p-6">
            <div className="flex h-1 w-full flex-row">
              <TooltipProvider>
                {project.languages.map((l) => (
                  <Tooltip key={l.name}>
                    <TooltipTrigger asChild>
                      <div
                        className={cn(
                          "h-1 w-fit",
                          LanguageToColor(l.name).background,
                        )}
                        style={{
                          width: `${l.percent}%`,
                        }}
                      ></div>
                    </TooltipTrigger>
                    <TooltipContent>{l.name}</TooltipContent>
                  </Tooltip>
                ))}
              </TooltipProvider>
            </div>
            <div className="space-y-2">
              {project.languages.map((l, index) => (
                <div
                  className={cn(
                    LanguageToColor(l.name).text,
                    "flex justify-between",
                  )}
                  key={index + l.name}
                >
                  <p>{l.name}</p>
                  <p>{Math.round(l.percent * 100) / 100}%</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      {project.readme !== "" && (
        // TODO: сделать вывод Readme в markdown
        <div className="rounded-xl bg-secondary">
          <div className="w-full border-b p-6 text-lg font-bold text-muted-foreground">
            О проекте
          </div>
          <p className="prose whitespace-pre-wrap p-6">{project.readme}</p>
        </div>
      )}
    </div>
  );
}
