import { Octokit } from "octokit";
import { env } from "~/env";


const octokit = new Octokit({ auth: env.GITHUB_TOKEN });

export async function GetRepos(username: string) {
  const { data } = await octokit.rest.repos.listForUser({
    username
  })

  return data;
}

export async function GetRepo(owner: string, repo: string) {
  const repoData = await octokit.rest.repos.get({
    owner,
    repo
  })

  return {
    name: repoData.data.name,
    description: repoData.data.description,
    url: repoData.data.html_url,
    owner: repoData.data.owner.login,
    default_branch: repoData.data.default_branch,
  };
}

export async function GetReadme(owner: string, repo: string) {
  const { data } = await octokit.rest.repos.getReadme({
    owner,
    repo
  })

  const b64 = Buffer.from(data.content, "base64").toString("utf-8");
  return b64;
}

export async function GetLanguages(owner: string, repo: string) {
  const { data } = await octokit.rest.repos.listLanguages({
    owner,
    repo
  })

  let total = 0;
  Object.keys(data).forEach(key => {
    total += data[key]!;
  });

  return Object.keys(data).map(key => ({
    name: key,
    percent: data[key]! / total * 100
  }))

}

export async function GetTree(owner: string, repo: string) {
  const files = await octokit.rest.git.getTree({
    owner,
    repo,
    tree_sha: (await GetRepo(owner, repo)).default_branch
  })

  return files.data.tree.map(r => ({
    path: r.path,
    url: r.url,
  }));
}
