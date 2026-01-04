"use client";

import * as React from "react";
import Sidebar from "./Sidebar";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <ThemeProvider>
      <div className="flex min-h-screen transition-colors  duration-300">
        <Sidebar
          open={!sidebarOpen}
          toggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 md:p-8 lg:p-12">
          <div className="flex justify-end mb-6">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
