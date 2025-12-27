"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import ShortcutRecorder from "./ShortcutRecorder";

type RecordKeysModalProps = {
  shortcut: Shortcut;
  onClose: () => void;
  onSave: (keys: string[]) => void;
};

export default function RecordKeysModal({
  shortcut,
  onClose,
  onSave,
}: RecordKeysModalProps) {
  const [keys, setKeys] = React.useState<string[]>(
    shortcut.keys || (shortcut.key?.split("+") ?? [])
  );
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(keys);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Record Shortcut Keys
        </h2>

        <ShortcutRecorder
          initialKeys={keys}
          onSave={(capturedKeys) => setKeys(capturedKeys)}
          delay={200} // 200ms delay between keys
        />

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded bg-gray-300 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-600 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white transition disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
