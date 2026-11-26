"use client";

import * as React from "react";
import Image from "next/image";
import Sidebar from "./Sidebar";
import { ThemeProvider } from "./theme-provider";
import { ThemeToggle } from "./theme-toggle";
import { ShortcutFilterProvider, useShortcutFilters } from "@/lib/filter-context";
import { Menu } from "lucide-react";

function TopHeader({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { hasActiveFilters } = useShortcutFilters();

  return (
    <header className="max-w-6xl mx-auto flex items-center justify-between mb-6 md:mb-8">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Open sidebar"
          className="relative inline-flex items-center justify-center p-2 rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
        >
          <Menu size={18} />
          {hasActiveFilters && (
            <span
              className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-2 ring-white dark:ring-slate-900"
              aria-hidden="true"
            />
          )}
        </button>

        <div className="flex items-center gap-2.5">
          <Image
            src="/logo.png"
            alt="KeyBase logo"
            width={32}
            height={32}
            priority
            className="rounded-lg shadow-sm"
          />
          <span className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100">
            KeyBase
          </span>
        </div>
      </div>

      <ThemeToggle />
    </header>
  );
}

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
      <ShortcutFilterProvider>
        <div className="flex min-h-screen">
          <Sidebar
            open={sidebarOpen}
            onClose={() => setSidebarOpen(false)}
          />
          <main className="flex-1 min-w-0 px-4 py-5 md:p-8 lg:p-10 transition-all duration-300">
            <TopHeader onOpenSidebar={() => setSidebarOpen(true)} />
            {children}
          </main>
        </div>
      </ShortcutFilterProvider>
    </ThemeProvider>
  );
}
