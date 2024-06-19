import DOMPurify from "dompurify";
import { JSDOM } from "jsdom";
import { Folder, Heart } from "lucide-react";
import { MDXRemote } from "next-mdx-remote/rsc";
import { serialize } from "next-mdx-remote/serialize";
import Link from "next/link";
import remarkGfm from "remark-gfm";
import { api } from "~/trpc/server";
export default async function Project({
  params
}: {
  params: {
    id?: string
  }
}) {
  const project = await api.portfolio.getOne({
    id: params.id ?? ""
  });

  const readme = await serialize(
    DOMPurify(new JSDOM("<!DOCTYPE html>").window).sanitize(
      project.readme.replaceAll("<br>", "\n")
    ),
    {
      mdxOptions: {
        remarkPlugins: [remarkGfm]
      }
    }
  );

  console.log(readme);

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
          <div className="flex items-center gap-1">
            <Heart className="size-4" />
            Понравилось
          </div>
        </div>
      </div>
      {project.readme !== "" && (
        <div className="rounded-xl bg-secondary text-lg text-muted-foreground">
          <div className="w-full border-b p-6">О проекте</div>
          <p className="prose">
            <MDXRemote source={readme} />
          </p>
        </div>
      )}
    </div>
  );
}
