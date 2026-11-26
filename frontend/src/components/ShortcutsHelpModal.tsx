"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { X, Keyboard } from "lucide-react";

type ShortcutsHelpModalProps = {
  onClose: () => void;
};

const KEYBOARD_TIPS = [
  { keys: ["/", "Ctrl + K"], label: "Focus search bar" },
  { keys: ["Esc"], label: "Clear/blur search or close active modal" },
  { keys: ["n"], label: "Add a new shortcut" },
  { keys: ["v"], label: "Toggle Cards / Compact view" },
  { keys: ["?"], label: "Open this keyboard shortcuts guide" },
  { keys: ["Ctrl + Enter"], label: "Save while editing in Add/Edit modal" },
];

export default function ShortcutsHelpModal({
  onClose,
}: ShortcutsHelpModalProps) {
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose();
      }
    };
    document.addEventListener("keydown", onKeyDown, true);
    return () => document.removeEventListener("keydown", onKeyDown, true);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="keyboard-help-title"
        className="relative w-full max-w-md rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Keyboard size={20} className="text-blue-600 dark:text-blue-400" />
            <h2
              id="keyboard-help-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              KeyBase Shortcuts
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close keyboard shortcuts modal"
            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {KEYBOARD_TIPS.map((tip) => (
            <li
              key={tip.label}
              className="py-3 flex items-center justify-between gap-4 text-sm"
            >
              <span className="text-slate-600 dark:text-slate-300">
                {tip.label}
              </span>
              <div className="flex items-center gap-1.5 shrink-0">
                {tip.keys.map((k, idx) => (
                  <React.Fragment key={k}>
                    {idx > 0 && (
                      <span className="text-xs text-slate-400">or</span>
                    )}
                    <kbd className="px-2 py-0.5 font-mono text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded border border-slate-200 dark:border-slate-700 border-b-2">
                      {k}
                    </kbd>
                  </React.Fragment>
                ))}
              </div>
            </li>
          ))}
        </ul>
      </motion.div>
    </div>
  );
}
