"use client";

import * as React from "react";
import { Frame, Map, PieChart, Settings2, SquareTerminal } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { NavMain } from "@/components/nav-main";
// import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// This is sample data.
const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Sample Data",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Data Table",
          url: "/admin/table",
        },
        {
          title: "Data Add",
          url: "/admin/form/create",
        },
        {
          title: "Data Edit",
          url: "/admin/form/edit/?hid=1",
        },
      ],
    },
    {
      title: "Settings",
      url: "#",
      icon: Settings2,
      items: [
        {
          title: "My Profile",
          url: "/admin/profile",
        },
        {
          title: "Configurations",
          url: "/admin/settings",
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
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarHeader className="p-0">
          <SidebarMenu className="">
            <SidebarMenuItem className="">
              <SidebarMenuButton className="" size="lg" tooltip="" asChild>
                <Link href="/" className="block my-1 hover:bg-transparent">
                  <Image
                    width={100}
                    height={50}
                    src="/images/logo.png"
                    alt="Logo"
                    className="block m-auto"
                  />
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        {/* <NavProjects projects={data.projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
