"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  const isDark = theme === "dark";

  return (
    <div
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`relative flex h-8 w-16 cursor-pointer items-center rounded-full px-1 transition-colors duration-300 ${
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
    </div>
  );
}
