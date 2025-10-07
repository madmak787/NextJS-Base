import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger className="bg-sidebar hover:bg-sidebar -translate-x-1 text-sidebar-foreground/50 size-5 z-10" />
      <main className="flex flex-col gap-2.5 py-4 px-2 w-full">
        <div className="flex flex-col gap-2 p-5 h-full rounded-xl border border-gray-300">
          {/* <SidebarTrigger /> */}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
