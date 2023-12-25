import { env } from "@/env.mjs";
import { db } from "@/server/db";
import type { DefaultSession, DefaultUser, NextAuthOptions } from "next-auth";
import { getServerSession } from "next-auth";
import { Adapter } from "next-auth/adapters";
import GithubProvider from "next-auth/providers/github";
import { CustomPgDrizzleAdapter } from "./db/adapter";
import { roleEnum } from "./db/schema";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // role: (typeof roleEnum["enumValues"][number]);
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    username: string;
  }
}

export const authOptions: NextAuthOptions = {
  debug: env.NODE_ENV !== "production",
  session: {
    strategy: "database"
  },
  adapter: CustomPgDrizzleAdapter(db) as unknown as Adapter,
  providers: [
    GithubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,

      profile: (profile) => {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: profile.login,
        };
      },
    }),
  ],
  callbacks: {
    redirect: ({ baseUrl, url }) => {
      return `${baseUrl}/marketplace`
    },
    session: ({ session, user }) => {
      return {
        ...session,
        user: {
          ...session.user,
          username: user.username,
          id: user.id,
        },
      }
    },
  },
};

export const getServerAuthSession = () => getServerSession(authOptions);
