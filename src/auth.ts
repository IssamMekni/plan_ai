import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "./lib/prisma";

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  // callbacks: {
  //   async session({ session, user }) {
  //     session.user.id = user.id; // إضافة معرف المستخدم إلى الجلسة
  //     return session;
  //   },
  // },
  pages: {
    signIn: '/auth/signin', // صفحة تسجيل الدخول المخصصة (اختياري)
  },
};

export const { handlers, auth, signIn, signOut } = NextAuth(authOptions);