import CreateUpdatePortfolioProject from "~/app/(website)/profile/[username]/portfolio/create_update";
import ProfileTemplate from "~/app/(website)/profile/[username]/templ";
import ProjectCard from "~/components/project_card";
import { api } from "~/trpc/server";

export default async function Portfolio({
  params
}: {
  params: {
    username?: string
  }
}) {
  const projects = await api.portfolio.getByUsername({
    username: params.username ?? ""
  });

  const repos = await api.github.getOwnedRepos();

  return (
    <ProfileTemplate
      title="Портфолио"
      navbar={<CreateUpdatePortfolioProject repos={repos} />}
      className="bg-red-400"
    >
      <div className="space-y-4">
        {projects.map(project => (
          <ProjectCard
            project={project}
            key={project.id}
          />
        ))}
      </div>
    </ProfileTemplate>
  );
}
