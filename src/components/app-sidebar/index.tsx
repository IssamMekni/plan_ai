import * as React from "react";
import {
  FolderOpen,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
// import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/nextAuth";
import getUserProjects from "@/db/getUserProjects";

// This is sample data.
const data = {
  // user: {
  //   name: "shadcn",
  //   email: "m@example.com",
  //   avatar: "/avatars/shadcn.jpg",
  // },
  teams: [
    {
      name: "Acme Inc",
      // logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      // logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      // logo: Command,
      plan: "Free",
    },
  ],

  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: "Frame",
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: "PieChart",
    },
    {
      name: "Travel",
      url: "#",
      icon: "Map",
    },
  ],
};

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  // const { data: session } = useSession();
  // console.log(session?.user);
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
  navMain.find((item) => item.title === "Projects").items = projects.map((project) => ({
    title: project.name,
    url: `/project/${project.id}`,
  }));

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader className="bg-background hover:bg-background">
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent className="bg-background">
        <NavMain items={navMain} />
        <NavProjects projects={projects} />
      </SidebarContent>
      <SidebarFooter className="bg-background">
        {/* {JSON.stringify(session?.user)} */}
        {session?.user && <NavUser user={session?.user} />}
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

// // components/app-sidebar.tsx
// import Link from "next/link";
// import { getServerSession } from "next-auth";
// // import { authOptions } from "@/lib/auth";
// // import { prisma } from "@/lib/prisma";
// import {
//   Sidebar,
//   SidebarHeader,
//   SidebarContent,
//   SidebarGroup,
//   SidebarGroupLabel,
//   SidebarGroupContent,
//   SidebarSeparator,
//   SidebarMenu,
//   SidebarMenuItem,
//   SidebarMenuButton,
//   SidebarFooter,
// } from "@/components/ui/sidebar";
// import { Folder, FolderPlus, User, Users } from "lucide-react";
// import { authOptions } from "@/lib/nextAuth";
// import { prisma } from "@/lib/prisma";
// import UserAvatar from "@/app/Navbar";
// // import { UserAvatar } from "@/components/user-avatar";

// async function AppSidebar() {
//   // 1. Session & projects
//   const session = await getServerSession(authOptions);
//   const projects = session?.user?.email
//     ? await prisma.project.findMany({
//         where: { user: { email: session.user.email } },
//         orderBy: { updatedAt: "desc" },
//       })
//     : [];

//   return (
//     <Sidebar>
//       {/* — Top: user info */}
//       <SidebarHeader>
//         <div className="flex items-center space-x-2 p-4">
//           {session && <UserAvatar user={session.user} />}
//           <div>
//             <p className="text-sm font-semibold">{session?.user?.name}</p>
//             <p className="text-xs text-gray-500">{session?.user?.email}</p>
//           </div>
//         </div>
//       </SidebarHeader>

//       {/* — Scrollable content area */}
//       <SidebarContent>
//         {/* My Projects */}
//         <SidebarGroup>
//           <SidebarGroupLabel>My Projects</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               {projects.map((proj) => (
//                 <SidebarMenuItem key={proj.id}>
//                   <SidebarMenuButton asChild>
//                     <Link href={`/projects/${proj.id}`} className="flex items-center">
//                       <Folder className="mr-2 h-4 w-4" />
//                       <span>{proj.name}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/projects/new" className="flex items-center">
//                     <FolderPlus className="mr-2 h-4 w-4" />
//                     <span>New Project</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>

//         <SidebarSeparator />

//         {/* Pages */}
//         <SidebarGroup>
//           <SidebarGroupLabel>Pages</SidebarGroupLabel>
//           <SidebarGroupContent>
//             <SidebarMenu>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/me" className="flex items-center">
//                     <User className="mr-2 h-4 w-4" />
//                     <span>My Profile</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//               <SidebarMenuItem>
//                 <SidebarMenuButton asChild>
//                   <Link href="/community" className="flex items-center">
//                     <Users className="mr-2 h-4 w-4" />
//                     <span>Community</span>
//                   </Link>
//                 </SidebarMenuButton>
//               </SidebarMenuItem>
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       {/* — Optional footer */}
//       <SidebarFooter className="p-4 text-center text-xs text-gray-400">
//         © {new Date().getFullYear()}
//       </SidebarFooter>
//     </Sidebar>
//   );
// }
// export default AppSidebar;
