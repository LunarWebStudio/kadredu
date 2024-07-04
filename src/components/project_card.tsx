import { Folder, Heart } from "lucide-react";
import Link from "next/link";
import LanguageToColor from "~/lib/shared/languages";
import { type PortfolioProject } from "~/lib/shared/types";
import { cn } from "~/lib/utils";

export default function ProjectCard({
  project
}: {
  project: PortfolioProject
}) {
  return (
    <Link
      href={`/project/${project.id}`}
      className="block space-y-4 rounded-xl bg-secondary p-6 transition-all duration-300 ease-in-out hover:shadow-xl "
    >
      <div className="space-y-2">
        <h3>
          {project.emoji} {project.name}
        </h3>
        <div className="flex items-center gap-2">
          <Folder className="size-6" />
          <p className="line-clamp-1">{project.description}</p>
        </div>
        <div className="flex items-center gap-4">
          {project.languages[0] && (
            <p
              className={cn(
                LanguageToColor(project.languages[0].name),
                "font-bold"
              )}
            >
              {project.languages[0].name}
            </p>
          )}
          <div className="flex items-center gap-1">
            <Heart className="size-4" />
            <p>{project.likes.length}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
