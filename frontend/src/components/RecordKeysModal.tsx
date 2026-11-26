"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import ShortcutRecorder from "./ShortcutRecorder";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type RecordKeysModalProps = {
  shortcut: Shortcut;
  onClose: () => void;
  onSave: (keys: string[]) => Promise<void>;
};

export default function RecordKeysModal({
  shortcut,
  onClose,
  onSave,
}: RecordKeysModalProps) {
  const [keys, setKeys] = React.useState<string[]>(shortcut.keys ?? []);
  const [recording, setRecording] = React.useState(false);
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (recording || saving) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording, saving, onClose]);

  const handleSave = async () => {
    if (keys.length === 0 || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSave(keys);
      onClose();
    } catch {
      setError("Failed to update shortcut keys. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={saving ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="record-keys-title"
        className="relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-slate-200 dark:border-slate-800"
      >
        <div className="flex justify-between items-start mb-2">
          <h2
            id="record-keys-title"
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Record Keys
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="p-1 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">
          Record the key combination for{" "}
          <span className="font-semibold text-blue-600 dark:text-blue-400">
            {shortcut.name}
          </span>
          .
        </p>

        <div className="bg-slate-50 dark:bg-slate-950 p-5 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 flex justify-center min-h-[120px] items-center">
          <ShortcutRecorder
            initialKeys={keys}
            onChange={setKeys}
            onRecordingChange={setRecording}
            delay={350}
          />
        </div>

        {error && (
          <p className="text-xs text-red-600 dark:text-red-400 mt-3">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            className="px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={saving || keys.length === 0}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
