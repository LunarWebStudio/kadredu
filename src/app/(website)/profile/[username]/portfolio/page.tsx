import ProjectCard from "~/components/project_card";
import {
  ProfileContent,
  ProfileHeader,
  ProfileTitle,
} from "~/components/ui/profile";
import { api } from "~/trpc/server";
import CreateUpdatePortfolioProject from "./create_update";

export default async function Portfolio({
  params,
}: {
  params: {
    username?: string;
  };
}) {
  const projects = await api.portfolio.getByUsername({
    username: params.username ?? "",
  });

  return (
    <ProfileContent className="mt-4">
      <ProfileHeader className="flex flex-row justify-between">
        <ProfileTitle className="bg-slate-400 block">Портфолио</ProfileTitle>
        <CreateUpdatePortfolioProject />
      </ProfileHeader>

      <div className="space-y-4 mt-4">
        {projects ? (
          projects.map((project) => (
            <ProjectCard project={project} key={project.id} />
          ))
        ) : (
          <h1>Тут пока пусто :(</h1>
        )}
      </div>
    </ProfileContent>
  );
}
