"use client"

import * as React from "react"
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "History",
          url: "#",
        },
        {
          title: "Starred",
          url: "#",
        },
        {
          title: "Settings",
          url: "#",
        },
      ],
    },
    {
      title: "Models",
      url: "#",
      icon: Bot,
      items: [
        {
          title: "Genesis",
          url: "#",
        },
        {
          title: "Explorer",
          url: "#",
        },
        {
          title: "Quantum",
          url: "#",
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Introduction",
          url: "#",
        },
        {
          title: "Get Started",
          url: "#",
        },
        {
          title: "Tutorials",
          url: "#",
        },
        {
          title: "Changelog",
          url: "#",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "General",
          url: "#",
        },
        {
          title: "Team",
          url: "#",
        },
        {
          title: "Billing",
          url: "#",
        },
        {
          title: "Limits",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "#",
      icon: Frame,
    },
    {
      name: "Sales & Marketing",
      url: "#",
      icon: PieChart,
    },
    {
      name: "Travel",
      url: "#",
      icon: Map,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
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