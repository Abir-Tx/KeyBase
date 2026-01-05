"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  shortcut: Shortcut | null;
  onClose: () => void;
  onSave: (shortcut: Shortcut) => void;
};

export default function AddEditShortcutModal({
  shortcut,
  onClose,
  onSave,
}: Props) {
  const [name, setName] = React.useState(shortcut?.name || "");
  const [keys, setKeys] = React.useState<string[]>(shortcut?.keys || []);
  const [app, setApp] = React.useState(shortcut?.app || "");
  const [os, setOs] = React.useState(shortcut?.os || "");
  const [description, setDescription] = React.useState(
    shortcut?.description || ""
  );
  const [tags, setTags] = React.useState<string[]>(shortcut?.tags || []);
  const [recording, setRecording] = React.useState(false);

  // 🔴 Record keys logic
  React.useEffect(() => {
    if (!recording) return;

    const pressed = new Set<string>();

    const onKeyDown = (e: KeyboardEvent) => {
      e.preventDefault();
      pressed.add(e.key);
      setKeys(Array.from(pressed));
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording]);

  const handleSubmit = () => {
    if (!name.trim() || keys.length === 0) return;

    onSave({
      id: shortcut?.id,
      name: name.trim(),
      keys,
      app: app || "KeyBase", // Default app name if empty
      os,
      description,
      tags,
    });
  };

  const isValid = name.trim().length > 0 && keys.length > 0;

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

      {/* Modal Content */}
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="relative w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-gray-200 dark:border-gray-800"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {shortcut ? "Edit Shortcut" : "Add New Shortcut"}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Copy Text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {!name.trim() && (
              <p className="text-xs text-red-500 mt-1">Name is required</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
              Shortcut Keys
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ctrl, C"
                value={keys.join(", ")}
                readOnly={recording}
                onChange={(e) =>
                  setKeys(
                    e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  )
                }
                className="flex-1 p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => setRecording((r) => !r)}
                className={`px-4 rounded-lg font-medium text-sm transition-all ${
                  recording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                }`}
              >
                {recording ? "Stop" : "Record"}
              </button>
            </div>
            {recording && (
              <p className="text-xs text-blue-500 mt-1 animate-pulse">
                Press keys on your keyboard...
              </p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                App Name
              </label>
              <input
                type="text"
                placeholder="e.g. VS Code"
                value={app}
                onChange={(e) => setApp(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
                OS
              </label>
              <input
                type="text"
                placeholder="e.g. Windows"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
              Description
            </label>
            <textarea
              rows={2}
              placeholder="What does this shortcut do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1 block">
              Tags
            </label>
            <input
              type="text"
              placeholder="productivity, coding"
              value={tags.join(", ")}
              onChange={(e) =>
                setTags(e.target.value.split(",").map((t) => t.trim()))
              }
              className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-8 pt-4 border-t border-gray-100 dark:border-gray-800">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!isValid}
            className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-md ${
              isValid
                ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                : "bg-gray-400 cursor-not-allowed opacity-70"
            }`}
          >
            Save Shortcut
          </button>
        </div>
      </motion.div>
    </div>
  );
}
