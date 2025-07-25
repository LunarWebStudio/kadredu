import { Octokit } from "octokit";

export class Github {
  private octokit: Octokit;
  private username: string;

  constructor({ token, username }: { token: string; username: string }) {
    this.octokit = new Octokit({ auth: token });
    this.username = username;
  }

  public async GetRepos() {
    const { data } = await this.octokit.rest.repos.listForUser({
      username: this.username,
    });

    return data.map((r) => ({
      name: r.name,
      description: r.description,
      url: r.html_url,
      owner: r.owner.login,
      default_branch: r.default_branch,
    }));
  }

  public async GetRepo(repo: string) {
    const repoData = await this.octokit.rest.repos.get({
      owner: this.username,
      repo,
    });

    return {
      name: repoData.data.name,
      description: repoData.data.description,
      url: repoData.data.html_url,
      owner: repoData.data.owner.login,
      default_branch: repoData.data.default_branch,
    };
  }

  public async GetReadme(repo: string) {
    try {
      const { data } = await this.octokit.rest.repos.getReadme({
        owner: this.username,
        repo,
      });

      const b64 = Buffer.from(data.content, "base64").toString("utf-8");
      return b64;
    } catch (err) {
      return "";
    }
  }

  public async GetLanguages(repo: string) {
    const { data } = await this.octokit.rest.repos.listLanguages({
      owner: this.username,
      repo,
    });

    let total = 0;
    Object.keys(data).forEach((key) => {
      total += data[key]!;
    });

    const percentage = Object.keys(data).map((key) => ({
      name: key,
      percent: (data[key]! / total) * 100,
    }));

    percentage.sort((a, b) => b.percent - a.percent);

    return percentage;
  }

  public async GetTree(repo: string) {
    const files = await this.octokit.rest.git.getTree({
      owner: this.username,
      repo,
      tree_sha: (await this.GetRepo(repo)).default_branch,
    });

    return files.data.tree
      .sort((a, _) => (a.type === "tree" ? -1 : 1))
      .map((r) => ({
        path: r.path,
        url: r.url,
        type: r.type,
      }));
  }

  public async GetUserEvents(username: string) {
    type Response = {
      user: {
        contributionsCollection: {
          contributionCalendar: {
            totalContributions: number;
            weeks: {
              contributionDays: {
                color:
                  | "#216e39"
                  | "#30a14e"
                  | "#40c463"
                  | "#9be9a8"
                  | "#ebedf0";
                contributionCount: number;
                date: string;
              }[];
            }[];
          };
        };
      };
    };

    const query = `
    query ($username: String!) {
      user(login: $username) {
        contributionsCollection {
          contributionCalendar {
            totalContributions
            weeks {
              contributionDays {
                color
                contributionCount
                date
              }
            }
          }
        }
      }
    }
  `;
    const graphql = await this.octokit.graphql<Response>(query, { username });

    return graphql.user.contributionsCollection.contributionCalendar.weeks.flatMap(
      (w) => w.contributionDays,
    );
  }
}
