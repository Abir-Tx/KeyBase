"use client";

import * as React from "react";
import AddEditShortcutModal from "@/components/AddEditShortcutModal";

type Shortcut = {
  id: number;
  app: string;
  key: string;
  description: string;
};

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState<Shortcut[]>([
    { id: 1, app: "VSCode", key: "Ctrl+P", description: "Open file" },
    {
      id: 2,
      app: "VSCode",
      key: "Ctrl+Shift+P",
      description: "Command Palette",
    },
    { id: 3, app: "Chrome", key: "Ctrl+T", description: "New tab" },
    { id: 4, app: "Terminal", key: "Ctrl+Shift+T", description: "New tab" },
  ]);

  const [modalOpen, setModalOpen] = React.useState(false);
  const [editingShortcut, setEditingShortcut] = React.useState<Shortcut | null>(
    null
  );

  const filteredShortcuts = shortcuts.filter(
    (sc) =>
      sc.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedShortcuts = filteredShortcuts.reduce(
    (groups: Record<string, Shortcut[]>, sc) => {
      if (!groups[sc.app]) groups[sc.app] = [];
      groups[sc.app].push(sc);
      return groups;
    },
    {}
  );

  const handleSave = (sc: Shortcut) => {
    if (editingShortcut) {
      // Update existing
      setShortcuts((prev) => prev.map((s) => (s.id === sc.id ? sc : s)));
    } else {
      // Add new
      setShortcuts((prev) => [...prev, { ...sc, id: Date.now() }]);
    }
    setModalOpen(false);
    setEditingShortcut(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search */}
      <div className="w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Add new shortcut */}
      <div className="w-full max-w-3xl mx-auto flex justify-end">
        <button
          onClick={() => setModalOpen(true)}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow"
        >
          + Add New Shortcut
        </button>
      </div>

      {/* Shortcut list grouped by app */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-6">
        {Object.keys(groupedShortcuts).map((app) => (
          <div key={app}>
            <h2 className="text-xl font-bold mb-2">{app}</h2>
            <div className="flex flex-col gap-4">
              {groupedShortcuts[app].map((sc) => (
                <div
                  key={sc.id}
                  className="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 shadow-sm"
                >
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {sc.description}
                    </p>
                  </div>
                  <div className="flex gap-2 items-center">
                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono">
                      {sc.key}
                    </span>
                    <button
                      onClick={() => {
                        setEditingShortcut(sc);
                        setModalOpen(true);
                      }}
                      className="px-3 py-1 text-sm rounded bg-yellow-500 hover:bg-yellow-600 text-white transition"
                    >
                      Edit
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Modal */}
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
    </div>
  );
}
