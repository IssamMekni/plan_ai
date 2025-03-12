import { type AuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { prisma } from "./prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
export const authOptions: AuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  adapter: PrismaAdapter(prisma),
  callbacks: {
    async session({ session, user, token }) {
      if (user) {
        session.user.id = user.id; 
      } else if (token?.sub) {
        session.user.id = token.sub; // استخدام sub من JWT كمعرف
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id; // تمرير id إلى JWT عند تسجيل الدخول الأولي
      }
      return token;
    },
  },
};
