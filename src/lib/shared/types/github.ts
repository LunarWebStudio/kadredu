import { inferProcedureOutput } from "@trpc/server";
import { AppRouter } from "~/server/api/root";

export type GithubRepository = inferProcedureOutput<
  AppRouter["github"]["getOwnedRepos"]
>[number];

export type GithubEvent = inferProcedureOutput<
  AppRouter["github"]["getUserEvents"]
>[number]
