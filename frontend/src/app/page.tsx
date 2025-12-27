"use client";

import * as React from "react";
import AddEditShortcutModal from "@/components/AddEditShortcutModal";
import {
  fetchShortcuts,
  addShortcut,
  updateShortcut,
  Shortcut,
} from "@/lib/api";
import ShortcutCard from "@/components/ShortcutCard";
import ShortcutRecorder from "@/components/ShortcutRecorder";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([]);
  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingShortcut, setEditingShortcut] = React.useState<Shortcut | null>(
    null
  );
  const [loading, setLoading] = React.useState(true);

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

  const handleSave = async (sc: Shortcut) => {
    try {
      const payload: Shortcut = {
        ...sc,
        keys: sc.keys && sc.keys.length ? sc.keys : [sc.name],
        tags: sc.tags || [],
        os: sc.os || "any",
      };

      if (editingShortcut) {
        const updated = await updateShortcut(payload);
        setShortcuts((prev) =>
          prev.map((s) => (s.id === updated.id ? updated : s))
        );
      } else {
        const newSc = await addShortcut(payload);
        setShortcuts((prev) => [...prev, newSc]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setModalOpen(false);
      setEditingShortcut(null);
    }
  };

  const filteredShortcuts = shortcuts.filter(
    (sc) =>
      sc.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.keys.some((k) => k.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const groupedShortcuts = filteredShortcuts.reduce(
    (groups: Record<string, Shortcut[]>, sc) => {
      if (!groups[sc.app]) groups[sc.app] = [];
      groups[sc.app].push(sc);
      return groups;
    },
    {}
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="w-full max-w-4xl mx-auto">
        <input
          type="text"
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Add button */}
      <div className="w-full max-w-4xl mx-auto flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
        >
          + Add New Shortcut
        </button>
      </div>

      {/* Shortcut cards */}
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6">
        {loading ? (
          <p className="text-gray-600 dark:text-gray-300">
            Loading shortcuts...
          </p>
        ) : Object.keys(groupedShortcuts).length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">
            No shortcuts found.
          </p>
        ) : (
          Object.keys(groupedShortcuts).map((app) => (
            <div key={app}>
              <h2 className="text-2xl font-bold mb-3 text-gray-900 dark:text-gray-100">
                {app}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {groupedShortcuts[app].map((sc) => (
                  <ShortcutCard
                    key={sc.id}
                    shortcut={sc}
                    onEdit={(shortcut) => {
                      setEditingShortcut(shortcut);
                      setModalOpen(true);
                    }}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

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

      <ShortcutRecorder
        initialKeys={[]} // no keys yet
        onSave={(keys) => console.log("Captured keys:", keys)}
      />
    </div>
  );
}
