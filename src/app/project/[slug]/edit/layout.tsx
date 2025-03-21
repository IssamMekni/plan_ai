"use client";

import NextAuthProvider from "@/app/provider/NextAuthProvider";

export default function layout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
        <NextAuthProvider>
          {children}
        </NextAuthProvider>
    );
  }