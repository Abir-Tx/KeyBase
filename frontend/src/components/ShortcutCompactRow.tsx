"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { useCopyKeys } from "@/lib/keys";
import { formatKeysText, parseOsList } from "@/lib/shortcuts";
import {
  Edit2,
  Keyboard,
  Trash2,
  Copy,
  Check,
  AlertTriangle,
} from "lucide-react";

type ShortcutCompactRowProps = {
  shortcut: Shortcut;
  hasConflict?: boolean;
  onEditDetails: (sc: Shortcut) => void;
  onRecordKeys: (sc: Shortcut) => void;
  onDelete: (sc: Shortcut) => void;
  onFilterOs?: (os: string) => void;
  onFilterTag?: (tag: string) => void;
};

/**
 * Dense single-row shortcut item for Compact Cheat-Sheet view.
 */
export default function ShortcutCompactRow({
  shortcut,
  hasConflict = false,
  onEditDetails,
  onRecordKeys,
  onDelete,
  onFilterOs,
  onFilterTag,
}: ShortcutCompactRowProps) {
  const { copied, copyKeys } = useCopyKeys();

  const keysArray = shortcut.keys ?? [];
  const tagsArray = (shortcut.tags ?? []).filter(Boolean);
  const osList = parseOsList(shortcut.os);

  return (
    <div className="px-4 py-3 flex flex-col md:flex-row md:items-center justify-between gap-2.5 md:gap-4 hover:bg-slate-50 dark:hover:bg-slate-700/35 transition-colors group">
      {/* Name, Conflict & Description */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1 min-w-0">
          <span className="font-semibold text-sm text-slate-900 dark:text-slate-100 break-words">
            {shortcut.name || shortcut.app}
          </span>
          {hasConflict && (
            <span
              title="Another shortcut in this app uses the same key combination"
              className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/70 dark:border-amber-700/60"
            >
              <AlertTriangle size={10} />
              Duplicate
            </span>
          )}
          {shortcut.description && (
            <span
              title={shortcut.description}
              className="text-xs text-slate-500 dark:text-slate-400 break-words md:truncate md:max-w-md"
            >
              — {shortcut.description}
            </span>
          )}
        </div>

        {(osList.length > 0 || tagsArray.length > 0) && (
          <div className="flex flex-wrap items-center gap-1 mt-1">
            {osList.map((osItem) => (
              <button
                key={osItem}
                type="button"
                onClick={() => onFilterOs?.(osItem)}
                title={`Filter by ${osItem}`}
                className="px-1.5 py-0.5 text-[11px] font-medium rounded bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/70 dark:border-blue-800/60 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
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
                className="px-1.5 py-0.5 text-[11px] rounded bg-slate-100 dark:bg-slate-700/70 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
              >
                #{tag}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Keys + Row Actions */}
      <div className="min-w-0 w-full md:w-auto flex flex-wrap items-center justify-between md:justify-end gap-2 md:gap-3 md:shrink-0">
        <div className="flex flex-wrap items-center gap-1.5">
          {keysArray.length > 0 ? (
            keysArray.map((key, idx) => (
              <kbd
                key={`${key}-${idx}`}
                className="px-2 py-0.5 font-mono text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-100 rounded border border-slate-200 dark:border-slate-600 border-b-2"
              >
                {key}
              </kbd>
            ))
          ) : (
            <span className="text-slate-400 italic text-xs">No keys</span>
          )}
          {copied && (
            <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
              Copied!
            </span>
          )}
        </div>

        <div className="flex items-center gap-1">
          {keysArray.length > 0 && (
            <button
              type="button"
              onClick={() => copyKeys(keysArray)}
              title={copied ? "Copied!" : `Copy "${formatKeysText(keysArray)}"`}
              aria-label={`Copy keys for ${shortcut.name}`}
              className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
            >
              {copied ? (
                <Check size={14} className="text-emerald-500" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          )}
          <button
            type="button"
            onClick={() => onEditDetails(shortcut)}
            title="Edit Details"
            aria-label={`Edit details for ${shortcut.name}`}
            className="p-1.5 rounded-md text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-colors"
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            onClick={() => onRecordKeys(shortcut)}
            title="Record Keys"
            aria-label={`Record keys for ${shortcut.name}`}
            className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-colors"
          >
            <Keyboard size={14} />
          </button>
          <button
            type="button"
            onClick={() => onDelete(shortcut)}
            title="Delete Shortcut"
            aria-label={`Delete ${shortcut.name}`}
            className="p-1.5 rounded-md text-red-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
