"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { motion } from "framer-motion";
import { Edit2, Keyboard, Trash2 } from "lucide-react";

type ShortcutCardProps = {
  shortcut: Shortcut;
  onEditDetails: (sc: Shortcut) => void;
  onRecordKeys: (sc: Shortcut) => void;
  onDelete: (sc: Shortcut) => void;
};

export default function ShortcutCard({
  shortcut,
  onEditDetails,
  onRecordKeys,
  onDelete,
}: ShortcutCardProps) {
  const keysArray = shortcut.keys ?? [];
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="w-full md:w-[48%] bg-white dark:bg-slate-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-xl dark:shadow-none dark:hover:bg-slate-750 transition-all duration-300 flex flex-col justify-between gap-4 group"
    >
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col gap-1">
          <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 tracking-tight">
            {shortcut.name || shortcut.app}
          </h3>
          {shortcut.description && (
            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
              {shortcut.description}
            </p>
          )}
        </div>
        {/* Delete button (visible on hover or always on touch) */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(shortcut);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete Shortcut"
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Keys Display */}
      <div className="flex flex-wrap gap-2 my-1">
        {keysArray.length > 0 ? (
          keysArray.map((key, idx) => (
            <kbd
              key={idx}
              className="px-2.5 py-1 font-mono text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded border-b-2 border-gray-300 dark:border-gray-600"
            >
              {key}
            </kbd>
          ))
        ) : (
          <span className="text-gray-400 italic text-sm">No keys recorded</span>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 border-t border-gray-100 dark:border-gray-700/50">
        <button
          onClick={() => onEditDetails(shortcut)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Edit2 size={14} />
          Details
        </button>
        <button
          onClick={() => onRecordKeys(shortcut)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-700/50 hover:bg-green-50 dark:hover:bg-green-900/20 hover:text-green-600 dark:hover:text-green-400 transition-colors"
        >
          <Keyboard size={14} />
          Record
        </button>
      </div>
    </motion.div>
  );
}
