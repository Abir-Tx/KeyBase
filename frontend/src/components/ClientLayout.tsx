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
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <div className="flex min-h-screen">
        <Sidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onOpen={() => setSidebarOpen(true)}
        />
        <main className="flex-1 px-4 py-6 md:p-8 lg:p-12 transition-all duration-300">
          <div className="flex justify-end mb-6 md:mb-8">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
