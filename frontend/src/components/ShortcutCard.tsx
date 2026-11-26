"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { useCopyKeys } from "@/lib/keys";
import { formatKeysText, parseOsList } from "@/lib/shortcuts";
import { motion } from "framer-motion";
import {
  Edit2,
  Keyboard,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

type ShortcutCardProps = {
  shortcut: Shortcut;
  hasConflict?: boolean;
  onEditDetails: (sc: Shortcut) => void;
  onRecordKeys: (sc: Shortcut) => void;
  onDelete: (sc: Shortcut) => void;
  onFilterOs?: (os: string) => void;
  onFilterTag?: (tag: string) => void;
};

export default function ShortcutCard({
  shortcut,
  hasConflict = false,
  onEditDetails,
  onRecordKeys,
  onDelete,
  onFilterOs,
  onFilterTag,
}: ShortcutCardProps) {
  const { copied, copyKeys } = useCopyKeys();

  const keysArray = shortcut.keys ?? [];
  const tagsArray = (shortcut.tags ?? []).filter(Boolean);
  const osList = parseOsList(shortcut.os);

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.18 } }}
      className="h-full bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-lg dark:shadow-none dark:hover:border-slate-600 transition-all duration-200 flex flex-col justify-between gap-4 group"
    >
      {/* Header */}
      <div className="flex justify-between items-start gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100 tracking-tight break-words">
              {shortcut.name || shortcut.app}
            </h3>
            {hasConflict && (
              <span
                title="Another shortcut in this app uses the same key combination"
                className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/60"
              >
                <AlertTriangle size={11} />
                Duplicate keys
              </span>
            )}
          </div>
          {shortcut.description && (
            <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2">
              {shortcut.description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-1 shrink-0">
          {keysArray.length > 0 && (
            <button
              type="button"
              onClick={() => copyKeys(keysArray)}
              className="opacity-75 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-2 text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md"
              title={copied ? "Copied!" : `Copy "${formatKeysText(keysArray)}"`}
              aria-label={`Copy keys for ${shortcut.name}`}
            >
              {copied ? (
                <Check size={16} className="text-emerald-500" />
              ) : (
                <Copy size={16} />
              )}
            </button>
          )}

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDelete(shortcut);
            }}
            className="opacity-75 md:opacity-0 md:group-hover:opacity-100 focus-visible:opacity-100 transition-opacity p-2 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md"
            title="Delete Shortcut"
            aria-label={`Delete ${shortcut.name}`}
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* Keys + Metadata */}
      <div className="flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-2">
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
          {copied && (
            <span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
              Copied!
            </span>
          )}
        </div>

        {(osList.length > 0 || tagsArray.length > 0) && (
          <div className="flex flex-wrap items-center gap-1.5">
            {osList.map((osItem) => (
              <button
                key={osItem}
                type="button"
                onClick={() => onFilterOs?.(osItem)}
                title={`Filter by ${osItem}`}
                className="px-2 py-0.5 text-xs font-medium rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
              >
                {osItem}
              </button>
            ))}
            {tagsArray.map((tag, idx) => (
              <button
                key={`${tag}-${idx}`}
                type="button"
                onClick={() => onFilterTag?.(tag)}
                title={`Filter by #${tag}`}
                className="px-2 py-0.5 text-xs rounded-md bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                #{tag}
              </button>
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
