'use client'
import NextAuthProvider from "../../provider/NextAuthProvider";


export default function RootLayout({
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
