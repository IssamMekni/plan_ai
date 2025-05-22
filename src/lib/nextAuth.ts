import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github"
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,

    })
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user, token }) {
      if (session){
        if (user) {
          session.user.id = user.id; 
        } else if (token?.sub) {
          session.user.id = token.sub; 
        }
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; 
      }
      return token;
    },
  },
};
