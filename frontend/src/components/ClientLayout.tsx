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
  const [sidebarOpen, setSidebarOpen] = React.useState(true); // sidebar visible by default

  return (
    <ThemeProvider>
      {/* <div className="flex min-h-screen bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300"> */}
      <Sidebar open={sidebarOpen} toggle={() => setSidebarOpen(!sidebarOpen)} />
      <main className="flex-1 p-6">
        <div className="flex justify-end mb-4">
          <ThemeToggle />
        </div>
        {children}
      </main>
      {/* </div> */}
    </ThemeProvider>
  );
}
