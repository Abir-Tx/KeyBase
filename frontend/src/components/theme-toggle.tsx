"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

const emptySubscribe = () => () => {};

/**
 * Accessible light/dark theme toggle synced with resolved system theme.
 */
export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const mounted = React.useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className="h-8 w-16 rounded-full bg-slate-200 dark:bg-slate-700"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={`relative flex h-8 w-16 cursor-pointer items-center rounded-full px-1 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 ${
        isDark ? "bg-slate-700" : "bg-sky-200"
      }`}
    >
      <motion.div
        layout
        transition={{ type: "spring", stiffness: 700, damping: 30 }}
        className={`flex h-6 w-6 items-center justify-center rounded-full bg-white shadow-md ${
          isDark ? "ml-auto" : ""
        }`}
      >
        <motion.div
          key={isDark ? "moon" : "sun"}
          initial={{ scale: 0.5, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          {isDark ? (
            <Moon size={14} className="text-slate-800" />
          ) : (
            <Sun size={14} className="text-orange-500" />
          )}
        </motion.div>
      </motion.div>
    </button>
  );
}
