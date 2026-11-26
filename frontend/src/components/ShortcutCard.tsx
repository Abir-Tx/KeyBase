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
  const tagsArray = (shortcut.tags ?? []).filter(Boolean);
  const showOs = shortcut.os && shortcut.os.toLowerCase() !== "any";

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="h-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between gap-4 group"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight break-words">
            {shortcut.name || shortcut.app}
          </h3>
          {shortcut.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {shortcut.description}
            </p>
          )}
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(shortcut);
          }}
          className="shrink-0 opacity-75 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
          title="Delete Shortcut"
          aria-label={`Delete ${shortcut.name}`}
        >
          <Trash2 size={16} />
        </button>
      </div>

      {/* Keys + Metadata */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap gap-2">
          {keysArray.length > 0 ? (
            keysArray.map((key, idx) => (
              <kbd
                key={`${key}-${idx}`}
                className="px-2.5 py-1 font-mono text-sm font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded border border-slate-200 dark:border-slate-600 border-b-2"
              >
                {key}
              </kbd>
            ))
          ) : (
            <span className="text-slate-400 italic text-sm">
              No keys recorded
            </span>
          )}
        </div>

        {(showOs || tagsArray.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {showOs && (
              <span className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60">
                {shortcut.os}
              </span>
            )}
            {tagsArray.map((tag, idx) => (
              <span
                key={`${tag}-${idx}`}
                className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-700/60">
        <button
          type="button"
          onClick={() => onEditDetails(shortcut)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <Edit2 size={14} />
          Details
        </button>
        <button
          type="button"
          onClick={() => onRecordKeys(shortcut)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-700/50 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
        >
          <Keyboard size={14} />
          Record
        </button>
      </div>
    </motion.div>
  );
}
