import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type GithubRepository = inferProcedureOutput<
  AppRouter["github"]["getOwnedRepos"]
>[number];
