"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { motion } from "framer-motion";

type ShortcutCardProps = {
  shortcut: Shortcut;
  onEdit: (sc: Shortcut) => void;
};

export default function ShortcutCard({ shortcut, onEdit }: ShortcutCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2, scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      {/* Info Section */}
      <div className="flex flex-col gap-2 flex-1">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {shortcut.name || shortcut.app}
        </h3>
        {shortcut.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {shortcut.description}
          </p>
        )}

        {/* Tags */}
        {shortcut.tags && shortcut.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {shortcut.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-700 text-blue-800 dark:text-blue-100 transition-colors duration-300"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Keys & Actions */}
      <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:items-center">
        {/* Keys */}
        <div className="flex flex-wrap gap-2">
          {shortcut.keys?.map((key, idx) => (
            <kbd
              key={idx}
              className="px-3 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm transition-colors duration-300"
            >
              {key}
            </kbd>
          ))}
        </div>

        {/* Edit Button */}
        <button
          onClick={() => onEdit(shortcut)}
          className="px-4 py-1 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition-colors shadow mt-2 md:mt-0"
        >
          Edit
        </button>
      </div>
    </motion.div>
  );
}
