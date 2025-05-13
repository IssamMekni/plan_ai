import * as React from "react";
import { FolderOpen } from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
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
import { NavPages } from "../nav-pages";

// This is sample data.
// const data = {
//   // user: {
//   //   name: "shadcn",
//   //   email: "m@example.com",
//   //   avatar: "/avatars/shadcn.jpg",
//   // },
//   teams: [
//     {
//       name: "Acme Inc",
//       // logo: GalleryVerticalEnd,
//       plan: "Enterprise",
//     },
//     {
//       name: "Acme Corp.",
//       // logo: AudioWaveform,
//       plan: "Startup",
//     },
//     {
//       name: "Evil Corp.",
//       // logo: Command,
//       plan: "Free",
//     },
//   ],

//   projects: [
//     {
//       name: "Design Engineering",
//       url: "#",
//       icon: "Frame",
//     },
//     {
//       name: "Sales & Marketing",
//       url: "#",
//       icon: "PieChart",
//     },
//     {
//       name: "Travel",
//       url: "#",
//       icon: "Map",
//     },
//   ],
// };

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // const { data: session } = useSession();
  // console.log(session?.user);
  const pages = [
    { name: "home", url: "/" },
    { name: "my projecta", url: "/me" },
    { name: "community", url: "/community" },
    { name: "settings", url: "/settings" },
  ];
  const navMain = [
    {
      title: "Projects",
      url: "#",
      icon: FolderOpen,
      isActive: true,
      items: [],
    },
  ];
  const session = await getServerSession(authOptions);
  const projects = await getUserProjects(session?.user?.id);
  navMain.find((item) => item.title === "Projects").items = projects.map(
    (project) => ({
      title: project.name,
      url: `/project/${project.id}`,
    })
  );

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background hover:bg-background">
        {/* <TeamSwitcher teams={data.teams} /> */}
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain items={navMain} />
        <NavPages pages={pages} />
      </SidebarContent>
      <SidebarFooter className="bg-background">
        {/* {JSON.stringify(session?.user)} */}
        {session?.user && <NavUser user={session?.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
