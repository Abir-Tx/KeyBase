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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      {/* The outer div handles the layout. 
         Global background transitions are handled in globals.css for 'body',
         so we don't need excessive transition classes here which might conflict.
      */}
      <div className="flex min-h-screen">
        <Sidebar
          open={!sidebarOpen}
          toggle={() => setSidebarOpen(!sidebarOpen)}
        />
        <main className="flex-1 p-6 md:p-8 lg:p-12 transition-all duration-300">
          <div className="flex justify-end mb-8">
            <ThemeToggle />
          </div>
          {children}
        </main>
      </div>
    </ThemeProvider>
  );
}
