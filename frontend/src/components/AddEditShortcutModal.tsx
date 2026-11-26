"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import { useKeyRecorder } from "@/lib/keys";
import { motion } from "framer-motion";
import { X } from "lucide-react";

type Props = {
  shortcut: Shortcut | null;
  appSuggestions?: string[];
  osSuggestions?: string[];
  onClose: () => void;
  onSave: (shortcut: Shortcut) => Promise<void>;
};

export default function AddEditShortcutModal({
  shortcut,
  appSuggestions = [],
  osSuggestions = [],
  onClose,
  onSave,
}: Props) {
  const [name, setName] = React.useState(shortcut?.name || "");
  const [app, setApp] = React.useState(shortcut?.app || "");
  const [os, setOs] = React.useState(shortcut?.os || "");
  const [description, setDescription] = React.useState(
    shortcut?.description || ""
  );
  const [tagsInput, setTagsInput] = React.useState(
    (shortcut?.tags || []).join(", ")
  );
  const [touched, setTouched] = React.useState({ name: false, keys: false });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const { keys, setKeys, recording, startRecording, stopRecording } =
    useKeyRecorder(shortcut?.keys || []);

  React.useEffect(() => {
    if (recording || saving) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [recording, saving, onClose]);

  const trimmedName = name.trim();
  const isValid = trimmedName.length > 0 && keys.length > 0;

  const submitForm = async () => {
    setTouched({ name: true, keys: true });
    if (!isValid || saving) return;

    setSaving(true);
    setError(null);
    try {
      const parsedTags = tagsInput
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);

      await onSave({
        id: shortcut?.id,
        name: trimmedName,
        keys,
        app: app.trim() || "KeyBase",
        os: os.trim() || "any",
        description: description.trim(),
        tags: parsedTags,
      });
      onClose();
    } catch {
      setError("Failed to save shortcut. Check your backend connection.");
    } finally {
      setSaving(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void submitForm();
  };

  const handleFormKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === "Enter" && !recording) {
      e.preventDefault();
      void submitForm();
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
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-edit-shortcut-title"
        className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="flex justify-between items-center mb-6">
          <h2
            id="add-edit-shortcut-title"
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            {shortcut ? "Edit Shortcut" : "Add New Shortcut"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={saving}
            aria-label="Close modal"
            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X size={20} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          onKeyDown={handleFormKeyDown}
          className="flex flex-col gap-4"
        >
          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
              Name
            </label>
            <input
              type="text"
              placeholder="e.g. Copy Text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => setTouched((t) => ({ ...t, name: true }))}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
            {touched.name && !trimmedName && (
              <p className="text-xs text-red-500 mt-1">Name is required</p>
            )}
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
              Shortcut Keys
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Control, c"
                value={keys.join(", ")}
                readOnly={recording}
                onBlur={() => setTouched((t) => ({ ...t, keys: true }))}
                onChange={(e) =>
                  setKeys(
                    e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter(Boolean)
                  )
                }
                className="min-w-0 flex-1 p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={recording ? stopRecording : startRecording}
                className={`shrink-0 px-4 py-2.5 rounded-lg font-medium text-sm transition-all ${
                  recording
                    ? "bg-red-500 text-white animate-pulse"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-300 dark:hover:bg-slate-600"
                }`}
              >
                {recording ? "Stop" : "Record"}
              </button>
            </div>
            {recording && (
              <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 animate-pulse">
                Press keys on your keyboard, then click Stop...
              </p>
            )}
            {touched.keys && keys.length === 0 && !recording && (
              <p className="text-xs text-red-500 mt-1">
                At least one key is required
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                App Name
              </label>
              <input
                type="text"
                list="keybase-app-suggestions"
                placeholder="e.g. VS Code"
                value={app}
                onChange={(e) => setApp(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <datalist id="keybase-app-suggestions">
                {appSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
                OS
              </label>
              <input
                type="text"
                list="keybase-os-suggestions"
                placeholder="e.g. Linux"
                value={os}
                onChange={(e) => setOs(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              />
              <datalist id="keybase-os-suggestions">
                {osSuggestions.map((item) => (
                  <option key={item} value={item} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
              Description
            </label>
            <textarea
              rows={3}
              placeholder="What does this shortcut do?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-y"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1 block">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="productivity, coding"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            />
          </div>

          {error && (
            <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
          )}

          <div className="flex items-center justify-between gap-3 mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <span className="hidden sm:inline text-xs text-slate-400">
              Tip: Ctrl + Enter to save
            </span>
            <div className="flex justify-end gap-3 ml-auto">
              <button
                type="button"
                onClick={onClose}
                disabled={saving}
                className="px-5 py-2.5 rounded-lg text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!isValid || saving}
                className={`px-5 py-2.5 rounded-lg text-sm font-medium text-white transition-all shadow-md ${
                  isValid && !saving
                    ? "bg-blue-600 hover:bg-blue-700 hover:shadow-lg active:scale-95"
                    : "bg-slate-400 dark:bg-slate-600 cursor-not-allowed opacity-70"
                }`}
              >
                {saving ? "Saving..." : "Save Shortcut"}
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
