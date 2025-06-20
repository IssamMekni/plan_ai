// src/app/(ui)/layout.tsx
import * as React from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import { AppSidebar } from "@/components/app-sidebar";
import { Separator } from "@/components/ui/separator";
import Navbar from "@/app/Navbar2";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default async function Page({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await getServerSession(authOptions);

  return (
    <>
      {session ? (
        <SidebarProvider>
          <AppSidebar /> {/* No props passed since none are needed */}
          <SidebarInset>
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
              </div>
            </header>
            {children}
          </SidebarInset>
        </SidebarProvider>
      ) : (
        <>
      <Navbar/>

        {children}
        </>
      )}
    </>
  );
}