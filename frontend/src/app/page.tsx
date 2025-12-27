"use client";

import * as React from "react";

export default function Home() {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [shortcuts, setShortcuts] = React.useState([
    { id: 1, app: "VSCode", key: "Ctrl+P", description: "Open file" },
    { id: 2, app: "Chrome", key: "Ctrl+T", description: "New tab" },
    { id: 3, app: "Terminal", key: "Ctrl+Shift+T", description: "New tab" },
  ]);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredShortcuts = shortcuts.filter(
    (sc) =>
      sc.app.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sc.key.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-6">
      {/* Search bar */}
      <div className="w-full max-w-3xl mx-auto">
        <input
          type="text"
          placeholder="Search shortcuts..."
          value={searchQuery}
          onChange={handleSearch}
          className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />
      </div>

      {/* Add new shortcut button */}
      <div className="w-full max-w-3xl mx-auto flex justify-end">
        <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition shadow">
          + Add New Shortcut
        </button>
      </div>

      {/* Shortcut list */}
      <div className="w-full max-w-3xl mx-auto flex flex-col gap-4">
        {filteredShortcuts.map((sc) => (
          <div
            key={sc.id}
            className="flex justify-between items-center p-4 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700 shadow-sm"
          >
            <div>
              <h3 className="font-semibold text-lg">{sc.app}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {sc.description}
              </p>
            </div>
            <div className="flex gap-2 items-center">
              <span className="px-3 py-1 bg-gray-200 dark:bg-gray-600 rounded text-sm font-mono">
                {sc.key}
              </span>
              <button className="px-3 py-1 text-sm rounded bg-green-500 hover:bg-green-600 text-white transition">
                Quick Update
              </button>
              <button className="px-3 py-1 text-sm rounded bg-yellow-500 hover:bg-yellow-600 text-white transition">
                Edit Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
