import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { eq } from "drizzle-orm";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";
import GithubProvider from "next-auth/providers/github";

import { env } from "~/env";
import { db } from "~/server/db";
import { createTable, users } from "~/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NonNullable<Awaited<ReturnType<typeof GetUser>>> &
    DefaultSession["user"];
  }

  export interface User {
    image: number;
  }
}

const GetUser = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    with: {
      profilePicture: true,
      group: {
        with: {
          image: true,
          building: true
        }
      }
    },
    columns: {
      id: true,
      name: true,
      username: true,
      email: true,
      role: true,
      experiencePoints: true,
      coins: true,
      verified: true,
      onboarding: true
    }
  });
};

export const authOptions: NextAuthOptions = {
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl;
    },
    async signIn({ account, profile }) {
      if (account?.provider !== "github") {
        return true
      }

      const session = await getServerAuthSession()
      if (!session) {
        return false
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      const login = (profile as any)?.login as string;
      if (!login) {
        return false
      }

      await db.update(users).set({
        githubUsername: login,
        githubToken: account.access_token
      })
        .where(eq(users.id, session.user.id))

      return true
    },
    session: async ({ session, user }) => {
      const dbUser = await GetUser(user.id);

      if (
        user.email === env.MAIN_ADMIN_EMAIL &&
        !dbUser?.role.includes("ADMIN")
      ) {
        dbUser?.role.push("ADMIN");
        await db
          .update(users)
          .set({
            role: dbUser?.role,
            username: "admin",
            verified: true,
            name: "Администратор"
          })
          .where(eq(users.id, user.id));
      }

      return {
        ...session,
        user: dbUser
      };
    }
  },
  pages: {
    signIn: "/auth",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify",
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: 10 * 60
    }),
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      authorization: {
        params: {
          scope: "user:email,read:user,read:repo"
        }
      }
    })
  ]
};

export const getServerAuthSession = () => getServerSession(authOptions);
