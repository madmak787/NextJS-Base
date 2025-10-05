import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import React from "react";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <main className="flex flex-col gap-2.5 p-6 w-full">
        <div className="flex flex-col gap-6 p-6 h-full rounded-xl border border-gray-300">
          {/* <SidebarTrigger /> */}
          {children}
        </div>
      </main>
    </SidebarProvider>
  );
}
