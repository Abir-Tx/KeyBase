"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import ShortcutRecorder from "./ShortcutRecorder";
import { motion } from "framer-motion";

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
  const [keys, setKeys] = React.useState<string[]>(shortcut.keys ?? []);
  const [saving, setSaving] = React.useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      await onSave(keys);
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
      onClose(); // This will trigger the parent's AnimatePresence exit
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      {/* Modal */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="relative bg-white dark:bg-slate-900 p-6 rounded-xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-800"
      >
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Record Keys
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
          Press the combination you want to save for{" "}
          <span className="font-semibold text-blue-500">{shortcut.name}</span>.
        </p>

        <div className="bg-gray-50 dark:bg-gray-950 p-4 rounded-lg border border-dashed border-gray-300 dark:border-gray-700 flex justify-center min-h-[100px] items-center">
          <ShortcutRecorder
            initialKeys={keys}
            onSave={(capturedKeys) => setKeys(capturedKeys)}
            delay={200}
          />
        </div>

        <div className="mt-8 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition shadow-sm hover:shadow-md disabled:opacity-50"
          >
            {saving ? "Saving..." : "Confirm & Save"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
