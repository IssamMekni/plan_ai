// components/app-sidebar/index.tsx
import * as React from "react";
import { FolderOpen, type LucideIcon } from "lucide-react";
import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { NavPages } from "@/components/nav-pages";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import getUserProjects from "@/db/getUserProjects";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavSubItem[];
}

interface NavSubItem {
  title: string;
  url: string;
}

export async function AppSidebar() {
  const pages = [
    { name: "home", url: "/" },
    { name: "my projects", url: "/me" },
    { name: "community", url: "/community" },
    { name: "settings", url: "/settings" },
  ];
  const navMain: NavItem[] = [
    {
      title: "Projects",
      url: "#",
      icon: FolderOpen,
      isActive: true,
      items: [],
    },
  ];
  const session = await getServerSession(authOptions);
  const projects = session?.user?.id ? await getUserProjects(session.user.id) : [];
  navMain.find((item) => item.title === "Projects")!.items = projects.map(
    (project) => ({
      title: project.name,
      url: `/project/${project.id}`,
    })
  );

  // Validate user object before passing to NavUser
  const user = session?.user && session.user.name && session.user.email && session.user.image
    ? {
        name: session.user.name,
        email: session.user.email,
        image: session.user.image,
      }
    : null;

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="bg-background hover:bg-background">
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavPages pages={pages} />
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter className="bg-background">
        {user && <NavUser user={user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}