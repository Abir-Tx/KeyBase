"use client";

import * as React from "react";
import { Shortcut } from "@/lib/api";
import {
  exportShortcutsAsJson,
  exportShortcutsAsMarkdown,
  getConflictKey,
  parseImportedShortcutsJson,
} from "@/lib/shortcuts";
import { motion } from "framer-motion";
import { Download, FileText, Upload, X, CheckCircle2 } from "lucide-react";

type ImportExportModalProps = {
  allShortcuts: Shortcut[];
  filteredShortcuts: Shortcut[];
  hasActiveFilters: boolean;
  onImportShortcuts: (items: Shortcut[]) => Promise<number>;
  onClose: () => void;
};

export default function ImportExportModal({
  allShortcuts,
  filteredShortcuts,
  hasActiveFilters,
  onImportShortcuts,
  onClose,
}: ImportExportModalProps) {
  const [exportScope, setExportScope] = React.useState<"all" | "filtered">(
    hasActiveFilters ? "filtered" : "all"
  );
  const [pendingItems, setPendingItems] = React.useState<Shortcut[] | null>(
    null
  );
  const [skippedCount, setSkippedCount] = React.useState(0);
  const [importing, setImporting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [successMsg, setSuccessMsg] = React.useState<string | null>(null);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  React.useEffect(() => {
    if (importing) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [importing, onClose]);

  const exportTarget =
    exportScope === "filtered" ? filteredShortcuts : allShortcuts;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setSuccessMsg(null);
    try {
      const text = await file.text();
      const parsed = parseImportedShortcutsJson(text);

      const existingKeys = new Set(
        allShortcuts.map(
          (sc) => `${sc.name.trim().toLowerCase()}::${getConflictKey(sc)}`
        )
      );

      const unique: Shortcut[] = [];
      let skipped = 0;
      for (const item of parsed) {
        const sig = `${item.name.trim().toLowerCase()}::${getConflictKey(item)}`;
        if (existingKeys.has(sig)) {
          skipped += 1;
        } else {
          existingKeys.add(sig);
          unique.push(item);
        }
      }

      setPendingItems(unique);
      setSkippedCount(skipped);
    } catch (err) {
      setPendingItems(null);
      setSkippedCount(0);
      setError(
        err instanceof Error ? err.message : "Could not parse JSON file."
      );
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleConfirmImport = async () => {
    if (!pendingItems || pendingItems.length === 0 || importing) return;
    setImporting(true);
    setError(null);
    try {
      const added = await onImportShortcuts(pendingItems);
      setSuccessMsg(`Imported ${added} shortcut${added === 1 ? "" : "s"}.`);
      setPendingItems(null);
      setSkippedCount(0);
    } catch {
      setError("Failed while importing shortcuts to the backend.");
    } finally {
      setImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={importing ? undefined : onClose}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
      />

      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        role="dialog"
        aria-modal="true"
        aria-labelledby="import-export-title"
        className="relative w-full max-w-lg rounded-xl bg-white dark:bg-slate-900 p-6 shadow-2xl border border-slate-200 dark:border-slate-800"
      >
        <div className="flex items-center justify-between mb-5">
          <h2
            id="import-export-title"
            className="text-xl font-bold text-slate-900 dark:text-white"
          >
            Backup, Export & Import
          </h2>
          <button
            type="button"
            onClick={onClose}
            disabled={importing}
            aria-label="Close modal"
            className="p-1.5 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Export Section */}
        <div className="mb-6">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Export Shortcuts
            </h3>
            {hasActiveFilters && (
              <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 p-0.5 text-xs">
                <button
                  type="button"
                  onClick={() => setExportScope("filtered")}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    exportScope === "filtered"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  Filtered ({filteredShortcuts.length})
                </button>
                <button
                  type="button"
                  onClick={() => setExportScope("all")}
                  className={`px-2.5 py-1 rounded-md font-medium transition ${
                    exportScope === "all"
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 dark:text-slate-300"
                  }`}
                >
                  All ({allShortcuts.length})
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => exportShortcutsAsJson(exportTarget)}
              disabled={exportTarget.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-medium transition disabled:opacity-50"
            >
              <Download size={16} className="text-blue-600 dark:text-blue-400" />
              Export JSON ({exportTarget.length})
            </button>
            <button
              type="button"
              onClick={() => exportShortcutsAsMarkdown(exportTarget)}
              disabled={exportTarget.length === 0}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-100 text-sm font-medium transition disabled:opacity-50"
            >
              <FileText
                size={16}
                className="text-emerald-600 dark:text-emerald-400"
              />
              Markdown Cheat Sheet
            </button>
          </div>
        </div>

        {/* Import Section */}
        <div className="pt-5 border-t border-slate-200 dark:border-slate-800">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
            Import JSON Backup
          </h3>

          <input
            ref={fileInputRef}
            type="file"
            accept=".json,application/json"
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={importing}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg border border-dashed border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 hover:border-blue-500 dark:hover:border-blue-500 text-slate-700 dark:text-slate-300 text-sm font-medium transition"
          >
            <Upload size={16} />
            Choose KeyBase JSON file...
          </button>

          {pendingItems && (
            <div className="mt-4 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 text-sm">
              <p className="text-slate-800 dark:text-slate-200 font-medium">
                Ready to import {pendingItems.length} new shortcut
                {pendingItems.length === 1 ? "" : "s"}
                {skippedCount > 0 && (
                  <span className="text-slate-500 dark:text-slate-400 font-normal">
                    {" "}
                    ({skippedCount} exact duplicate
                    {skippedCount === 1 ? "" : "s"} skipped)
                  </span>
                )}
              </p>
              <div className="flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => {
                    setPendingItems(null);
                    setSkippedCount(0);
                  }}
                  disabled={importing}
                  className="px-3 py-1.5 rounded-md text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-800"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={handleConfirmImport}
                  disabled={importing || pendingItems.length === 0}
                  className="px-3 py-1.5 rounded-md text-xs font-medium bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50"
                >
                  {importing ? "Importing..." : "Confirm Import"}
                </button>
              </div>
            </div>
          )}

          {error && (
            <p className="mt-3 text-xs text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {successMsg && (
            <p className="mt-3 text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
              <CheckCircle2 size={14} />
              {successMsg}
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
