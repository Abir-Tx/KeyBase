"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun } from "lucide-react"; // Using Lucide icons for better SVG animation

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <motion.button
      layout // Smoothly resizes the button width if text length changes
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="relative flex items-center gap-2 px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 shadow-sm overflow-hidden"
      whileTap={{ scale: 0.95 }} // Tactile click feedback
      transition={{ type: "spring", stiffness: 300, damping: 25 }} // Button springiness
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={theme}
          initial={{ y: -25, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 25, opacity: 0 }}
          transition={{ duration: 0.2, ease: "easeOut" }}
          className="flex items-center gap-2"
        >
          {isDark ? <Moon size={18} /> : <Sun size={18} />}
          <span className="font-medium">
            {isDark ? "Dark Mode" : "Light Mode"}
          </span>
        </motion.div>
      </AnimatePresence>
    </motion.button>
  );
}
