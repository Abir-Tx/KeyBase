"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddEditShortcutModal from "@/components/AddEditShortcutModal";
import RecordKeysModal from "@/components/RecordKeysModal";
import DeleteConfirmModal from "@/components/DeleteConfirmModal";
import {
  fetchShortcuts,
  addShortcut,
  updateShortcut,
  Shortcut,
  deleteShortcut,
} from "@/lib/api";
import ShortcutCard from "@/components/ShortcutCard";
import { Search, Plus, X, AlertCircle, RotateCw } from "lucide-react";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Modals
  const [editingShortcut, setEditingShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [recordShortcut, setRecordShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [recordModalOpen, setRecordModalOpen] = React.useState(false);
  const [deletingShortcut, setDeletingShortcut] =
    React.useState<Shortcut | null>(null);

  const loadData = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchShortcuts();
      setShortcuts(data);
    } catch (err) {
      console.error("Failed to fetch shortcuts", err);
      setError("Could not load shortcuts from the backend API.");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  // Add/Edit Save
  const handleSave = async (sc: Shortcut) => {
    const payload: Shortcut = {
      ...sc,
      keys: sc.keys && sc.keys.length ? sc.keys : [sc.name],
      tags: sc.tags || [],
      os: sc.os || "any",
    };

    if (editingShortcut && editingShortcut.id) {
      const updated = await updateShortcut(payload);
      setShortcuts((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } else {
      const newSc = await addShortcut(payload);
      setShortcuts((prev) => [...prev, newSc]);
    }
    setEditingShortcut(null);
  };

  // Record Keys Save
  const handleRecordKeysSave = async (keys: string[]) => {
    if (!recordShortcut) return;
    const updated = await updateShortcut({
      ...recordShortcut,
      keys,
    });
    setShortcuts((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s))
    );
    setRecordShortcut(null);
  };

  // Delete Confirm
  const handleConfirmDelete = async (shortcut: Shortcut) => {
    if (!shortcut.id) return;
    try {
      await deleteShortcut(shortcut);
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
    } catch (err) {
      console.error("Failed to delete shortcut", err);
      setError(`Failed to delete "${shortcut.name}". Please try again.`);
      throw err;
    }
  };

  // Filter across name, app, description, keys, os, and tags
  const q = searchQuery.trim().toLowerCase();
  const filteredShortcuts = q
    ? shortcuts.filter((sc) => {
        const nameMatch = sc.name?.toLowerCase().includes(q) ?? false;
        const appMatch = sc.app?.toLowerCase().includes(q) ?? false;
        const descMatch = sc.description?.toLowerCase().includes(q) ?? false;
        const osMatch = sc.os?.toLowerCase().includes(q) ?? false;
        const keyMatch =
          sc.keys?.some((k) => k.toLowerCase().includes(q)) ?? false;
        const tagMatch =
          sc.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        return (
          nameMatch || appMatch || descMatch || osMatch || keyMatch || tagMatch
        );
      })
    : shortcuts;

  const groupedShortcuts = filteredShortcuts.reduce(
    (groups: Record<string, Shortcut[]>, sc) => {
      const appName = sc.app || "General";
      if (!groups[appName]) groups[appName] = [];
      groups[appName].push(sc);
      return groups;
    },
    {}
  );

  const appNames = Object.keys(groupedShortcuts);

  return (
    <div className="flex flex-col gap-8 max-w-6xl mx-auto">
      {/* Top Bar: Search & Add */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search shortcuts, apps, keys, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder:text-slate-400 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              aria-label="Clear search"
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingShortcut(null);
            setModalOpen(true);
          }}
          className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 transition shadow-lg hover:shadow-blue-500/25 active:scale-95 duration-200"
        >
          <Plus size={20} />
          Add Shortcut
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 text-sm"
        >
          <div className="flex items-center gap-2">
            <AlertCircle size={18} className="shrink-0" />
            <span>{error}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={loadData}
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-900/60 font-medium transition"
            >
              <RotateCw size={14} />
              Retry
            </button>
            <button
              type="button"
              onClick={() => setError(null)}
              aria-label="Dismiss error"
              className="p-1 rounded hover:bg-red-100 dark:hover:bg-red-900/40"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Content Area */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : appNames.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-500 dark:text-slate-400"
          >
            <p className="text-lg font-medium">
              {error ? "Unable to display shortcuts." : "No shortcuts found."}
            </p>
            {q && (
              <p className="text-sm mt-1">
                Try searching for a different keyword, key, or tag.
              </p>
            )}
          </motion.div>
        ) : (
          <div className="flex flex-col gap-10">
            {appNames.map((app) => (
              <motion.section
                key={app}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col gap-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="w-1.5 h-6 bg-blue-500 rounded-full" />
                    <h2 className="text-xl font-bold text-slate-800 dark:text-blue-400">
                      {app}
                    </h2>
                    <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-200/70 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                      {groupedShortcuts[app].length}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {groupedShortcuts[app].map((sc) => (
                    <ShortcutCard
                      key={sc.id}
                      shortcut={sc}
                      onEditDetails={(item) => {
                        setEditingShortcut(item);
                        setModalOpen(true);
                      }}
                      onRecordKeys={(item) => {
                        setRecordShortcut(item);
                        setRecordModalOpen(true);
                      }}
                      onDelete={(item) => setDeletingShortcut(item)}
                    />
                  ))}
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {modalOpen && (
          <AddEditShortcutModal
            shortcut={editingShortcut}
            onClose={() => {
              setModalOpen(false);
              setEditingShortcut(null);
            }}
            onSave={handleSave}
          />
        )}

        {recordModalOpen && recordShortcut && (
          <RecordKeysModal
            shortcut={recordShortcut}
            onClose={() => {
              setRecordModalOpen(false);
              setRecordShortcut(null);
            }}
            onSave={handleRecordKeysSave}
          />
        )}

        {deletingShortcut && (
          <DeleteConfirmModal
            shortcut={deletingShortcut}
            onClose={() => setDeletingShortcut(null)}
            onConfirm={handleConfirmDelete}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
