"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";

type ShortcutCardProps = {
  shortcut: Shortcut;
  onEditDetails: (sc: Shortcut) => void; // full edit modal
  onRecordKeys: (sc: Shortcut) => void; // record keys modal
  // onDeleteShortcut: (sc: Shortcut) => void; // delete shortcut modal
  onDelete: (sc: Shortcut) => void;
};

export default function ShortcutCard({
  shortcut,
  onEditDetails,
  onRecordKeys,
  // onDeleteShortcut,
  onDelete,
}: ShortcutCardProps) {
  const keysArray = shortcut.keys ?? [];
  return (
    <div className="w-full md:w-[48%] bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm flex flex-col justify-between gap-4 hover:shadow-lg transition-shadow duration-300">
      {/* Info */}
      <div className="flex flex-col gap-2">
        <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100">
          {shortcut.name || shortcut.app}
        </h3>
        {shortcut.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300">
            {shortcut.description}
          </p>
        )}
      </div>

      {/* Keys */}
      <div className="flex flex-wrap gap-2 mb-2">
        {keysArray.length > 0 ? (
          keysArray.map((key, idx) => (
            <kbd
              key={idx}
              className="px-3 py-1 font-mono text-sm bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100 rounded-lg shadow-sm"
            >
              {key}
            </kbd>
          ))
        ) : (
          <span className="text-gray-500 dark:text-gray-400 text-sm">
            No keys
          </span>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-2 mt-2">
        <button
          onClick={() => onEditDetails(shortcut)}
          className="flex-1 px-4 py-2 rounded-md bg-yellow-500 hover:bg-yellow-600 text-white text-sm transition"
        >
          Edit Details
        </button>
        <button
          onClick={() => onRecordKeys(shortcut)}
          className="flex-1 px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-sm transition"
        >
          Record Keys
        </button>
        {/* Delete button */}
        <button
          onClick={() => onDelete(shortcut)}
          className="px-3 py-1 text-sm rounded-md bg-red-600 text-white hover:bg-red-700 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
