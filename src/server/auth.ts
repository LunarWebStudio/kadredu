import { DrizzleAdapter } from "@auth/drizzle-adapter";
import {
  getServerSession,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import EmailProvider from "next-auth/providers/email";

import { env } from "~/env";
import { db } from "~/server/db";
import { eq } from "drizzle-orm";
import { createTable, users } from "~/server/db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: NonNullable<Awaited<ReturnType<typeof GetUser>>>
    & DefaultSession["user"];
  }
}

const GetUser = async (id: string) => {
  return await db.query.users.findFirst({
    where: eq(users.id, id),
    columns: {
      id: true,
      name: true,
      email: true,
      role: true,
    }
  })
}

export const authOptions: NextAuthOptions = {
  callbacks: {
    redirect({ baseUrl }) {
      return baseUrl
    },
    session: async ({ session, user }) => {
      const dbUser = await GetUser(user.id)

      if (user.email === env.MAIN_ADMIN_EMAIL && dbUser?.role !== "ADMIN") {
        await db.update(users).set({
          role: "ADMIN"
        }).where(eq(users.id, user.id))
      }

      return {
        ...session,
        user: dbUser
      }
    },
  },
  adapter: DrizzleAdapter(db, createTable) as Adapter,
  providers: [
    EmailProvider({
      server: env.EMAIL_SERVER,
      from: env.EMAIL_FROM,
      maxAge: 10 * 60,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
