"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import AddEditShortcutModal from "@/components/AddEditShortcutModal";
import RecordKeysModal from "@/components/RecordKeysModal";
import {
  fetchShortcuts,
  addShortcut,
  updateShortcut,
  Shortcut,
  deleteShortcut,
} from "@/lib/api";
import ShortcutCard from "@/components/ShortcutCard";
import { Search, Plus } from "lucide-react";

// Animation Variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([]);
  const [loading, setLoading] = React.useState(true);

  // Modals
  const [editingShortcut, setEditingShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [modalOpen, setModalOpen] = React.useState(false);
  const [recordShortcut, setRecordShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [recordModalOpen, setRecordModalOpen] = React.useState(false);

  // Load shortcuts
  React.useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchShortcuts();
        setShortcuts(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Handle Add/Edit Save
  const handleSave = async (sc: Shortcut) => {
    try {
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
    } catch (err) {
      console.error("Failed to save shortcut", err);
    } finally {
      setModalOpen(false);
      setEditingShortcut(null);
    }
  };

  // Handle Record Keys Save
  const handleRecordKeysSave = async (keys: string[]) => {
    if (!recordShortcut) return;
    try {
      const updated = await updateShortcut({
        ...recordShortcut,
        keys,
      });
      setShortcuts((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s))
      );
    } catch (err) {
      console.error(err);
    } finally {
      setRecordShortcut(null);
      setRecordModalOpen(false);
    }
  };

  // Handle Delete
  const handleDeleteShortcut = async (shortcut: Shortcut) => {
    if (!shortcut.id) return;
    const ok = confirm(`Delete shortcut "${shortcut.name}"?`);
    if (!ok) return;

    try {
      await deleteShortcut(shortcut);
      setShortcuts((prev) => prev.filter((s) => s.id !== shortcut.id));
    } catch (err) {
      console.error(err);
    }
  };

  // 🔍 Filter Logic (Runs on every render based on searchQuery)
  const q = searchQuery.toLowerCase();
  const filteredShortcuts = shortcuts.filter((sc) => {
    const nameMatch = sc.name?.toLowerCase().includes(q) ?? false;
    const appMatch = sc.app?.toLowerCase().includes(q) ?? false;
    const descMatch = sc.description?.toLowerCase().includes(q) ?? false;
    const keyMatch = sc.keys?.some((k) => k.toLowerCase().includes(q)) ?? false;
    return nameMatch || appMatch || descMatch || keyMatch;
  });

  const groupedShortcuts = filteredShortcuts.reduce(
    (groups: Record<string, Shortcut[]>, sc) => {
      const appName = sc.app || "General";
      if (!groups[appName]) groups[appName] = [];
      groups[appName].push(sc);
      return groups;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-8 px-4 md:px-0 max-w-6xl mx-auto">
      {/* Top Bar: Search & Add */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search shortcuts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          />
        </div>

        {/* Add Button */}
        <button
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

      {/* Content Area */}
      <div className="w-full">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        ) : Object.keys(groupedShortcuts).length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20 text-slate-500 dark:text-slate-400"
          >
            <p className="text-lg">No shortcuts found.</p>
            {searchQuery && (
              <p className="text-sm">Try searching for something else.</p>
            )}
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            key={searchQuery} // Re-trigger stagger animation on search
            className="flex flex-col gap-10"
          >
            {Object.keys(groupedShortcuts).map((app) => (
              <motion.div
                key={app}
                variants={itemVariants}
                className="flex flex-col gap-4"
              >
                {/* Header with explicit text colors for Light/Dark */}
                <div className="flex items-center gap-3">
                  <span className="w-1.5 h-6 bg-blue-500 rounded-full"></span>
                  {/* The Shortcut Apps name heading */}
                  <h2 className="text-xl font-bold text-slate-800 dark:text-blue-500">
                    {app}
                  </h2>
                </div>

                <div className="flex flex-wrap gap-6">
                  {groupedShortcuts[app].map((sc) => (
                    <ShortcutCard
                      key={sc.id}
                      shortcut={sc}
                      onEditDetails={(sc) => {
                        setEditingShortcut(sc);
                        setModalOpen(true);
                      }}
                      onRecordKeys={(sc) => {
                        setRecordShortcut(sc);
                        setRecordModalOpen(true);
                      }}
                      onDelete={handleDeleteShortcut}
                    />
                  ))}
                </div>
              </motion.div>
            ))}
          </motion.div>
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
            onClose={() => setRecordModalOpen(false)}
            onSave={handleRecordKeysSave}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
